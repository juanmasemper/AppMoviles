import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

// Definimos qué "props" (propiedades) necesitará este componente
interface KeyboardProps {
  onKeyPress: (key: string) => void; // Una función para manejar la pulsación
  coloresTeclado: { [key: string]: string }; // Un objeto con los colores de cada tecla
}

const Keyboard: React.FC<KeyboardProps> = ({ onKeyPress, coloresTeclado }) => {
  // Las filas del teclado, igual que las tenías antes
  const rows = [
    ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'],
    ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L', 'Ñ'],
    ['ENVIAR', 'Z', 'X', 'C', 'V', 'B', 'N', 'M', '⌫'],
  ];

  return (
    <View style={styles.keyboard}>
      {rows.map((row, rowIndex) => (
        <View key={rowIndex} style={styles.keyboardRow}>
          {row.map((key) => {
            // Lógica para determinar el color de la tecla y del texto
            const isSpecialKey = key === 'ENVIAR' || key === '⌫';
            const keyColor = !isSpecialKey ? coloresTeclado[key] : '#D3D6DA';
            const textColor = !isSpecialKey && keyColor !== '#D3D6DA' ? '#FFFFFF' : '#000000';

            return (
              <TouchableOpacity
                key={key}
                style={[
                  styles.key,
                  { backgroundColor: keyColor },
                  isSpecialKey ? styles.specialKey : null,
                ]}
                // Al presionar, llamamos a la función onKeyPress que recibimos por props
                onPress={() => onKeyPress(key === '⌫' ? 'BORRAR' : key)}
              >
                <Text style={[styles.keyText, { color: textColor }]}>{key}</Text>
              </TouchableOpacity>
            );
          })}
        </View>
      ))}
    </View>
  );
};


const styles = StyleSheet.create({
  keyboard: {
    width: '100%',
    paddingVertical: 15,
    paddingHorizontal: 5,
    marginBottom: 10,
  },
  keyboardRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 10,
  },
  key: {
    backgroundColor: '#D3D6DA',
    padding: 10,
    margin: 3,
    borderRadius: 8,
    height: 58,
    alignItems: 'center',
    justifyContent: 'center',
    width: '8.5%', 
  },
  specialKey: {
    width: '15%', 
  }, 
  keyText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333333',
  },
});

export default Keyboard;