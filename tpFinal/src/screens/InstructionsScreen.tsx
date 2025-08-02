import React from 'react';
import { View, Text, SafeAreaView, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useTheme } from '../context/ThemeContext';

interface InstructionsScreenProps {
  onGoBack: () => void; 
}

const InstructionsScreen: React.FC<InstructionsScreenProps> = ({ onGoBack }) => {
  const { theme, colors } = useTheme();
  const styles = getStyles(colors);

  return (
    <SafeAreaView style={[styles.container, { paddingTop: Platform.OS === 'ios' ? 60 : 40 }]}>
      <StatusBar style={theme === 'dark' ? 'light' : 'dark'} />
      <Text style={styles.title}>¿Cómo Jugar?</Text>
      
      <View style={styles.instructionsContainer}>
        <Text style={styles.instructionText}>
          Adivina la palabra oculta en seis intentos...
        </Text>

        {/* ... (el resto de la vista de ejemplos no cambia) ... */}
      </View>
      
      <TouchableOpacity style={styles.backButton} onPress={onGoBack}>
        <Text style={styles.backButtonText}>Entendido</Text>
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
    marginBottom: 20,
  },
  instructionsContainer: {
    flex: 1,
    justifyContent: 'center',
    width: '100%',
  },
  instructionText: {
    fontSize: 16,
    color: colors.text,
    textAlign: 'center',
    marginBottom: 40,
    lineHeight: 22,
  },
  exampleRow: { /* ... */ },
  exampleCell: { /* ... */ },
  exampleCellText: { /* ... */ },
  exampleDescription: {
    flex: 1,
    fontSize: 14,
    color: colors.text, // Color de texto dinámico
  },
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

export default InstructionsScreen;