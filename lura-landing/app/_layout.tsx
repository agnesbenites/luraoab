import React, { useEffect, useState } from 'react';
import { Slot, useRouter, useSegments } from 'expo-router';
import { ActivityIndicator, View } from 'react-native';
import { supabase } from '../src/lib/supabase';

export default function RootLayout() {
  const [isLoading, setIsLoading] = useState(true);
  const [userSession, setSession] = useState<any>(null);
  const [hasAcceptedTerms, setHasAcceptedTerms] = useState<boolean>(false);
  
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    // 1. Escuta as mudanças de estado de autenticação no Supabase
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      setSession(session);

      if (session?.user) {
        try {
          // Busca no banco se esse perfil já aceitou os termos de adesão
          const { data, error } = await supabase
            .from('profiles')
            .select('terms_accepted')
            .eq('id', session.user.id)
            .single();

          if (data && !error) {
            setHasAcceptedTerms(data.terms_accepted);
          }
        } catch (err) {
          console.error("Erro ao buscar perfil:", err);
        }
      } else {
        setHasAcceptedTerms(false);
      }
      setIsLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (isLoading) return;

    const inAuthGroup = segments[0] === '(auth)';
    const inActivateScreen = segments[0] === 'activate';

    // 2. LOGICA DE REDIRECIONAMENTO JURÍDICO/COMERCIAL
    if (!userSession) {
      // Se não está logado, força ir para a tela de registro/login se tentar entrar no app
      if (inAuthGroup || inActivateScreen) {
        router.replace('/register'); 
      }
    } else if (userSession && !hasAcceptedTerms) {
      // ESTÁ LOGADO MAS NÃO ACEITOU OS TERMOS: Redireciona imediatamente para a ativação
      if (!inActivateScreen) {
        router.replace('/activate');
      }
    } else if (userSession && hasAcceptedTerms) {
      // TUDO CERTO: Manda para a home do aplicativo
      if (inActivateScreen || segments[0] === 'register' || segments[0] === 'login') {
        router.replace('/(auth)/home'); // Altere para a sua rota interna padrão
      }
    }
  }, [userSession, hasAcceptedTerms, segments, isLoading]);

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#121212' }}>
        <ActivityIndicator size="large" color="#b794ff" />
      </View>
    );
  }

  return <Slot />;
}
