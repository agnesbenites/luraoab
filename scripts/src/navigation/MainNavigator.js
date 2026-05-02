import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { StatusBar } from 'react-native';

import HomeScreen from '../screens/HomeScreen';
import QuestaoScreen from '../screens/QuestaoScreen';
import ConfigScreen from '../screens/ConfigScreen';

const Tab = createBottomTabNavigator();

export default function MainNavigator() {
  return (
    <NavigationContainer>
      <StatusBar barStyle="dark-content" />
      <Tab.Navigator
        screenOptions={{
          headerShown: false,
          tabBarActiveTintColor: '#4F46E5',
          tabBarInactiveTintColor: '#94A3B8',
          tabBarStyle: {
            backgroundColor: '#FFFFFF',
            borderTopWidth: 1,
            borderTopColor: '#E2E8F0',
            height: 60,
            paddingBottom: 8,
          },
          tabBarLabelStyle: {
            fontSize: 12,
            fontWeight: '600',
          },
        }}
      >
        <Tab.Screen name="Início" component={HomeScreen} />
        <Tab.Screen name="Simulados" component={QuestaoScreen} />
        <Tab.Screen name="Perfil" component={ConfigScreen} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}