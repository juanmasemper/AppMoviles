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
  useColorScheme, // <-- AÑADIDO
  Pressable,      // <-- AÑADIDO
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { StatusBar as ExpoStatusBar } from 'expo-status-bar'; // Renombrado para evitar conflictos

const { width } = Dimensions.get('window');

// --- 1. PALETAS DE COLORES CENTRALIZADAS ---
const lightColors = {
  background: '#FFFFFF',
  text: '#333333',
  primary: '#4A90E2',
  primaryText: '#FFFFFF',
  secondaryText: '#666666',
  cellBorder: '#D3D6DA',
  cellBackground: '#FFFFFF',
  keyBackground: '#D3D6DA',
  keyText: '#333333',
  enviarButton: '#2979FF',
  correct: '#6AAA64',
  present: '#C9B458',
  absent: '#787C7E',
  distributionBar: '#E5E5E5',
};

const darkColors = {
  background: '#121213',
  text: '#FFFFFF',
  primary: '#4A90E2',
  primaryText: '#FFFFFF',
  secondaryText: '#A5A5A5',
  cellBorder: '#3A3A3C',
  cellBackground: '#121213',
  keyBackground: '#818384',
  keyText: '#FFFFFF',
  enviarButton: '#2979FF',
  correct: '#6AAA64',
  present: '#C9B458',
  absent: '#3A3A3C',
  distributionBar: '#3A3A3C',
};

