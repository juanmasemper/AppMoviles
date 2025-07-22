import React from 'react';
import { View, Text, SafeAreaView, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import Keyboard from '../components/Keyboard';
import { GameStats } from '../types';

// La interfaz de props ahora es mucho más grande
interface GameScreenProps {
  onGoBack: () => void;
  gameBoard: string[][];
  coloresGrilla: string[][];
  coloresTeclado: { [key: string]: string };
  currentRow: number;
  currentCol: number;
  handleKeyPress: (key: string) => void;
  gameStatus: 'playing' | 'won' | 'lost';
  stats: GameStats; // Aunque no la usemos aquí, la recibimos
}

const GameBoard: React.FC<{ board: string[][]; colors: string[][]; currentRow: number; currentCol: number;}> = 
  ({ board, colors, currentRow, currentCol }) => (
  <View style={styles.gameBoard}>
    {board.map((row, rowIndex) => (
      <View key={rowIndex} style={styles.row}>
        {row.map((letter, colIndex) => (
          <View
            key={colIndex}
            style={[
              styles.cell,
              { backgroundColor: colors[rowIndex][colIndex] },
              rowIndex === currentRow && colIndex === currentCol && letter === '' && colors[rowIndex][colIndex] === '#FFFFFF' ? styles.activeCell : null,
            ]}
          >
            <Text style={[ styles.cellText, rowIndex < currentRow || colors[rowIndex][colIndex] !== '#FFFFFF' ? styles.completedCellText : null, ]}>
              {letter}
            </Text>
          </View>
        ))}
      </View>
    ))}
  </View>
);

const GameScreen: React.FC<GameScreenProps> = (props) => {
  // Ya no usamos el hook aquí. Todo viene de las props.
  const { onGoBack, gameBoard, coloresGrilla, coloresTeclado, currentRow, currentCol, handleKeyPress } = props;

  return (
    <SafeAreaView style={[styles.container, { paddingTop: Platform.OS === 'ios' ? 40 : 40 }]}>
      <StatusBar style="dark" />
      <View style={styles.headerRow}>
        <TouchableOpacity style={styles.backButtonSmall} onPress={onGoBack}>
          <Text style={styles.backButtonTextSmall}>Volver</Text>
        </TouchableOpacity>
        <Text style={styles.titleCentered}>PalabrAr</Text>
        <View style={{ width: 80 }} />
      </View>

      <View style={styles.content}>
        <GameBoard
          board={gameBoard}
          colors={coloresGrilla}
          currentRow={currentRow}
          currentCol={currentCol}
        />
      </View>

      <Keyboard onKeyPress={handleKeyPress} coloresTeclado={coloresTeclado} />
    </SafeAreaView>
  );
};

// Los estilos son los mismos, no es necesario cambiarlos.
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFFFFF', alignItems: 'center', },
  headerRow: { flexDirection: 'row', alignItems: 'center', width: '100%', justifyContent: 'space-between', paddingHorizontal: 10, borderBottomWidth: 1, borderBottomColor: '#D3D6DA', paddingBottom: 10, },
  titleCentered: { fontSize: 32, fontWeight: 'bold', color: '#4A90E2', textAlign: 'center', },
  backButtonSmall: { backgroundColor: '#4A90E2', paddingVertical: 8, paddingHorizontal: 15, borderRadius: 10, },
  backButtonTextSmall: { color: '#FFFFFF', fontSize: 16, fontWeight: 'bold', },
  content: { flex: 1, justifyContent: 'center', alignItems: 'center', width: '100%', },
  gameBoard: {},
  row: { flexDirection: 'row', marginBottom: 5, },
  cell: { width: 60, height: 60, borderWidth: 2, borderColor: '#D3D6DA', marginHorizontal: 2, alignItems: 'center', justifyContent: 'center', backgroundColor: '#FFFFFF', },
  activeCell: { borderColor: '#4A90E2', transform: [{ scale: 1.05 }], },
  cellText: { fontSize: 28, fontWeight: 'bold', color: '#333333', },
  completedCellText: { color: '#FFFFFF', },
});

export default GameScreen;