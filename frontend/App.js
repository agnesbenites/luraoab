import React from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { NavigationContainer } from '@react-navigation/native';
import * as Linking from 'expo-linking';
import { AuthProvider } from './src/context/AuthContext';
import RootNavigator from './src/navigation/RootNavigator';

const prefix = Linking.createURL('/');

const linking = {
  prefixes: [prefix, 'luraoab://'],
  config: {
    screens: {
      Onboarding: 'onboarding',
      Register: 'register',
      Login: 'login',
      ResetPassword: 'reset-senha',
      App: {
        screens: {
          Início: '',
          Simulados: 'simulados',
          Insights: 'insights',
          Vade: 'vade',
          Desempenho: 'desempenho',
        },
      },
      Paywall: 'paywall',
      Perfil: 'perfil',
      ProfileQuiz: 'profile-quiz',
      PortalSegundaFase: 'portal-segunda-fase',
      HubSegundaFase: 'hub-segunda-fase',
      EscolhaEstrategica: 'escolha-estrategica',
      AreaHome: 'area-home',
      Repescagem: 'repescagem',
      ProvasReais: 'provas-reais',
      SimuladoCompleto: 'simulado-completo',
      TreinoPecas: 'treino-pecas',
      Dissertativas: 'dissertativas',
      DissertativasOAB: 'dissertativas-oab',
      DissertativasIA: 'dissertativas-ia',
      Desempenho2fase: 'desempenho-2fase',
      GabaritoExame: 'gabarito-exame',
      ProvaExame: 'prova-exame',
    },
  },
};

export default function App() {
  return (
    <SafeAreaProvider>
      <AuthProvider>
        <NavigationContainer linking={linking}>
          <RootNavigator />
        </NavigationContainer>
      </AuthProvider>
    </SafeAreaProvider>
  );
}