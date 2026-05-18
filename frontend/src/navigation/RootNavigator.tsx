import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { View, ActivityIndicator } from 'react-native';
import { useAuth } from '../context/AuthContext';

import MainNavigator from './MainNavigator';
import RegisterScreen from '../screens/auth/RegisterScreen';
import LoginScreen from '../screens/auth/LoginScreen';
import OnboardingScreen from '../screens/auth/OnboardingScreen';
import ProfileQuizScreen from '../screens/auth/ProfileQuizScreen';
import PaywallScreen from '../screens/auth/PaywallScreen'; // Sua tela de faturamento Mercado Pago
import PortalSegundaFase from '../screens/segundaFase/PortalSegundaFase';
import HubSegundaFase from '../screens/segundaFase/HubSegundaFase';
import EscolhaEstrategica from '../screens/segundaFase/EscolhaEstrategica';
import AreaHome from '../screens/segundaFase/AreaHome';
import Repescagem from '../screens/segundaFase/Repescagem';
import ProvasReais from '../screens/segundaFase/ProvasReais';
import SimuladoCompleto from '../screens/segundaFase/SimuladoCompleto';
import TreinoPecas from '../screens/segundaFase/TreinoPecas';
import Dissertativas from '../screens/segundaFase/Dissertativas';
import DissertativasOAB from '../screens/segundaFase/DissertativasOAB';
import DissertativasIA from '../screens/segundaFase/DissertativasIA';
import Desempenho2fase from '../screens/segundaFase/Desempenho2fase';
import GabaritoExame from '../screens/segundaFase/GabaritoExame';
import ProvaExame from '../screens/segundaFase/ProvaExame';
import Perfil from '../screens/Perfil';

const Stack = createNativeStackNavigator();

export default function RootNavigator() {
  // Adicionado o estado de assinatura (isPremium) que deve vir do seu contexto de autenticação
  const { user, loading, isPremium } = useAuth();

  if (loading) {
    return (
      <View style={{ flex: 1, backgroundColor: '#0f0f1a', justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#7C3AED" />
      </View>
    );
  }

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {user ? (
        // USUÁRIO AUTENTICADO
        !isPremium ? (
          // CONTROLE JURÍDICO/COMERCIAL: Se não pagou ou não aceitou os termos, fica retido no Paywall
          <>
            <Stack.Screen name="Paywall" component={PaywallScreen} />
            <Stack.Screen name="Perfil" component={Perfil} /> 
          </>
        ) : (
          // ACESSO PREMIUM TOTAL LIBERADO
          <>
            <Stack.Screen name="App" component={MainNavigator} />
            <Stack.Screen name="ProfileQuiz" component={ProfileQuizScreen} />
            <Stack.Screen name="PortalSegundaFase" component={PortalSegundaFase} />
            <Stack.Screen name="HubSegundaFase" component={HubSegundaFase} />
            <Stack.Screen name="EscolhaEstrategica" component={EscolhaEstrategica} />
            <Stack.Screen name="AreaHome" component={AreaHome} />
            <Stack.Screen name="Repescagem" component={Repescagem} />
            <Stack.Screen name="ProvasReais" component={ProvasReais} />
            <Stack.Screen name="SimuladoCompleto" component={SimuladoCompleto} />
            <Stack.Screen name="TreinoPecas" component={TreinoPecas} />
            <Stack.Screen name="Dissertativas" component={Dissertativas} />
            <Stack.Screen name="DissertativasOAB" component={DissertativasOAB} />
            <Stack.Screen name="DissertativasIA" component={DissertativasIA} />
            <Stack.Screen name="Desempenho2fase" component={Desempenho2fase} />
            <Stack.Screen name="GabaritoExame" component={GabaritoExame} />
            <Stack.Screen name="ProvaExame" component={ProvaExame} />
            <Stack.Screen name="Perfil" component={Perfil} />
          </>
        )
      ) : (
        // USUÁRIO DESLOGADO
        <>
          <Stack.Screen name="Onboarding" component={OnboardingScreen} />
          <Stack.Screen name="Register" component={RegisterScreen} />
          <Stack.Screen name="Login" component={LoginScreen} />
        </>
      )}
    </Stack.Navigator>
  );
}