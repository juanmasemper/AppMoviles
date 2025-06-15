// tp3/app/_layout.tsx
import React from 'react';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';

import { ThemeProvider } from '../hooks/ThemeContext';
import { HeaderShownContext } from '@react-navigation/elements';
import { FavoritesProvider } from './context/FavoritesContext';

export default function RootLayout() {
  const [loaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });

  if (!loaded) {
    return null;
  }

  return (
    <FavoritesProvider>
      <ThemeProvider>
        <Stack
          screenOptions={{
            headerBackTitle: '',
          }}
        >
            <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
            <Stack.Screen name="+not-found" />
        </Stack>
  
      <StatusBar style="auto" />
      </ThemeProvider>
    </FavoritesProvider>
  );
}
