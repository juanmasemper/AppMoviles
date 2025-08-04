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
import { useTheme } from '../context/ThemeContext';

interface InstructionsScreenProps {
  onGoBack: () => void;
}

const InstructionsScreen: React.FC<InstructionsScreenProps> = ({ onGoBack }) => {
  const { theme, colors } = useTheme();
  const styles = getStyles(colors);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style={theme === 'dark' ? 'light' : 'dark'} />

      <View style={styles.wrapper}>
        {/* Título */}
        <View style={styles.header}>
          <Text style={styles.title}>¿Cómo Jugar?</Text>
        </View>

        {/* Instrucciones y ejemplos */}
        <View style={styles.content}>
          <Text style={styles.instructionText}>
            Adivina la palabra oculta en seis intentos.{"\n"}
            Cada intento debe ser una palabra válida de 5 letras.{"\n"}
            Después de cada intento, el color de las letras cambiará para mostrarte qué tan cerca estás de acertar la palabra.
          </Text>

          <View style={styles.exampleRow}>
            <View style={[styles.exampleCell, { backgroundColor: '#6AAA64' }]}>
              <Text style={styles.exampleCellText}>C</Text>
            </View>
            <Text style={styles.exampleDescription}>
              La letra C está en la palabra y en la posición correcta.
            </Text>
          </View>

          <View style={styles.exampleRow}>
            <View style={[styles.exampleCell, { backgroundColor: '#C9B458' }]}>
              <Text style={styles.exampleCellText}>A</Text>
            </View>
            <Text style={styles.exampleDescription}>
              La letra A está en la palabra pero en la posición incorrecta.
            </Text>
          </View>

          <View style={styles.exampleRow}>
            <View style={[styles.exampleCell, { backgroundColor: '#787C7E' }]}>
              <Text style={styles.exampleCellText}>F</Text>
            </View>
            <Text style={styles.exampleDescription}>
              La letra F no está en la palabra.
            </Text>
          </View>
        </View>

        {/* Botón */}
        <View style={styles.footer}>
          <TouchableOpacity style={styles.backButton} onPress={onGoBack}>
            <Text style={styles.backButtonText}>Entendido</Text>
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
      paddingTop: Platform.OS === 'ios' ? 40 : 20,
    },
    wrapper: {
      flex: 1,
      justifyContent: 'space-between',
      paddingHorizontal: 20,
      paddingTop: 20,
      paddingBottom: 60,
    },
    header: {
      alignItems: 'center',
      marginTop: 60,
      marginBottom: 10,
    },
    title: {
      fontSize: 28,
      fontWeight: 'bold',
      color: colors.primary,
      textAlign: 'center',
    },
    content: {
      flexGrow: 1,
      justifyContent: 'center',
    },
    instructionText: {
      fontSize: 16,
      color: colors.text,
      textAlign: 'center',
      marginBottom: 30,
      lineHeight: 22,
    },
    exampleRow: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 18,
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
      borderRadius: 6,
    },
    exampleCellText: {
      fontSize: 24,
      fontWeight: 'bold',
      color: '#FFFFFF',
    },
    exampleDescription: {
      flex: 1,
      fontSize: 14,
      color: colors.text,
    },
    footer: {
      alignItems: 'center',
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

export default InstructionsScreen;
