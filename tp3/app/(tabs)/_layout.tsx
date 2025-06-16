import { Tabs } from 'expo-router';
import React from 'react';
import { Ionicons } from '@expo/vector-icons';
import { useThemeContext } from '../../hooks/ThemeContext'; // Asegúrate de que la ruta sea correcta

export default function TabLayout() {
  const { theme } = useThemeContext();
  const isDark = theme === 'dark';

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: isDark ? '#bb86fc' : '#6200ee',
        tabBarStyle: {
          backgroundColor: isDark ? '#121212' : '#fff',
        },
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color, focused }) => (
            <Ionicons name={focused ? 'home' : 'home-outline'} size={24} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="favorites"
        options={{
          title: 'Favoritos',
          tabBarIcon: ({ color, focused }) => (
            <Ionicons  name={focused ? 'heart' : 'heart-outline'}  size={24} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="IngredientsScreen"
        options={{
          title: 'Despensa',

          tabBarIcon: ({ color, focused }) => (
            <Ionicons name={focused ? 'basket' : 'basket-outline'} size={24} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