const PALABRAS_VALIDAS = [
  'GATOS', 'TANGO', 'CABLE', 'FRUTO', 'MUNDO', 'PLAYA', 'VERDE', 'NEGRO',
  'ROJO', 'AZUL', 'ROSA', 'CASA', 'MESA', 'SILLA', 'AGUA', 'LAPIZ',
  'ARBOL', 'HOJA', 'RAIZ', 'LUNA', 'FLOR', 'CAMPO', 'MONTE', 'LAGO',
  'ARENA', 'ROCA', 'TELA', 'LANA', 'SEDA', 'PAPEL', 'LIBRO', 'CIELO',
  'NUBE', 'PLAZA', 'BANCO', 'HOTEL', 'PLATO', 'VASO', 'JARRA', 'OLLA',
  'HORNO', 'SALON', 'CUARTO', 'CALLE', 'PIEDRA', 'MADERA', 'SOFÁ',
  'PERRO', 'GOLPE', 'FELIZ', 'NIEVE', 'BESOS', 'BOLSA', 'CANTO', 'CIEGA',
  'CLAVE', 'CREMA', 'CRUCE', 'DADOS', 'DANZA', 'DOLOR', 'FANGO', 'FAROL',
  'FIEST', 'FIRMA', 'FONDO', 'FRESA', 'FUEGO', 'GAFAS', 'GRANO', 'GRITO',
  'HABLA', 'HIELO', 'HUEVO', 'JUEGO', 'JUNTA', 'LIMON', 'LLAVE', 'LUCHA',
  'LUZES', 'MANOS', 'MARCO', 'MARCH', 'MORAL', 'MOROS', 'MOTOR', 'NADAR',
  'NARIZ', 'NIEVE', 'NOBLE', 'NORTE', 'NOTAS', 'NUBES', 'OCASO', 'OJOS',
  'OLVID', 'ONDAA', 'OROZO', 'PAGAR', 'PAISA', 'PALMA', 'PANEL', 'PAPAS',
  'PARTE', 'PATIO', 'PAUSA', 'PEINE', 'PELOS', 'PERLA', 'PIANO', 'PIEZA',
  'PLAZO', 'PLUMA', 'POEMA', 'POLVO', 'PRESA', 'PRISA', 'PUNTO', 'QUESO',
  'RAMAS', 'RATON', 'REINA', 'RELOJ', 'RIEGO', 'RISAS', 'ROBLE', 'ROCAS',
  'RUEDA', 'SALSA', 'SELVA', 'SERIE', 'SILLA', 'SUELO', 'TAREA', 'TARRO',
  'TECHO', 'TENIS', 'TESOR', 'TIARA', 'TIEMO', 'TIENE', 'TIERRA', 'TINTO',
  'TORRE', 'TRUCO', 'UNION', 'URGEN', 'VALOR', 'VELAS', 'VIAJE', 'VIDAS',
  'VIENTO', 'VISTA', 'VIVIR', 'VOCAL', 'YERBA', 'ZORRO', 'ZURDO'
];


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
  const systemTheme = useColorScheme(); // 'light' o 'dark'
  const [theme, setTheme] = useState(systemTheme || 'light');

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
    guessDistribution: [0, 0, 0, 0, 0, 0],
  });

  // --- 2. LÓGICA DEL TEMA (CARGAR, GUARDAR Y CAMBIAR) ---
  useEffect(() => {
    loadTheme();
    loadStats();
  }, []);
  
  const loadTheme = async () => {
    try {
      const savedTheme = await AsyncStorage.getItem('theme');
      if (savedTheme === 'light' || savedTheme === 'dark') {
        setTheme(savedTheme);
      } else {
        setTheme(systemTheme === 'light' || systemTheme === 'dark' ? systemTheme : 'light');
      }
    } catch (error) {
      console.error('Error loading theme:', error);
      setTheme(systemTheme || 'light');
    }
  };

  const toggleTheme = async () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    try {
      await AsyncStorage.setItem('theme', newTheme);
    } catch (error) {
      console.error('Error saving theme:', error);
    }
  };

  // Selecciona la paleta de colores activa y crea los estilos dinámicos
  const colors = theme === 'light' ? lightColors : darkColors;
  const styles = createStyles(colors);

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

  // --- 3. FUNCIÓN DE COLOR ADAPTADA ---
  const getLetterColor = (letter: string, position: number): string => {
    if (PALABRA_DEL_DIA[position] === letter) {
      return colors.correct;
    } else if (PALABRA_DEL_DIA.includes(letter)) {
      return colors.present;
    } else {
      return colors.absent;
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
      ),
    };
    saveStats(newStats);
  };

  const updateStatsOnLoss = () => {
    const newStats = {
      ...stats,
      gamesPlayed: stats.gamesPlayed + 1,
      currentStreak: 0,
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
      ['Z', 'X', 'C', 'V', 'B', 'N', 'M', 'BORRAR'],
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
                  key === 'BORRAR' ? styles.wideKey : null,
                ]}
                onPress={() => handleKeyPress(key)}
              >
                <Text style={[styles.keyText, key === 'BORRAR' ? styles.wideKeyText : null]}>
                  {key}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        ))}
      </View>
    );
  };
  
  // --- 4. RENDERIZADO DE PANTALLAS CON ESTILOS Y STATUSBAR DINÁMICOS ---
  const renderGameScreen = () => (
    <SafeAreaView style={[styles.container, { paddingTop: getSafePadding() }]}>
      <ExpoStatusBar style={theme === 'light' ? 'dark' : 'light'} />
      <View style={styles.headerRow}>
        <TouchableOpacity style={styles.backButtonSmall} onPress={() => setCurrentScreen('menu')}>
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
                      rowIndex < currentRow ? { backgroundColor: getLetterColor(letter, colIndex) } : null,
                      rowIndex === currentRow && currentCol === colIndex ? styles.activeCell : null,
                    ]}
                  >
                    <Text style={[styles.cellText, rowIndex < currentRow ? styles.completedCellText : null]}>
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
      <ExpoStatusBar style={theme === 'light' ? 'dark' : 'light'} />
      <View style={styles.headerRow}>
          <Text style={styles.title}>PalabrAr</Text>
          {/* --- BOTÓN PARA CAMBIAR TEMA --- */}
          <Pressable onPress={toggleTheme} style={styles.themeButton}>
              <Text style={styles.themeButtonText}>{theme === 'light' ? '🌙' : '☀️'}</Text>
          </Pressable>
      </View>
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
        <TouchableOpacity style={styles.menuButton} onPress={() => setCurrentScreen('instructions')}>
          <Text style={styles.menuButtonText}>¿Cómo jugar?</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.menuButton} onPress={() => setCurrentScreen('stats')}>
          <Text style={styles.menuButtonText}>Estadísticas</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );

  const renderInstructionsScreen = () => (
    <SafeAreaView style={[styles.container, { paddingTop: getSafePadding() }]}>
      <ExpoStatusBar style={theme === 'light' ? 'dark' : 'light'} />
      <Text style={styles.title}>PalabrAr</Text>
      <Text style={styles.subtitle}>Cómo jugar</Text>
      <View style={styles.instructionsContainer}>
        <View style={styles.exampleRow}>
          <View style={[styles.exampleCell, { backgroundColor: colors.correct }]}><Text style={styles.completedCellText}>C</Text></View>
          <View style={styles.exampleCell}><Text style={styles.exampleCellText}>A</Text></View>
          <View style={styles.exampleCell}><Text style={styles.exampleCellText}>B</Text></View>
          <View style={styles.exampleCell}><Text style={styles.exampleCellText}>L</Text></View>
          <View style={styles.exampleCell}><Text style={styles.exampleCellText}>E</Text></View>
        </View>
        <Text style={styles.instructionText}>Letra en lugar correcto</Text>
        <View style={styles.exampleRow}>
          <View style={styles.exampleCell}><Text style={styles.exampleCellText}>T</Text></View>
          <View style={[styles.exampleCell, { backgroundColor: colors.present }]}><Text style={styles.completedCellText}>A</Text></View>
          <View style={styles.exampleCell}><Text style={styles.exampleCellText}>N</Text></View>
          <View style={styles.exampleCell}><Text style={styles.exampleCellText}>G</Text></View>
          <View style={styles.exampleCell}><Text style={styles.exampleCellText}>O</Text></View>
        </View>
        <Text style={styles.instructionText}>Letra en palabra, lugar incorrecto</Text>
        <View style={styles.exampleRow}>
          <View style={[styles.exampleCell, { backgroundColor: colors.absent }]}><Text style={styles.completedCellText}>F</Text></View>
          <View style={[styles.exampleCell, { backgroundColor: colors.absent }]}><Text style={styles.completedCellText}>R</Text></View>
          <View style={[styles.exampleCell, { backgroundColor: colors.absent }]}><Text style={styles.completedCellText}>U</Text></View>
          <View style={[styles.exampleCell, { backgroundColor: colors.absent }]}><Text style={styles.completedCellText}>T</Text></View>
          <View style={[styles.exampleCell, { backgroundColor: colors.absent }]}><Text style={styles.completedCellText}>O</Text></View>
        </View>
        <Text style={styles.instructionText}>Letra no está en la palabra</Text>
      </View>
      <TouchableOpacity style={styles.backButton} onPress={() => setCurrentScreen('menu')}>
        <Text style={styles.backButtonText}>Volver</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );

  const renderStatsScreen = () => (
    <SafeAreaView style={[styles.container, { paddingTop: getSafePadding() }]}>
      <ExpoStatusBar style={theme === 'light' ? 'dark' : 'light'} />
      <Text style={styles.title}>PalabrAr</Text>
      <Text style={styles.subtitle}>Estadísticas</Text>
      <View style={styles.statsContainer}>
        <View style={styles.statsRow}>
          <View style={styles.statItem}><Text style={styles.statNumber}>{stats.gamesPlayed}</Text><Text style={styles.statLabel}>Jugados</Text></View>
          <View style={styles.statItem}><Text style={styles.statNumber}>{stats.gamesWon}</Text><Text style={styles.statLabel}>Ganados</Text></View>
          <View style={styles.statItem}><Text style={styles.statNumber}>{stats.currentStreak}</Text><Text style={styles.statLabel}>Racha actual</Text></View>
        </View>
        <View style={styles.distributionContainer}>
          {stats.guessDistribution.map((count, index) => (
            <View key={index} style={styles.distributionRow}>
              <Text style={styles.distributionNumber}>{index + 1}</Text>
              <View style={styles.distributionBar}>
                <View style={[styles.distributionFill, { width: stats.gamesWon > 0 ? `${Math.max((count / stats.gamesWon) * 100, count > 0 ? 10 : 0)}%` : '0%', backgroundColor: count > 0 ? colors.correct : colors.distributionBar }]}>
                  {count > 0 && <Text style={styles.distributionCount}>{count}</Text>}
                </View>
              </View>
            </View>
          ))}
        </View>
      </View>
      <TouchableOpacity style={styles.backButton} onPress={() => setCurrentScreen('menu')}>
        <Text style={styles.backButtonText}>Volver</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );

  const renderCurrentScreen = () => {
    switch (currentScreen) {
      case 'menu': return renderMenuScreen();
      case 'game': return renderGameScreen();
      case 'instructions': return renderInstructionsScreen();
      case 'stats': return renderStatsScreen();
      default: return renderMenuScreen();
    }
  };

  const getSafePadding = () => (Platform.OS === 'ios' ? 60 : 40);

  return renderCurrentScreen();
};

