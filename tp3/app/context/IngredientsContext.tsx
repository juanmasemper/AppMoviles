import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface Ingredient {
  id: string;
  name: string;
}

interface IngredientsContextType {
  ingredients: Ingredient[];
  addIngredient: (name: string) => Promise<void>;
  removeIngredient: (id: string) => Promise<void>;
}

const IngredientsContext = createContext<IngredientsContextType | undefined>(undefined);

const INGREDIENTS_STORAGE_KEY = '@ingredients';

export const IngredientsProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [ingredients, setIngredients] = useState<Ingredient[]>([]);

  useEffect(() => {
    loadIngredients();
  }, []);

  const loadIngredients = async () => {
    try {
      const storedIngredients = await AsyncStorage.getItem(INGREDIENTS_STORAGE_KEY);
      if (storedIngredients) {
        setIngredients(JSON.parse(storedIngredients));
      }
    } catch (error) {
      console.error('Error loading ingredients:', error);
    }
  };

  const saveIngredients = async (newIngredients: Ingredient[]) => {
    try {
      await AsyncStorage.setItem(INGREDIENTS_STORAGE_KEY, JSON.stringify(newIngredients));
    } catch (error) {
      console.error('Error saving ingredients:', error);
    }
  };

  const addIngredient = async (name: string) => {
    if (name.trim() === '' || ingredients.some(i => i.name.toLowerCase() === name.toLowerCase())) {
      return;
    }
    const newIngredient: Ingredient = { id: Date.now().toString(), name };
    const newIngredients = [...ingredients, newIngredient];
    setIngredients(newIngredients);
    await saveIngredients(newIngredients);
  };

  const removeIngredient = async (id: string) => {
    const newIngredients = ingredients.filter(i => i.id !== id);
    setIngredients(newIngredients);
    await saveIngredients(newIngredients);
  };

  return (
    <IngredientsContext.Provider value={{ ingredients, addIngredient, removeIngredient }}>
      {children}
    </IngredientsContext.Provider>
  );
};

export const useIngredients = () => {
  const context = useContext(IngredientsContext);
  if (context === undefined) {
    throw new Error('useIngredients must be used within a IngredientsProvider');
  }
  return context;
};
