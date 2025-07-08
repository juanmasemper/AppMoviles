import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  Alert,
  Dimensions,
  BackHandler,
  Platform,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { StatusBar } from 'expo-status-bar';

const { width } = Dimensions.get('window');

// Diccionario expandido de palabras en español de 5 letras
const PALABRAS_VALIDAS = [
  'GATOS', 'TANGO', 'CABLE', 'FRUTO', 'MUNDO', 'PLAYA', 'VERDE', 'NEGRO',
  'BLANCO', 'ROJO', 'AZUL', 'ROSA', 'CASA', 'MESA', 'SILLA', 'PUERTA',
  'AGUA', 'FUEGO', 'TIERRA', 'AIRE', 'CIELO', 'NUBE', 'LUNA', 'FLOR',
  'ARBOL', 'HOJA', 'RAIZ', 'TALLO', 'FRUTA', 'CAMPO', 'MONTE', 'LAGO',
  'PLAYA', 'ARENA', 'ROCA', 'PIEDRA', 'MADERA', 'TELA', 'LANA', 'SEDA',
  'PAPEL', 'LIBRO', 'LAPIZ', 'MESA', 'SILLA', 'CAMA', 'SOFA', 'COCINA',
  'BAÑO', 'SALON', 'CUARTO', 'PATIO', 'JARDIN', 'CALLE', 'PLAZA', 'PARQUE',
  'BANCO', 'TIENDA', 'ESCUELA', 'IGLESIA', 'MUSEO', 'CINE', 'TEATRO',
  'HOTEL', 'PLATO', 'VASO', 'CUCHARA', 'TENEDOR', 'CUCHILLO', 'BOTELLA',
  'JARRA', 'OLLA', 'SARTEN', 'HORNO', 'NEVERA', 'LAVADORA', 'SECADORA'
];

// Función para obtener palabra aleatoria del día
const obtenerPalabraDelDia = (): string => {
  const hoy = new Date();
  const seed = hoy.getFullYear() * 10000 + (hoy.getMonth() + 1) * 100 + hoy.getDate();
  const indice = seed % PALABRAS_VALIDAS.length;
  return PALABRAS_VALIDAS[indice];
};

const PALABRA_DEL_DIA = obtenerPalabraDelDia();

interface GameStats {
  gamesPlayed: number;
  gamesWon: number;
  currentStreak: number;
  maxStreak: number;
  guessDistribution: number[];
}

type Screen = 'menu' | 'game' | 'instructions' | 'stats';

