import React from 'react';
import {
  View,
  Text,
  SafeAreaView,
  TouchableOpacity,
  StyleSheet,
  Platform,
} from 'react-native';
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
    <SafeAreaView style={[styles.container, { paddingTop: Platform.OS === 'ios' ? 40 : 20 }]}>
      <StatusBar style={theme === 'dark' ? 'light' : 'dark'} />

      <View style={styles.wrapper}>
        {/* Contenido centrado */}
        <View style={styles.centeredContent}>
          <Text style={styles.title}>Estadísticas</Text>

          <View style={styles.statsRow}>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>{stats.gamesPlayed}</Text>
              <Text style={styles.statLabel}>Jugados</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>{stats.gamesWon}</Text>
              <Text style={styles.statLabel}>Ganados</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>{stats.currentStreak}</Text>
              <Text style={styles.statLabel}>Racha Actual</Text>
            </View>
          </View>

          <Text style={styles.distributionTitle}>Distribución</Text>

          <View style={styles.distributionContainer}>
            {stats.guessDistribution.map((count, index) => (
              <View key={index} style={styles.distributionRow}>
                <Text style={styles.distributionNumber}>{index + 1}</Text>
                <View style={styles.distributionBar}>
                  <View
                    style={[
                      styles.distributionFill,
                      {
                        width: `${(count / maxDistributionCount) * 100}%`,
                        backgroundColor: count > 0 ? '#6AAA64' : colors.cellBorder,
                      },
                    ]}
                  >
                    {count > 0 && <Text style={styles.distributionCount}>{count}</Text>}
                  </View>
                </View>
              </View>
            ))}
          </View>
        </View>

        {/* Botón abajo */}
        <View style={styles.footer}>
          <TouchableOpacity style={styles.backButton} onPress={onGoBack}>
            <Text style={styles.backButtonText}>Volver</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

const getStyles = (colors: any) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    wrapper: {
      flex: 1,
      justifyContent: 'space-between',
      paddingHorizontal: 20,
      paddingBottom: 100,
    },
    centeredContent: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
    title: {
      fontSize: 32,
      fontWeight: 'bold',
      color: colors.primary,
      marginBottom: 45,
    },
    statsRow: {
      flexDirection: 'row',
      justifyContent: 'space-around',
      width: '100%',
      marginBottom: 90,
    },
    statItem: {
      alignItems: 'center',
    },
    statNumber: {
      fontSize: 36,
      fontWeight: 'bold',
      color: colors.text,
    },
    statLabel: {
      fontSize: 14,
      color: colors.text,
      opacity: 0.8,
    },
    distributionTitle: {
      fontSize: 20,
      fontWeight: 'bold',
      marginBottom: 10,
      color: colors.text,
    },
    distributionContainer: {
      width: '100%',
    },
    distributionRow: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 8,
    },
    distributionNumber: {
      fontSize: 14,
      fontWeight: 'bold',
      width: 20,
      textAlign: 'center',
      color: colors.text,
    },
    distributionBar: {
      flex: 1,
      height: 20,
      backgroundColor: colors.cellBorder,
      marginLeft: 10,
      borderRadius: 4,
      justifyContent: 'center',
    },
    distributionFill: {
      height: '100%',
      borderRadius: 4,
      alignItems: 'flex-end',
      justifyContent: 'center',
      paddingHorizontal: 10,
      minWidth: 20,
    },
    distributionCount: {
      color: 'white',
      fontWeight: 'bold',
      fontSize: 12,
    },
    footer: {
      alignItems: 'center',
      paddingTop: 10,
    },
    backButton: {
      backgroundColor: colors.primary,
      paddingVertical: 14,
      paddingHorizontal: 50,
      borderRadius: 10,
    },
    backButtonText: {
      color: '#FFFFFF',
      fontSize: 18,
      fontWeight: 'bold',
    },
  });

export default StatsScreen;
