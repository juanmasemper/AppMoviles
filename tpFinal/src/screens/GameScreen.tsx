import React from 'react';
import { View, Text, SafeAreaView, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import Keyboard from '../components/Keyboard';
import { useGame } from '../hooks/useGame';
import { useFreeGame } from '../hooks/useFreeGame';
import { useTheme } from '../context/ThemeContext'; // Importar hook

interface GameScreenProps {
  onGoBack: () => void;
  gameMode?: 'daily' | 'free';
}

const GameBoard: React.FC<{ board: string[][]; colors: string[][]; currentRow: number; currentCol: number; themeColors: any; }> = 
  ({ board, colors, currentRow, currentCol, themeColors }) => {
  const styles = getStyles(themeColors);
  return (
    <View style={styles.gameBoard}>
      {board.map((row, rowIndex) => (
        <View key={rowIndex} style={styles.row}>
          {row.map((letter, colIndex) => (
            <View
              key={colIndex}
              style={[
                styles.cell,
                { backgroundColor: colors[rowIndex][colIndex] === '#FFFFFF' ? themeColors.cellDefault : colors[rowIndex][colIndex] },
                rowIndex === currentRow && colIndex === currentCol && letter === '' && colors[rowIndex][colIndex] === '#FFFFFF' ? styles.activeCell : null,
              ]}
            >
              <Text style={[ styles.cellText, (rowIndex < currentRow || colors[rowIndex][colIndex] !== '#FFFFFF') ? styles.completedCellText : null, ]}>
                {letter}
              </Text>
            </View>
          ))}
        </View>
      ))}
    </View>
  );
};

const GameScreen = ({ gameMode, onGoBack }: GameScreenProps) => {
  const { theme, colors } = useTheme(); // Usar hook
  const styles = getStyles(colors); // Obtener estilos dinámicos

  const dailyGame = useGame();
  const freeGame = useFreeGame();
  const activeGame = gameMode === 'daily' ? dailyGame : freeGame;
  
  const { gameBoard, coloresGrilla, coloresTeclado, gameStatus, currentRow, currentCol, handleKeyPress, resetGame } = activeGame;

  return (
    <SafeAreaView style={[styles.container, { paddingTop: Platform.OS === 'ios' ? 40 : 40 }]}>
      <StatusBar style={theme === 'dark' ? 'light' : 'dark'} />
      <View style={styles.headerRow}>
        <TouchableOpacity style={styles.backButtonSmall} onPress={onGoBack}>
          <Text style={styles.backButtonTextSmall}>Volver</Text>
        </TouchableOpacity>
        <View style={styles.titleContainer}>
          <Text style={styles.titleCentered}>PalabrAr</Text>
          {gameMode && (
            <Text style={styles.modeText}>
              {gameMode === 'daily' ? 'Palabra del Día' : 'Modo Libre'}
            </Text>
          )}
        </View>
        <View style={{ width: 80 }} />
      </View>

      <View style={styles.content}>
        <GameBoard
          board={gameBoard}
          colors={coloresGrilla}
          currentRow={currentRow}
          currentCol={currentCol}
          themeColors={colors}
        />
        
        {gameMode === 'free' && gameStatus !== 'playing' && (
          <TouchableOpacity style={styles.newGameButton} onPress={resetGame}>
            <Text style={styles.newGameButtonText}>Nuevo Juego</Text>
          </TouchableOpacity>
        )}
      </View>

      <Keyboard onKeyPress={handleKeyPress} coloresTeclado={coloresTeclado} themeColors={colors} />
    </SafeAreaView>
  );
};

const getStyles = (colors: any) => StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background, alignItems: 'center' },
  headerRow: { flexDirection: 'row', alignItems: 'center', width: '100%', justifyContent: 'space-between', paddingHorizontal: 10, borderBottomWidth: 1, borderBottomColor: colors.cellBorder, paddingBottom: 10 },
  titleContainer: { alignItems: 'center' },
  titleCentered: { fontSize: 32, fontWeight: 'bold', color: colors.primary, textAlign: 'center' },
  modeText: { fontSize: 12, color: colors.text, marginTop: 2, opacity: 0.7 },
  backButtonSmall: { backgroundColor: colors.primary, paddingVertical: 8, paddingHorizontal: 15, borderRadius: 10 },
  backButtonTextSmall: { color: colors.background, fontSize: 16, fontWeight: 'bold' },
  content: { flex: 1, justifyContent: 'center', alignItems: 'center', width: '100%' },
  gameBoard: {},
  row: { flexDirection: 'row', marginBottom: 5 },
  cell: { width: 60, height: 60, borderWidth: 2, borderColor: colors.cellBorder, marginHorizontal: 2, alignItems: 'center', justifyContent: 'center' },
  activeCell: { borderColor: colors.primary, transform: [{ scale: 1.05 }] },
  cellText: { fontSize: 28, fontWeight: 'bold', color: colors.cellText },
  completedCellText: { color: '#FFFFFF' }, // Este color suele ser blanco en ambos temas
  newGameButton: { backgroundColor: '#28A745', paddingVertical: 12, paddingHorizontal: 25, borderRadius: 10, marginTop: 20 },
  newGameButtonText: { color: '#FFFFFF', fontSize: 16, fontWeight: 'bold' },
});

export default GameScreen;