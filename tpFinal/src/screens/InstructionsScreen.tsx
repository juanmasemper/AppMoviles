import React from 'react';
import { View, Text, SafeAreaView, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import { StatusBar } from 'expo-status-bar';

interface InstructionsScreenProps {
  onGoBack: () => void; 
}

const InstructionsScreen: React.FC<InstructionsScreenProps> = ({ onGoBack }) => {
  return (
    <SafeAreaView style={[styles.container, { paddingTop: Platform.OS === 'ios' ? 60 : 40 }]}>
      <StatusBar style="dark" />
      <Text style={styles.title}>¿Cómo Jugar?</Text>
      
      <View style={styles.instructionsContainer}>
        <Text style={styles.instructionText}>
          Adivina la palabra oculta en seis intentos.
          Cada intento debe ser una palabra válida de 5 letras.
          Después de cada intento, el color de las letras cambiará para mostrarte qué tan cerca estás de acertar la palabra.
        </Text>

        {/* Ejemplo 1: Letra correcta */}
        <View style={styles.exampleRow}>
          <View style={[styles.exampleCell, { backgroundColor: '#6AAA64' }]}>
            <Text style={styles.exampleCellText}>C</Text>
          </View>
          <Text style={styles.exampleDescription}>La letra C está en la palabra y en la posición correcta.</Text>
        </View>

        {/* Ejemplo 2: Letra en lugar incorrecto */}
        <View style={styles.exampleRow}>
          <View style={[styles.exampleCell, { backgroundColor: '#C9B458' }]}>
            <Text style={styles.exampleCellText}>A</Text>
          </View>
          <Text style={styles.exampleDescription}>La letra A está en la palabra pero en la posición incorrecta.</Text>
        </View>

        {/* Ejemplo 3: Letra incorrecta */}
        <View style={styles.exampleRow}>
          <View style={[styles.exampleCell, { backgroundColor: '#787C7E' }]}>
            <Text style={styles.exampleCellText}>F</Text>
          </View>
          <Text style={styles.exampleDescription}>La letra F no está en la palabra.</Text>
        </View>
      </View>
      
      <TouchableOpacity 
        style={styles.backButton}
        onPress={onGoBack} 
      >
        <Text style={styles.backButtonText}>Entendido</Text>
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
    marginBottom: 20,
  },
  instructionsContainer: {
    flex: 1,
    justifyContent: 'center',
    width: '100%',
  },
  instructionText: {
    fontSize: 16,
    color: '#333333',
    textAlign: 'center',
    marginBottom: 40,
    lineHeight: 22,
  },
  exampleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    width: '100%',
  },
  exampleCell: {
    width: 50,
    height: 50,
    borderWidth: 2,
    borderColor: '#D3D6DA',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 15,
  },
  exampleCellText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
  },
  exampleDescription: {
    flex: 1,
    fontSize: 14,
    color: '#333333',
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

export default InstructionsScreen;