import { Tabs } from 'expo-router';
import React from 'react';
import { Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useThemeContext } from '../../hooks/ThemeContext';

export default function TabLayout() {
  const { theme } = useThemeContext();
  const isDark = theme === 'dark';

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: isDark ? '#ff6b6b' : '#007bff',
        tabBarInactiveTintColor: isDark ? '#888' : '#666',
        headerShown: false,
        tabBarStyle: Platform.select({
          ios: {
            backgroundColor: isDark ? 'rgba(30, 30, 30, 0.9)' : 'rgba(255, 255, 255, 0.9)',
            borderTopColor: isDark ? 'rgba(51, 51, 51, 0.6)' : 'rgba(224, 224, 224, 0.6)',
            borderTopWidth: 0.5,
            position: 'absolute',
          },
          android: {
            backgroundColor: isDark ? '#1e1e1e' : '#fff',
            borderTopColor: isDark ? '#333' : '#e0e0e0',
            borderTopWidth: 1,
            elevation: 8,
          },
          default: {
            backgroundColor: isDark ? '#1e1e1e' : '#fff',
            borderTopColor: isDark ? '#333' : '#e0e0e0',
            borderTopWidth: 1,
          },
        }),
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Buscar',
          tabBarIcon: ({ color, focused }) => (
            <Ionicons 
              name={focused ? 'search' : 'search-outline'} 
              size={24} 
              color={color} 
            />
          ),
        }}
      />
      <Tabs.Screen
        name="favorites"
        options={{
          title: 'Favoritos',
          tabBarIcon: ({ color, focused }) => (
            <Ionicons 
              name={focused ? 'heart' : 'heart-outline'} 
              size={24} 
              color={color} 
            />
          ),
        }}
      />
      <Tabs.Screen
        name="explore"
        options={{
          title: 'Explorar',
          tabBarIcon: ({ color, focused }) => (
            <Ionicons 
              name={focused ? 'compass' : 'compass-outline'} 
              size={24} 
              color={color} 
            />
          ),
        }}
      />
    </Tabs>
  );
}