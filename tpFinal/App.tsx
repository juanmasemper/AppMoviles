import React, { useState, useEffect } from 'react';
import { BackHandler } from 'react-native';
import MenuScreen from './src/screens/MenuScreen';
import GameScreen from './src/screens/GameScreen';
import InstructionsScreen from './src/screens/InstructionsScreen';
import StatsScreen from './src/screens/StatsScreen';
import { useGame } from './src/hooks/useGame';
import { Screen } from './src/types';

const App: React.FC = () => {
  const [currentScreen, setCurrentScreen] = useState<Screen>('menu');

  // Llamamos a useGame aquí, UNA SOLA VEZ.
  const gameLogic = useGame();

  useEffect(() => {
    const backAction = () => {
      if (currentScreen !== 'menu') {
        setCurrentScreen('menu');
        return true;
      }
      return false;
    };
    const backHandler = BackHandler.addEventListener('hardwareBackPress', backAction);
    return () => backHandler.remove();
  }, [currentScreen]);

  const navigateTo = (screen: Screen) => setCurrentScreen(screen);
  
  const handlePlay = () => {
    // Si el juego ya terminó hoy, no lo reseteamos.
    if(gameLogic.gameStatus === 'playing') {
      gameLogic.resetGame();
    }
    navigateTo('game');
  };

  const renderCurrentScreen = () => {
    switch (currentScreen) {
      case 'game':
        // Pasamos toda la lógica y el estado a GameScreen como props.
        return <GameScreen onGoBack={() => navigateTo('menu')} {...gameLogic} />;
      
      case 'instructions':
        return <InstructionsScreen onGoBack={() => navigateTo('menu')} />;
      
      case 'stats':
        return <StatsScreen onGoBack={() => navigateTo('menu')} stats={gameLogic.stats} />;
      
      case 'menu':
      default:
        return (
          <MenuScreen
            onNavigateToGame={handlePlay}
            onNavigateToInstructions={() => navigateTo('instructions')}
            onNavigateToStats={() => navigateTo('stats')}
          />
        );
    }
  };

  return renderCurrentScreen();
};

export default App;