// --- 5. STYLESHEET COMO FUNCIÓN DINÁMICA ---
const createStyles = (colors) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    alignItems: 'center',
    paddingTop: 20,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '90%',
    justifyContent: 'space-between',
    marginBottom: 30,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: colors.primary,
  },
  titleCentered: {
    fontSize: 32,
    fontWeight: 'bold',
    color: colors.primary,
    textAlign: 'center',
    flex: 1,
  },
  subtitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 30,
  },
  themeButton: {
    padding: 8,
  },
  themeButtonText: {
    fontSize: 28,
  },
  menuButtons: {
    flex: 1,
    justifyContent: 'center',
    width: '80%',
  },
  menuButton: {
    backgroundColor: colors.primary,
    paddingVertical: 15,
    borderRadius: 10,
    marginVertical: 10,
    alignItems: 'center',
  },
  menuButtonText: {
    color: colors.primaryText,
    fontSize: 18,
    fontWeight: 'bold',
  },
  gameBoard: {
    marginBottom: 20,
  },
  row: {
    flexDirection: 'row',
    marginBottom: 5,
  },
  cell: {
    width: 50,
    height: 50,
    borderWidth: 2,
    borderColor: colors.cellBorder,
    marginHorizontal: 2,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.cellBackground,
  },
  activeCell: {
    borderColor: colors.primary,
  },
  cellText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.text,
  },
  completedCellText: {
    color: colors.primaryText,
  },
  keyboard: {
    width: '100%',
  },
  keyboardRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 5,
  },
  keyboardBottom: {
    marginBottom: 10,
  },
  key: {
    backgroundColor: colors.keyBackground,
    paddingVertical: 14,
    paddingHorizontal: 7,
    marginHorizontal: 2,
    borderRadius: 4,
    minWidth: (width / 10) - 6, // Ajuste para que entre en pantalla
    alignItems: 'center',
  },
  wideKey: {
    minWidth: (width / 10) * 1.5,
  },
  keyText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.keyText,
  },
  wideKeyText: {
    fontSize: 14,
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
    borderColor: colors.cellBorder,
    marginHorizontal: 2,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.cellBackground,
  },
  exampleCellText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.text,
  },
  instructionText: {
    fontSize: 16,
    color: colors.text,
    marginBottom: 30,
    textAlign: 'center',
  },
  backButton: {
    backgroundColor: colors.primary,
    paddingVertical: 15,
    paddingHorizontal: 50,
    borderRadius: 10,
    marginBottom: 30,
  },
  backButtonText: {
    color: colors.primaryText,
    fontSize: 18,
    fontWeight: 'bold',
  },
  backButtonSmall: {
    backgroundColor: colors.primary,
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 10,
  },
  backButtonTextSmall: {
    color: colors.primaryText,
    fontSize: 16,
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
    color: colors.text,
  },
  statLabel: {
    fontSize: 14,
    color: colors.secondaryText,
    textAlign: 'center',
  },
  distributionContainer: {
    width: '100%',
  },
  distributionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
  },
  distributionNumber: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.text,
    width: 20,
    textAlign: 'center',
  },
  distributionBar: {
    flex: 1,
    height: 30,
    backgroundColor: colors.distributionBar,
    marginLeft: 10,
    borderRadius: 4,
  },
  distributionFill: {
    height: '100%',
    borderRadius: 4,
    justifyContent: 'center',
    alignItems: 'flex-end',
    paddingRight: 5,
    minWidth: 30,
  },
  distributionCount: {
    color: colors.primaryText,
    fontWeight: 'bold',
    fontSize: 14,
  },
  enviarButton: {
    backgroundColor: colors.enviarButton,
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginHorizontal: 20,
    marginBottom: 20,
    marginTop: 10,
  },
  enviarButtonText: {
    color: colors.primaryText,
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default App;