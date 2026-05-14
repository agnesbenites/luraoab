import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { View, ActivityIndicator } from 'react-native';
import { useAuth } from '../context/AuthContext';


import MainNavigator from './MainNavigator';
import RegisterScreen from '../screens/auth/RegisterScreen';
import LoginScreen from '../screens/auth/LoginScreen';
import OnboardingScreen from '../screens/auth/OnboardingScreen';
import ProfileQuizScreen from '../screens/auth/ProfileQuizScreen';
import PaywallScreen from '../screens/auth/PaywallScreen';
import PortalSegundaFase from '../screens/segundaFase/PortalSegundaFase';
import HubSegundaFase from '../screens/segundaFase/HubSegundaFase';
import EscolhaEstrategica from '../screens/segundaFase/EscolhaEstrategica';
import AreaHome from '../screens/segundaFase/AreaHome';
import Repescagem from '../screens/segundaFase/Repescagem';
import ProvasReais from '../screens/segundaFase/ProvasReais';
import SimuladoCompleto from '../screens/segundaFase/SimuladoCompleto';
import TreinoPecas from '../screens/segundaFase/TreinoPecas';
import Dissertativas from '../screens/segundaFase/Dissertativas';
import Desempenho2fase from '../screens/segundaFase/Desempenho2fase';
import GabaritoExame from '../screens/segundaFase/GabaritoExame';

const Stack = createNativeStackNavigator();

export default function RootNavigator() {
  const { user, loading } = useAuth();

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
        // Usuário logado
        <>
          <Stack.Screen name="App" component={MainNavigator} />
          <Stack.Screen name="Onboarding" component={OnboardingScreen} />
          <Stack.Screen name="ProfileQuiz" component={ProfileQuizScreen} />
          <Stack.Screen name="Paywall" component={PaywallScreen} />
          <Stack.Screen name="PortalSegundaFase" component={PortalSegundaFase} />
          <Stack.Screen name="HubSegundaFase" component={HubSegundaFase} />
          <Stack.Screen name="EscolhaEstrategica" component={EscolhaEstrategica} />
          <Stack.Screen name="AreaHome" component={AreaHome} />
          <Stack.Screen name="Repescagem" component={Repescagem} />
          <Stack.Screen name="ProvasReais" component={ProvasReais} />
          <Stack.Screen name="SimuladoCompleto" component={SimuladoCompleto} />
          <Stack.Screen name="TreinoPecas" component={TreinoPecas} />
          <Stack.Screen name="Dissertativas" component={Dissertativas} />
          <Stack.Screen name="Desempenho2fase" component={Desempenho2fase} />
          <Stack.Screen name="GabaritoExame" component={GabaritoExame} />
        </>
      ) : (
        // Não logado
        <>
          <Stack.Screen name="Register" component={RegisterScreen} />
          <Stack.Screen name="Login" component={LoginScreen} />
        </>
      )}
    </Stack.Navigator>
  );
}
