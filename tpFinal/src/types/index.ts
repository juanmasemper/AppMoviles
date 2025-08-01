
export interface GameStats {
  gamesPlayed: number;
  gamesWon: number;
  currentStreak: number;
  maxStreak: number;
  guessDistribution: number[];
}

export type GameMode = 'daily' | 'free';

export type Screen = 'menu' | 'game' | 'instructions' | 'stats';