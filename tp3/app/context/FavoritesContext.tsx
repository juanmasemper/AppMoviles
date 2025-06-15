import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Meal } from '../services/RecipeApi';

interface FavoritesContextType {
  favorites: Meal[];
  addToFavorites: (recipe: Meal) => Promise<void>;
  removeFromFavorites: (recipeId: string) => Promise<void>;
  isFavorite: (recipeId: string) => boolean;
  loadFavorites: () => Promise<void>;
}

const FavoritesContext = createContext<FavoritesContextType | undefined>(undefined);

const FAVORITES_STORAGE_KEY = '@favorites';

export const FavoritesProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [favorites, setFavorites] = useState<Meal[]>([]);

  const loadFavorites = async () => {
    try {
      const storedFavorites = await AsyncStorage.getItem(FAVORITES_STORAGE_KEY);
      if (storedFavorites) {
        setFavorites(JSON.parse(storedFavorites));
      }
    } catch (error) {
      console.error('Error loading favorites:', error);
    }
  };

  const saveFavorites = async (newFavorites: Meal[]) => {
    try {
      await AsyncStorage.setItem(FAVORITES_STORAGE_KEY, JSON.stringify(newFavorites));
    } catch (error) {
      console.error('Error saving favorites:', error);
    }
  };

  const addToFavorites = async (recipe: Meal) => {
    const newFavorites = [...favorites, recipe];
    setFavorites(newFavorites);
    await saveFavorites(newFavorites);
  };

  const removeFromFavorites = async (recipeId: string) => {
    const newFavorites = favorites.filter(fav => fav.idMeal !== recipeId);
    setFavorites(newFavorites);
    await saveFavorites(newFavorites);
  };

  const isFavorite = (recipeId: string) => {
    return favorites.some(fav => fav.idMeal === recipeId);
  };

  useEffect(() => {
    loadFavorites();
  }, []);

  return (
    <FavoritesContext.Provider
      value={{
        favorites,
        addToFavorites,
        removeFromFavorites,
        isFavorite,
        loadFavorites,
      }}
    >
      {children}
    </FavoritesContext.Provider>
  );
};

export const useFavorites = () => {
  const context = useContext(FavoritesContext);
  if (context === undefined) {
    throw new Error('useFavorites must be used within a FavoritesProvider');
  }
  return context;
};