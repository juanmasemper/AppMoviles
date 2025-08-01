import React, { useState, useEffect } from 'react';
import { BackHandler } from 'react-native';
import MenuScreen from './src/screens/MenuScreen';
import GameScreen from './src/screens/GameScreen';
import InstructionsScreen from './src/screens/InstructionsScreen';
import StatsScreen from './src/screens/StatsScreen';
import { useGame } from './src/hooks/useGame';
import { Screen, GameMode } from './src/types';

const App: React.FC = () => {
  const [currentScreen, setCurrentScreen] = useState<Screen>('menu');
  const [gameMode, setGameMode] = useState<GameMode>('daily');

  const gameLogic = useGame(gameMode);

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
  
  const handlePlay = (mode: GameMode) => {
    setGameMode(mode);
    if (gameLogic.gameStatus !== 'playing') {
      gameLogic.resetGame();
    }
    navigateTo('game');
  };

  const renderCurrentScreen = () => {
    switch (currentScreen) {
      case 'game':
        return <GameScreen onGoBack={() => navigateTo('menu')} gameMode={gameMode} {...gameLogic} />;
      
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