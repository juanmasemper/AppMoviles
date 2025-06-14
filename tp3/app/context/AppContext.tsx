import React, { createContext, useContext, useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Meal } from '../services/RecipeApi';

interface AppContextProps {
  favorites: Meal[];
  addFavorite: (recipe: Meal) => void;
  removeFavorite: (id: string) => void;
  availableIngredients: string[];
  addIngredient: (ingredient: string) => void;
  removeIngredient: (ingredient: string) => void;
  isDarkMode: boolean;
  toggleTheme: () => void;
}

const AppContext = createContext<AppContextProps>({
  favorites: [],
  addFavorite: () => {},
  removeFavorite: () => {},
  availableIngredients: [],
  addIngredient: () => {},
  removeIngredient: () => {},
  isDarkMode: false,
  toggleTheme: () => {},
});

export const useAppContext = () => useContext(AppContext);

export const AppProvider: React.FC<{children: React.ReactNode}> = ({ children }) => {
  const [favorites, setFavorites] = useState<Meal[]>([]);
  const [availableIngredients, setAvailableIngredients] = useState<string[]>([]);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const savedFavorites = await AsyncStorage.getItem('@favorites');
        const savedIngredients = await AsyncStorage.getItem('@ingredients');
        const savedTheme = await AsyncStorage.getItem('@theme');
        
        if (savedFavorites) setFavorites(JSON.parse(savedFavorites));
        if (savedIngredients) setAvailableIngredients(JSON.parse(savedIngredients));
        if (savedTheme) setIsDarkMode(savedTheme === 'dark');
      } catch (error) {
        console.error('Error loading data', error);
      } finally {
        setLoading(false);
      }
    };
    
    loadData();
  }, []);

  useEffect(() => {
    if (!loading) {
      AsyncStorage.setItem('@favorites', JSON.stringify(favorites));
    }
  }, [favorites, loading]);

  useEffect(() => {
    if (!loading) {
      AsyncStorage.setItem('@ingredients', JSON.stringify(availableIngredients));
    }
  }, [availableIngredients, loading]);

  useEffect(() => {
    if (!loading) {
      AsyncStorage.setItem('@theme', isDarkMode ? 'dark' : 'light');
    }
  }, [isDarkMode, loading]);

  const addFavorite = (recipe: Meal) => {
    if (!favorites.some(fav => fav.idMeal === recipe.idMeal)) {
      setFavorites([...favorites, recipe]);
    }
  };

  const removeFavorite = (id: string) => {
    setFavorites(favorites.filter(recipe => recipe.idMeal !== id));
  };

  const addIngredient = (ingredient: string) => {
    if (!availableIngredients.includes(ingredient)) {
      setAvailableIngredients([...availableIngredients, ingredient]);
    }
  };

  const removeIngredient = (ingredient: string) => {
    setAvailableIngredients(availableIngredients.filter(item => item !== ingredient));
  };

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
  };

  return (
    <AppContext.Provider value={{
      favorites,
      addFavorite,
      removeFavorite,
      availableIngredients,
      addIngredient,
      removeIngredient,
      isDarkMode,
      toggleTheme
    }}>
      {children}
    </AppContext.Provider>
  );
};