const App: React.FC = () => {
  const [currentScreen, setCurrentScreen] = useState<Screen>('menu');
  const [gameBoard, setGameBoard] = useState<string[][]>(
    Array(6).fill(null).map(() => Array(5).fill(''))
  );
  const [currentRow, setCurrentRow] = useState(0);
  const [currentCol, setCurrentCol] = useState(0);
  const [gameStatus, setGameStatus] = useState<'playing' | 'won' | 'lost'>('playing');
  const [stats, setStats] = useState<GameStats>({
    gamesPlayed: 0,
    gamesWon: 0,
    currentStreak: 0,
    maxStreak: 0,
    guessDistribution: [0, 0, 0, 0, 0, 0]
  });

  useEffect(() => {
    loadStats();
  }, []);

  useEffect(() => {
    const backAction = () => {
      if (currentScreen === 'game' || currentScreen === 'instructions' || currentScreen === 'stats') {
        setCurrentScreen('menu');
        return true;
      }
      return false;
    };
    const backHandler = BackHandler.addEventListener('hardwareBackPress', backAction);
    return () => backHandler.remove();
  }, [currentScreen]);

  const loadStats = async () => {
    try {
      const savedStats = await AsyncStorage.getItem('palabrar_stats');
      if (savedStats) {
        setStats(JSON.parse(savedStats));
      }
    } catch (error) {
      console.error('Error loading stats:', error);
    }
  };

  const saveStats = async (newStats: GameStats) => {
    try {
      await AsyncStorage.setItem('palabrar_stats', JSON.stringify(newStats));
      setStats(newStats);
    } catch (error) {
      console.error('Error saving stats:', error);
    }
  };

  const resetGame = () => {
    setGameBoard(Array(6).fill(null).map(() => Array(5).fill('')));
    setCurrentRow(0);
    setCurrentCol(0);
    setGameStatus('playing');
  };

  const getLetterColor = (letter: string, position: number, word: string): string => {
    if (PALABRA_DEL_DIA[position] === letter) {
      return '#6AAA64'; // Verde - posición correcta
    } else if (PALABRA_DEL_DIA.includes(letter)) {
      return '#C9B458'; // Amarillo - letra en palabra pero posición incorrecta
    } else {
      return '#787C7E'; // Gris - letra no está en la palabra
    }
  };

  const submitGuess = () => {
    const currentGuess = gameBoard[currentRow].join('');
    
    if (currentGuess.length !== 5) {
      Alert.alert('Error', 'Debes completar la palabra de 5 letras');
      return;
    }

    if (!PALABRAS_VALIDAS.includes(currentGuess)) {
      Alert.alert('Error', 'Palabra no válida');
      return;
    }

    if (currentGuess === PALABRA_DEL_DIA) {
      setGameStatus('won');
      updateStatsOnWin(currentRow + 1);
      Alert.alert('¡Felicitaciones!', `¡Adivinaste la palabra: ${PALABRA_DEL_DIA}!`);
    } else if (currentRow === 5) {
      setGameStatus('lost');
      updateStatsOnLoss();
      Alert.alert('Juego terminado', `La palabra era: ${PALABRA_DEL_DIA}`);
    } else {
      setCurrentRow(currentRow + 1);
      setCurrentCol(0);
    }
  };

  const updateStatsOnWin = (attempts: number) => {
    const newStats = {
      ...stats,
      gamesPlayed: stats.gamesPlayed + 1,
      gamesWon: stats.gamesWon + 1,
      currentStreak: stats.currentStreak + 1,
      maxStreak: Math.max(stats.maxStreak, stats.currentStreak + 1),
      guessDistribution: stats.guessDistribution.map((count, index) => 
        index === attempts - 1 ? count + 1 : count
      )
    };
    saveStats(newStats);
  };

  const updateStatsOnLoss = () => {
    const newStats = {
      ...stats,
      gamesPlayed: stats.gamesPlayed + 1,
      currentStreak: 0,
      guessDistribution: stats.guessDistribution
    };
    saveStats(newStats);
  };

  const handleKeyPress = (key: string) => {
    if (gameStatus !== 'playing') return;

    if (key === 'BORRAR') {
      if (currentCol > 0) {
        const newBoard = [...gameBoard];
        newBoard[currentRow][currentCol - 1] = '';
        setGameBoard(newBoard);
        setCurrentCol(currentCol - 1);
      }
    } else if (key === 'ENVIAR') {
      if (currentCol === 5) {
        submitGuess();
      }
    } else if (currentCol < 5) {
      const newBoard = [...gameBoard];
      newBoard[currentRow][currentCol] = key;
      setGameBoard(newBoard);
      setCurrentCol(currentCol + 1);
    }
  };

  const renderKeyboard = () => {
    const rows = [
      ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'],
      ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L', 'Ñ'],
      ['Z', 'X', 'C', 'V', 'B', 'N', 'M', 'BORRAR']
    ];

    return (
      <View style={styles.keyboard}>
        {rows.map((row, rowIndex) => (
          <View key={rowIndex} style={styles.keyboardRow}>
            {row.map((key) => (
              <TouchableOpacity
                key={key}
                style={[
                  styles.key,
                  key === 'ENVIAR' || key === 'BORRAR' ? styles.wideKey : null
                ]}
                onPress={() => handleKeyPress(key)}
              >
                <Text style={[
                  styles.keyText,
                  key === 'ENVIAR' || key === 'BORRAR' ? styles.wideKeyText : null
                ]}>
                  {key}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        ))}
      </View>
    );
  };

  const renderGameScreen = () => (
    <SafeAreaView style={[styles.container, { paddingTop: getSafePadding(), flex: 1 }]}> 
      <StatusBar style="dark" />
      <View style={styles.headerRow}>
        <TouchableOpacity
          style={styles.backButtonSmall}
          onPress={() => setCurrentScreen('menu')}
        >
          <Text style={styles.backButtonTextSmall}>Volver</Text>
        </TouchableOpacity>
        <Text style={styles.titleCentered}>PalabrAr</Text>
        <View style={{ width: 80 }} />
      </View>
      <View style={{ flex: 1, justifyContent: 'space-between', width: '100%' }}>
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <View style={styles.gameBoard}>
            {gameBoard.map((row, rowIndex) => (
              <View key={rowIndex} style={styles.row}>
                {row.map((letter, colIndex) => (
                  <View
                    key={colIndex}
                    style={[
                      styles.cell,
                      rowIndex < currentRow ? {
                        backgroundColor: getLetterColor(letter, colIndex, row.join(''))
                      } : null,
                      rowIndex === currentRow && colIndex === currentCol ? styles.activeCell : null
                    ]}
                  >
                    <Text style={[
                      styles.cellText,
                      rowIndex < currentRow ? styles.completedCellText : null
                    ]}>
                      {letter}
                    </Text>
                  </View>
                ))}
              </View>
            ))}
          </View>
        </View>
        <View style={{ width: '100%' }}>
          <View style={styles.keyboardBottom}>{renderKeyboard()}</View>
          <TouchableOpacity style={styles.enviarButton} onPress={submitGuess}>
            <Text style={styles.enviarButtonText}>Enviar</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );

  const renderMenuScreen = () => (
    <SafeAreaView style={[styles.container, { paddingTop: getSafePadding() }]}> 
      <StatusBar style="dark" />
      <Text style={styles.title}>PalabrAr</Text>
      <View style={styles.menuButtons}>
        <TouchableOpacity 
          style={styles.menuButton}
          onPress={() => {
            resetGame();
            setCurrentScreen('game');
          }}
        >
          <Text style={styles.menuButtonText}>Jugar</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.menuButton}
          onPress={() => setCurrentScreen('instructions')}
        >
          <Text style={styles.menuButtonText}>¿Cómo jugar?</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.menuButton}
          onPress={() => setCurrentScreen('stats')}
        >
          <Text style={styles.menuButtonText}>Estadísticas</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );

  const renderInstructionsScreen = () => (
    <SafeAreaView style={[styles.container, { paddingTop: getSafePadding() }]}> 
      <StatusBar style="dark" />
      <Text style={styles.title}>PalabrAr</Text>
      <Text style={styles.subtitle}>Cómo jugar</Text>
      
      <View style={styles.instructionsContainer}>
        <View style={styles.exampleRow}>
          <View style={[styles.exampleCell, { backgroundColor: '#6AAA64' }]}>
            <Text style={[styles.exampleCellText, { color: 'white' }]}>C</Text>
          </View>
          <View style={styles.exampleCell}>
            <Text style={styles.exampleCellText}>A</Text>
          </View>
          <View style={styles.exampleCell}>
            <Text style={styles.exampleCellText}>B</Text>
          </View>
          <View style={styles.exampleCell}>
            <Text style={styles.exampleCellText}>L</Text>
          </View>
          <View style={styles.exampleCell}>
            <Text style={styles.exampleCellText}>E</Text>
          </View>
          <View style={styles.exampleCell} />
        </View>
        <Text style={styles.instructionText}>Letra en lugar correcto</Text>
        
        <View style={styles.exampleRow}>
          <View style={styles.exampleCell}>
            <Text style={styles.exampleCellText}>A</Text>
          </View>
          <View style={styles.exampleCell}>
            <Text style={styles.exampleCellText}>B</Text>
          </View>
          <View style={[styles.exampleCell, { backgroundColor: '#C9B458' }]}>
            <Text style={[styles.exampleCellText, { color: 'white' }]}>A</Text>
          </View>
          <View style={styles.exampleCell}>
            <Text style={styles.exampleCellText}>L</Text>
          </View>
          <View style={styles.exampleCell}>
            <Text style={styles.exampleCellText}>E</Text>
          </View>
          <View style={styles.exampleCell} />
        </View>
        <Text style={styles.instructionText}>Letra en palabra, lugar incorrecto</Text>
        
        <View style={styles.exampleRow}>
          <View style={[styles.exampleCell, { backgroundColor: '#787C7E' }]}>
            <Text style={[styles.exampleCellText, { color: 'white' }]}>F</Text>
          </View>
          <View style={[styles.exampleCell, { backgroundColor: '#787C7E' }]}>
            <Text style={[styles.exampleCellText, { color: 'white' }]}>R</Text>
          </View>
          <View style={[styles.exampleCell, { backgroundColor: '#787C7E' }]}>
            <Text style={[styles.exampleCellText, { color: 'white' }]}>U</Text>
          </View>
          <View style={[styles.exampleCell, { backgroundColor: '#787C7E' }]}>
            <Text style={[styles.exampleCellText, { color: 'white' }]}>T</Text>
          </View>
          <View style={[styles.exampleCell, { backgroundColor: '#787C7E' }]}>
            <Text style={[styles.exampleCellText, { color: 'white' }]}>O</Text>
          </View>
        </View>
        <Text style={styles.instructionText}>Letra no está en la palabra</Text>
      </View>
      
      <TouchableOpacity 
        style={styles.backButton}
        onPress={() => setCurrentScreen('menu')}
      >
        <Text style={styles.backButtonText}>Volver</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );

  const renderStatsScreen = () => (
    <SafeAreaView style={[styles.container, { paddingTop: getSafePadding() }]}> 
      <StatusBar style="dark" />
      <Text style={styles.title}>PalabrAr</Text>
      <Text style={styles.subtitle}>Estadísticas</Text>
      
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
            <Text style={styles.statLabel}>Racha actual</Text>
          </View>
        </View>
        
        <View style={styles.distributionContainer}>
          {stats.guessDistribution.map((count, index) => (
            <View key={index} style={styles.distributionRow}>
              <Text style={styles.distributionNumber}>{index + 1}</Text>
              <View style={styles.distributionBar}>
                <View 
                  style={[
                    styles.distributionFill,
                    { 
                      width: stats.gamesWon > 0 ? `${Math.max((count / stats.gamesWon) * 100, count > 0 ? 10 : 0)}%` : '0%',
                      backgroundColor: count > 0 ? '#6AAA64' : '#E5E5E5'
                    }
                  ]}
                >
                  {count > 0 && <Text style={styles.distributionCount}>{count}</Text>}
                </View>
              </View>
            </View>
          ))}
        </View>
      </View>
      
      <TouchableOpacity 
        style={styles.backButton}
        onPress={() => setCurrentScreen('menu')}
      >
        <Text style={styles.backButtonText}>Volver</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );

  const renderCurrentScreen = () => {
    switch (currentScreen) {
      case 'menu':
        return renderMenuScreen();
      case 'game':
        return renderGameScreen();
      case 'instructions':
        return renderInstructionsScreen();
      case 'stats':
        return renderStatsScreen();
      default:
        return renderMenuScreen();
    }
  };

  // Ajuste de paddingTop para evitar la isla flotante/notch
  const getSafePadding = () => {
    if (Platform.OS === 'ios') {
      return 60;
    }
    return 40;
  };

  return renderCurrentScreen();
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    paddingTop: 20,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    justifyContent: 'space-between',
    marginBottom: 10,
    paddingHorizontal: 10,
  },
  titleCentered: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#4A90E2',
    textAlign: 'center',
    flex: 1,
  },
  backButtonSmall: {
    backgroundColor: '#4A90E2',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
  },
  backButtonTextSmall: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#4A90E2',
    marginBottom: 30,
  },
  subtitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333333',
    marginBottom: 30,
  },
  menuButtons: {
    flex: 1,
    justifyContent: 'center',
    width: '80%',
  },
  menuButton: {
    backgroundColor: '#4A90E2',
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 10,
    marginVertical: 10,
    alignItems: 'center',
  },
  menuButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  gameBoard: {
    marginBottom: 30,
  },
  row: {
    flexDirection: 'row',
    marginBottom: 5,
  },
  cell: {
    width: 50,
    height: 50,
    borderWidth: 2,
    borderColor: '#D3D6DA',
    marginHorizontal: 2,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
  },
  activeCell: {
    borderColor: '#4A90E2',
  },
  cellText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333333',
  },
  completedCellText: {
    color: '#FFFFFF',
  },
  keyboard: {
    width: '100%',
    paddingHorizontal: 10,
  },
  keyboardRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 5,
  },
  keyboardBottom: {
    width: '100%',
    paddingHorizontal: 0,
    marginBottom: 10,
    marginTop: 10,
    flex: 0,
  },
  key: {
    backgroundColor: '#D3D6DA',
    paddingVertical: 14, // reducido para más espacio vertical
    paddingHorizontal: 7, // reducido para más espacio horizontal
    marginHorizontal: 2,
    borderRadius: 4,
    minWidth: 34,
    alignItems: 'center',
  },
  wideKey: {
    paddingHorizontal: 12, // reducido para más espacio
    minWidth: 60, // reducido para que no ocupe tanto ancho
  },
  keyText: {
    fontSize: 24, // aumentado
    fontWeight: 'bold',
    color: '#333333',
  },
  wideKeyText: {
    fontSize: 20, // aumentado
  },
  instructionsContainer: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  exampleRow: {
    flexDirection: 'row',
    marginBottom: 10,
  },
  exampleCell: {
    width: 40,
    height: 40,
    borderWidth: 2,
    borderColor: '#D3D6DA',
    marginHorizontal: 2,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
  },
  exampleCellText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333333',
  },
  instructionText: {
    fontSize: 16,
    color: '#333333',
    marginBottom: 30,
    textAlign: 'center',
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
  statsContainer: {
    flex: 1,
    width: '90%',
    alignItems: 'center',
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginBottom: 30,
  },
  statItem: {
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#333333',
  },
  statLabel: {
    fontSize: 14,
    color: '#666666',
    textAlign: 'center',
  },
  distributionContainer: {
    width: '100%',
    paddingHorizontal: 20,
  },
  distributionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
  },
  distributionNumber: {
    fontSize: 16,
    fontWeight: 'bold',
    width: 20,
    textAlign: 'center',
  },
  distributionBar: {
    flex: 1,
    height: 30,
    backgroundColor: '#E5E5E5',
    marginLeft: 10,
    borderRadius: 4,
  },
  distributionFill: {
    height: '100%',
    borderRadius: 4,
    justifyContent: 'center',
    alignItems: 'center',
    minWidth: 30,
  },
  distributionCount: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 14,
  },
  enviarButton: {
    backgroundColor: '#2979FF',
    paddingVertical: 15,
    paddingHorizontal: 40,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 30,
    alignSelf: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    marginTop: 10,
  },
  enviarButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default App;