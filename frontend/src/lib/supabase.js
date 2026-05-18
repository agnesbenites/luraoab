import { createClient } from '@supabase/supabase-js';
import { Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY;

// Padrão Singleton: Garante que o cliente só seja criado UMA VEZ na memória global da aplicação
if (!global._supabaseInstance) {
  global._supabaseInstance = createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
      storage: Platform.OS === 'web' ? window.localStorage : AsyncStorage,
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: Platform.OS === 'web', // Ativado na web para lidar com retornos/oauth
    },
  });
}

export const supabase = global._supabaseInstance;

// REMOVIDO: O supabaseAdmin (Service Role) foi removido daqui do front-end por segurança.
// Para criar o perfil pós-cadastro de forma segura sem vazar a chave mestre, 
// o próprio Supabase Auth faz isso via Trigger ou usamos a chave Anon padrão com RLS ativa.
export const supabaseAdmin = supabase; 
