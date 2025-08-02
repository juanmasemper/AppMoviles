import React from 'react';
import { View, Text, SafeAreaView, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { GameStats } from '../types'; 
import { useTheme } from '../context/ThemeContext';

interface StatsScreenProps {
  onGoBack: () => void;
  stats: GameStats; 
}

const StatsScreen: React.FC<StatsScreenProps> = ({ onGoBack, stats }) => {
  const { theme, colors } = useTheme();
  const styles = getStyles(colors);
  const maxDistributionCount = Math.max(...stats.guessDistribution, 1);

  return (
    <SafeAreaView style={[styles.container, { paddingTop: Platform.OS === 'ios' ? 60 : 40 }]}>
      <StatusBar style={theme === 'dark' ? 'light' : 'dark'} />
      <Text style={styles.title}>Estadísticas</Text>

      {/* ... (El resto de la vista no cambia, solo los estilos de abajo) ... */}

      <TouchableOpacity style={styles.backButton} onPress={onGoBack}>
        <Text style={styles.backButtonText}>Volver</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

const getStyles = (colors: any) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: colors.primary,
    marginBottom: 30,
  },
  statsContainer: { /* ... */ },
  statsRow: { /* ... */ },
  statItem: { /* ... */ },
  statNumber: {
    fontSize: 36,
    fontWeight: 'bold',
    color: colors.text,
  },
  statLabel: {
    fontSize: 14,
    color: colors.text,
    opacity: 0.7,
  },
  distributionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
    color: colors.text,
  },
  /* ... (el resto de los estilos de distribución) ... */
  backButton: {
    backgroundColor: colors.primary,
    paddingVertical: 15,
    paddingHorizontal: 50,
    borderRadius: 10,
    marginBottom: 30,
  },
  backButtonText: {
    color: colors.background,
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default StatsScreen;