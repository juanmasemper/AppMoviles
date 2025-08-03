import React from 'react';
import { View, Text, SafeAreaView, TouchableOpacity, StyleSheet, Platform, Switch } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useTheme } from '../context/ThemeContext'; // Importa el hook del tema

interface MenuScreenProps {
  onNavigateToGame: (mode: 'daily' | 'free') => void;
  onNavigateToInstructions: () => void;
  onNavigateToStats: () => void;
}

const MenuScreen: React.FC<MenuScreenProps> = ({
  onNavigateToGame,
  onNavigateToInstructions,
  onNavigateToStats,
}) => {
  const { theme, colors, toggleTheme } = useTheme(); // Usa el hook
  const styles = getStyles(colors); // Obtiene los estilos dinámicos

  return (
    <SafeAreaView style={[styles.container, { paddingTop: Platform.OS === 'ios' ? 60 : 40 }]}>
      <StatusBar style={theme === 'dark' ? 'light' : 'dark'} />
      <Text style={styles.title}>PalabrAr</Text>
      
      <View style={styles.menuButtons}>
        {/* ... (los botones no cambian su lógica, solo sus estilos) ... */}
        <TouchableOpacity style={styles.menuButton} onPress={() => onNavigateToGame('daily')}>
          <Text style={styles.menuButtonText}>Palabra del Día</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.menuButton, styles.freeButton]} onPress={() => onNavigateToGame('free')}>
          <Text style={styles.menuButtonText}>Modo Libre</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.menuButton} onPress={onNavigateToInstructions}>
          <Text style={styles.menuButtonText}>¿Cómo jugar?</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.menuButton} onPress={onNavigateToStats}>
          <Text style={styles.menuButtonText}>Estadísticas</Text>
        </TouchableOpacity>
      </View>
      
      {/* Interruptor para el modo oscuro */}
      <View style={styles.themeSwitcher}>
        <Text style={styles.themeSwitcherText}>Modo Oscuro</Text>
        <Switch
          value={theme === 'dark'}
          onValueChange={toggleTheme}
          thumbColor={colors.primary}
          trackColor={{ false: '#767577', true: '#81b0ff' }}
        />
      </View>
    </SafeAreaView>
  );
};

// Convierte el StyleSheet en una función que recibe los colores del tema
const getStyles = (colors: any) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 48, 
    fontWeight: 'bold',
    color: colors.primary,
    marginBottom: 50,
  },
  menuButtons: {
    width: '80%',
  },
  menuButton: {
    backgroundColor: colors.primary,
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 10,
    marginVertical: 10,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  freeButton: {
    backgroundColor: colors.primary,
  },
  menuButtonText: {
    color: colors.background,
    fontSize: 18,
    fontWeight: 'bold',
  },
  themeSwitcher: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
    bottom: 40,
  },
  themeSwitcherText: {
    color: colors.text,
    fontSize: 16,
    marginRight: 10,
  },
});

export default MenuScreen;