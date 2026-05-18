import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';

const AuthContext = createContext({});

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isPremium, setIsPremium] = useState(false); // Controle comercial do Paywall
  const [loading, setLoading] = useState(true);

  // Função isolada e blindada para checar o status de faturamento
  const checarStatusAssinatura = async (userId) => {
    try {
      const { data, error } = await supabase
        .from('perfis')
        .select('assinatura_ativa')
        .eq('id', userId)
        .maybeSingle(); // maybeSingle evita estourar erro 400 se o perfil demorar milisegundos para registrar

      if (data && !error) {
        setIsPremium(!!data.assinatura_ativa);
      } else {
        setIsPremium(false);
      }
    } catch (err) {
      console.error('Erro ao buscar status de faturamento:', err);
      setIsPremium(false);
    } finally {
      // GARANTIA MÁXIMA: Força a liberação da tela destravando o spinner
      setLoading(false);
    }
  };

  useEffect(() => {
    let inicializado = false;

    // 1. Verifica se já existe uma sessão salva no LocalStorage (Web) ou AsyncStorage (Mobile)
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (inicializado) return;
      
      const currentUser = session?.user ?? null;
      setUser(currentUser);
      
      if (currentUser) {
        checarStatusAssinatura(currentUser.id);
      } else {
        setIsPremium(false);
        setLoading(false); // Libera o fluxo para telas públicas (Login/Onboarding)
      }
    }).catch((err) => {
      console.error("Erro na busca da sessão inicial:", err);
      setLoading(false);
    });

    // 2. Escuta eventos de Auth em tempo real (Login, Cadastro, Logout)
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      inicializado = true;
      const currentUser = session?.user ?? null;
      setUser(currentUser);

      if (currentUser) {
        await checarStatusAssinatura(currentUser.id);
      } else {
        setIsPremium(false);
        setLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  // 3. Ouvinte Realtime do Supabase: Atualiza o app sozinho assim que o Webhook rodar no backend
  useEffect(() => {
    if (!user) return;

    const canalPerfil = supabase
      .channel(`perfil_mudanca_${user.id}`)
      .on(
        'postgres_changes',
        { event: 'UPDATE', filter: `id=eq.${user.id}`, schema: 'public', table: 'perfis' },
        (payload) => {
          if (payload.new && typeof payload.new.assinatura_ativa !== 'undefined') {
            setIsPremium(!!payload.new.assinatura_ativa);
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(canalPerfil);
    };
  }, [user]);

  const signIn = async (email, senha) => {
    const { error } = await supabase.auth.signInWithPassword({ email, password: senha });
    if (error) throw error;
  };

  const signUp = async (email, senha, nome) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password: senha,
      options: { data: { nome } }
    });
    if (error) throw error;

    if (data?.user) {
      // Uso do cliente 'supabase' comum (Anon Key) blindado com práticas seguras
      // .upsert evita o erro 409 (Conflict) caso o registro sofra concorrência
      const { error: perfilError } = await supabase
        .from('perfis')
        .upsert([{ id: data.user.id, nome, assinatura_ativa: false }], { onConflict: 'id' });
      
      if (perfilError) throw perfilError;
    }
  };

  const signOut = async () => {
    await supabase.auth.signOut();
  };

  return (
    <AuthContext.Provider value={{ user, loading, isPremium, signIn, signUp, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
