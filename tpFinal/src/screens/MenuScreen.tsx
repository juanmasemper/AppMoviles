import React from 'react';
import { View, Text, SafeAreaView, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import { StatusBar } from 'expo-status-bar';

interface MenuScreenProps {
  onNavigateToGame: () => void;
  onNavigateToInstructions: () => void;
  onNavigateToStats: () => void;
}

const MenuScreen: React.FC<MenuScreenProps> = ({
  onNavigateToGame,
  onNavigateToInstructions,
  onNavigateToStats,
}) => {
  return (
    <SafeAreaView style={[styles.container, { paddingTop: Platform.OS === 'ios' ? 60 : 40 }]}>
      <StatusBar style="dark" />
      <Text style={styles.title}>PalabrAr</Text>
      
      <View style={styles.menuButtons}>
        <TouchableOpacity 
          style={styles.menuButton}
          onPress={onNavigateToGame}
        >
          <Text style={styles.menuButtonText}>Jugar</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.menuButton}
          onPress={onNavigateToInstructions}
        >
          <Text style={styles.menuButtonText}>¿Cómo jugar?</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.menuButton}
          onPress={onNavigateToStats}
        >
          <Text style={styles.menuButtonText}>Estadísticas</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 48, 
    fontWeight: 'bold',
    color: '#4A90E2',
    marginBottom: 50,
  },
  menuButtons: {
    width: '80%',
  },
  menuButton: {
    backgroundColor: '#4A90E2',
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 10,
    marginVertical: 10,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  menuButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default MenuScreen;