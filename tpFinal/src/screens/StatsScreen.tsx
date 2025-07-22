import React from 'react';
import { View, Text, SafeAreaView, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { GameStats } from '../types'; 

interface StatsScreenProps {
  onGoBack: () => void;
  stats: GameStats; 
}

const StatsScreen: React.FC<StatsScreenProps> = ({ onGoBack, stats }) => {
  const maxDistributionCount = Math.max(...stats.guessDistribution, 1);

  return (
    <SafeAreaView style={[styles.container, { paddingTop: Platform.OS === 'ios' ? 60 : 40 }]}>
      <StatusBar style="dark" />
      <Text style={styles.title}>Estadísticas</Text>

      <View style={styles.statsContainer}>
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

        {/* Distribución de Adivinanzas */}
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
                      backgroundColor: count > 0 ? '#6AAA64' : '#E5E5E5',
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

      <TouchableOpacity style={styles.backButton} onPress={onGoBack}>
        <Text style={styles.backButtonText}>Volver</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#4A90E2',
    marginBottom: 30,
  },
  statsContainer: {
    flex: 1,
    width: '100%',
    alignItems: 'center',
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginBottom: 40,
  },
  statItem: {
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#333333',
  },
  statLabel: {
    fontSize: 14,
    color: '#666666',
  },
  distributionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
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
  },
  distributionBar: {
    flex: 1,
    height: 20,
    backgroundColor: '#E5E5E5',
    marginLeft: 10,
    borderRadius: 4,
    justifyContent: 'center',
  },
  distributionFill: {
    height: '100%',
    borderRadius: 4,
    alignItems: 'flex-end',
    justifyContent: 'center',
    paddingHorizontal: 5,
    minWidth: 20, 
  },
  distributionCount: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 12,
  },

  backButton: {
    backgroundColor: '#4A90E2',
    paddingVertical: 15,
    paddingHorizontal: 50,
    borderRadius: 10,
    marginBottom: 30,
  },
  backButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default StatsScreen;