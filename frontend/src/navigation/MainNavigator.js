import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Text } from 'react-native';

import HomeScreen from '../screens/HomeScreen';
import QuestaoScreen from '../screens/QuestaoScreen';
import InsightsScreen from '../screens/InsightsScreen';
import ConfigScreen from '../screens/ConfigScreen';
import VadeMecumScreen from '../screens/VadeMecumScreen';

const Tab = createBottomTabNavigator();

export default function MainNavigator() {
  return (
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
      <Tab.Screen
        name="Início"
        component={HomeScreen}
        options={{ tabBarIcon: () => <Text style={{ fontSize: 18 }}>🏠</Text> }}
      />
      <Tab.Screen
        name="Simulados"
        component={QuestaoScreen}
        options={{ tabBarIcon: () => <Text style={{ fontSize: 18 }}>📝</Text> }}
      />
      <Tab.Screen
        name="Insights"
        component={InsightsScreen}
        options={{ tabBarIcon: () => <Text style={{ fontSize: 18 }}>📚</Text> }}
      />
      <Tab.Screen
        name="Vade"
        component={VadeMecumScreen}
        options={{ tabBarIcon: () => <Text style={{ fontSize: 18 }}>📖</Text> }}
      />
      <Tab.Screen
        name="Desempenho"
        component={ConfigScreen}
        options={{ tabBarIcon: () => <Text style={{ fontSize: 18 }}>📊</Text> }}
      />
    </Tab.Navigator>
  );
}