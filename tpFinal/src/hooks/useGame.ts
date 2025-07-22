import { useState, useEffect, useCallback } from 'react';
import { Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { PALABRA_DEL_DIA, PALABRAS_VALIDAS } from '../constants/gameConstants';
import { GameStats } from '../types';

// Valores iniciales para un juego nuevo
const initialBoard = () => Array(6).fill(null).map(() => Array(5).fill(''));
const initialGridColors = () => Array(6).fill(null).map(() => Array(5).fill('#FFFFFF'));
const initialKeyboardColors = {
  'Q': '#D3D6DA', 'W': '#D3D6DA', 'E': '#D3D6DA', 'R': '#D3D6DA', 'T': '#D3D6DA', 
  'Y': '#D3D6DA', 'U': '#D3D6DA', 'I': '#D3D6DA', 'O': '#D3D6DA', 'P': '#D3D6DA',
  'A': '#D3D6DA', 'S': '#D3D6DA', 'D': '#D3D6DA', 'F': '#D3D6DA', 'G': '#D3D6DA',
  'H': '#D3D6DA', 'J': '#D3D6DA', 'K': '#D3D6DA', 'L': '#D3D6DA', 'Ñ': '#D3D6DA',
  'Z': '#D3D6DA', 'X': '#D3D6DA', 'C': '#D3D6DA', 'V': '#D3D6DA', 'B': '#D3D6DA',
  'N': '#D3D6DA', 'M': '#D3D6DA'
};

const getTodayString = () => new Date().toISOString().split('T')[0];

export const useGame = () => {
  const [gameBoard, setGameBoard] = useState(initialBoard());
  const [currentRow, setCurrentRow] = useState(0);
  const [currentCol, setCurrentCol] = useState(0);
  const [gameStatus, setGameStatus] = useState<'playing' | 'won' | 'lost'>('playing');
  const [coloresGrilla, setColoresGrilla] = useState(initialGridColors());
  const [coloresTeclado, setColoresTeclado] = useState(initialKeyboardColors);
  const [stats, setStats] = useState<GameStats>({
    gamesPlayed: 0, gamesWon: 0, currentStreak: 0, maxStreak: 0, guessDistribution: [0, 0, 0, 0, 0, 0]
  });

  // Función para guardar el estado completo del juego
  const saveGameState = useCallback(async () => {
    const gameState = {
      board: gameBoard,
      colors: coloresGrilla,
      keyboardColors: coloresTeclado,
      row: currentRow,
      status: gameStatus,
      date: getTodayString(),
    };
    await AsyncStorage.setItem('palabrar_gameState', JSON.stringify(gameState));
  }, [gameBoard, coloresGrilla, coloresTeclado, currentRow, gameStatus]);

  // Guardar el estado cada vez que algo importante cambia
  useEffect(() => {
    if(gameStatus !== 'playing') {
      saveGameState();
    }
  }, [gameStatus, saveGameState]);


  // Cargar el estado al iniciar la app
  useEffect(() => {
    const loadState = async () => {
      // Cargar estadísticas
      const savedStats = await AsyncStorage.getItem('palabrar_stats');
      if (savedStats) setStats(JSON.parse(savedStats));

      // Cargar estado del juego
      const savedGame = await AsyncStorage.getItem('palabrar_gameState');
      if (savedGame) {
        const gameState = JSON.parse(savedGame);
        // Si el juego guardado es de hoy, lo cargamos
        if (gameState.date === getTodayString()) {
          setGameBoard(gameState.board);
          setColoresGrilla(gameState.colors);
          setColoresTeclado(gameState.keyboardColors);
          setCurrentRow(gameState.row);
          setGameStatus(gameState.status);
        } else {
          // Si es de otro día, se resetea (lo que resetGame hace)
          resetGame();
        }
      }
    };
    loadState();
  }, []); // El array vacío asegura que esto solo se ejecute una vez al inicio

  const resetGame = () => {
    setGameBoard(initialBoard());
    setColoresGrilla(initialGridColors());
    setColoresTeclado(initialKeyboardColors);
    setCurrentRow(0);
    setCurrentCol(0);
    setGameStatus('playing');
    // Limpia el estado del juego guardado para el nuevo día
    AsyncStorage.removeItem('palabrar_gameState');
  };

  const updateStats = (didWin: boolean) => {
    setStats(prevStats => {
      const newStats = {
        ...prevStats,
        gamesPlayed: prevStats.gamesPlayed + 1,
        gamesWon: didWin ? prevStats.gamesWon + 1 : prevStats.gamesWon,
        currentStreak: didWin ? prevStats.currentStreak + 1 : 0,
        maxStreak: didWin ? Math.max(prevStats.maxStreak, prevStats.currentStreak + 1) : prevStats.maxStreak,
        guessDistribution: [...prevStats.guessDistribution]
      };
      if (didWin) {
        newStats.guessDistribution[currentRow]++;
      }
      AsyncStorage.setItem('palabrar_stats', JSON.stringify(newStats));
      return newStats;
    });
  };

  const evaluarIntento = (intento: string): string[] => {
    const palabraSecretaArray = PALABRA_DEL_DIA.split('');
    const intentoArray = intento.split('');
    const coloresResult = Array(5).fill('#787C7E');
    for (let i = 0; i < 5; i++) {
      if (intentoArray[i] === palabraSecretaArray[i]) {
        coloresResult[i] = '#6AAA64';
        palabraSecretaArray[i] = '_';
        intentoArray[i] = '_';
      }
    }
    for (let i = 0; i < 5; i++) {
      if (intentoArray[i] !== '_') {
        const indice = palabraSecretaArray.indexOf(intentoArray[i]);
        if (indice !== -1) {
          coloresResult[i] = '#C9B458';
          palabraSecretaArray[indice] = '_';
        }
      }
    }
    return coloresResult;
  };
  
  const submitGuess = () => {
    const currentGuess = gameBoard[currentRow].join('');
    if (currentGuess.length !== 5 || !PALABRAS_VALIDAS.includes(currentGuess)) {
      Alert.alert('Error', currentGuess.length !== 5 ? 'Palabra incompleta' : 'Palabra no válida');
      return;
    }

    const coloresParaLaFila = evaluarIntento(currentGuess);
    const nuevaGrillaColores = [...coloresGrilla];
    nuevaGrillaColores[currentRow] = coloresParaLaFila;
    setColoresGrilla(nuevaGrillaColores);

    // Actualizar colores del teclado
    const nuevosColoresTeclado = { ...coloresTeclado };
    currentGuess.split('').forEach((letra, index) => {
        const colorActual = nuevosColoresTeclado[letra];
        const colorResultado = coloresParaLaFila[index];
        if (colorResultado === '#6AAA64') nuevosColoresTeclado[letra] = colorResultado;
        else if (colorResultado === '#C9B458' && colorActual !== '#6AAA64') nuevosColoresTeclado[letra] = colorResultado;
        else if (colorResultado === '#787C7E' && colorActual === '#D3D6DA') nuevosColoresTeclado[letra] = colorResultado;
    });
    setColoresTeclado(nuevosColoresTeclado);

    if (currentGuess === PALABRA_DEL_DIA) {
      setGameStatus('won');
      updateStats(true);
      Alert.alert('¡Felicitaciones!', `¡Adivinaste la palabra: ${PALABRA_DEL_DIA}!`);
    } else if (currentRow === 5) {
      setGameStatus('lost');
      updateStats(false);
      Alert.alert('Juego terminado', `La palabra era: ${PALABRA_DEL_DIA}`);
    } else {
      setCurrentRow(currentRow + 1);
      setCurrentCol(0);
    }
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
      if (currentCol === 5) submitGuess();
    } else if (currentCol < 5) {
      const newBoard = [...gameBoard];
      newBoard[currentRow][currentCol] = key;
      setGameBoard(newBoard);
      setCurrentCol(currentCol + 1);
    }
  };

  return { gameBoard, coloresGrilla, coloresTeclado, gameStatus, currentRow, currentCol, stats, handleKeyPress, resetGame };
};