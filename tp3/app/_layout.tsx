import React from 'react';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';

import { ThemeProvider } from '../hooks/ThemeContext';
import { FavoritesProvider } from './context/FavoritesContext';
import { IngredientsProvider } from './context/IngredientsContext';
import { AuthProvider } from './context/AuthContext'; // NUEVO

export default function RootLayout() {
  const [loaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });

  if (!loaded) {
    return null;
  }

  return (
    <AuthProvider>
      <IngredientsProvider>
        <FavoritesProvider>
          <ThemeProvider>
            <Stack screenOptions={{ headerBackTitle: '' }}>
                <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
                <Stack.Screen name="login" options={{ presentation: 'modal', title: "Acceso" }} />
                <Stack.Screen name="+not-found" />
            </Stack>
            <StatusBar style="auto" />
          </ThemeProvider>
        </FavoritesProvider>
      </IngredientsProvider>
    </AuthProvider>
  );
}
