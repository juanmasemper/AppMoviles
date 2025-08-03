import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

interface KeyboardProps {
  onKeyPress: (key: string) => void;
  coloresTeclado: { [key: string]: string };
}

const Keyboard: React.FC<KeyboardProps> = ({ onKeyPress, coloresTeclado }) => {
  const rows = [
    ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'],
    ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L', 'Ñ'],
    ['Enviar', 'Z', 'X', 'C', 'V', 'B', 'N', 'M', '⌫'],
  ];

  return (
    <View style={styles.keyboard}>
      {rows.map((row, rowIndex) => (
        <View key={rowIndex} style={styles.keyboardRow}>
          {row.map((key) => {
            const isSpecialKey = key === 'Enviar' || key === '⌫';
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
                onPress={() =>
                  onKeyPress(key === '⌫' ? 'BORRAR' : key === 'Enviar' ? 'ENVIAR' : key)
                }
              >
                <Text
                  numberOfLines={1}
                  adjustsFontSizeToFit
                  style={[
                    styles.keyText,
                    { color: textColor },
                    isSpecialKey ? styles.specialKeyText : null,
                  ]}
                >
                  {key}
                </Text>
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
    margin: 1.5,
    borderRadius: 8,
    height: 58,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 6,
    flexGrow: 1,
    flexBasis: 0,
    minWidth: 32,
  },
  specialKey: {
    minWidth: 50,
    paddingHorizontal: 8,
  },
  keyText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333333',
  },
  specialKeyText: {
    fontSize: 12,
    lineHeight: 20,
    textAlign: 'center',
    textAlignVertical: 'center',
  },
});

export default Keyboard;
