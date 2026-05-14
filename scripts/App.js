import React from 'react';
import { View, ActivityIndicator, StatusBar } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { AuthProvider, useAuth } from './src/context/AuthContext';
import AuthScreen from './src/screens/AuthScreen';
import MainNavigator from './src/navigation/MainNavigator';
import MotivacionalModal from './src/components/MotivacionalModal';

function RootLayout() {
  const { user, loading } = useAuth();

  if (loading) return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#F8FAFC' }}>
      <ActivityIndicator size="large" color="#4F46E5" />
    </View>
  );

  return (
    <>
      {user && <MotivacionalModal />}  {/* só aparece se estiver logado */}
      {user ? <MainNavigator /> : <AuthScreen />}
    </>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <NavigationContainer>
        <StatusBar barStyle="dark-content" backgroundColor="#F8FAFC" />
        <RootLayout />
      </NavigationContainer>
    </AuthProvider>
  );
}