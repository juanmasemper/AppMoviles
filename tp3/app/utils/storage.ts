import AsyncStorage from '@react-native-async-storage/async-storage';
import { Meal } from '../services/RecipeApi';

// Guardar favoritos
export const saveFavorites = async (favorites: Meal[]) => {
  try {
    await AsyncStorage.setItem('@favorites', JSON.stringify(favorites));
  } catch (error) {
    console.error('Error saving favorites', error);
  }
};

// Cargar favoritos
export const loadFavorites = async (): Promise<Meal[]> => {
  try {
    const favorites = await AsyncStorage.getItem('@favorites');
    return favorites ? JSON.parse(favorites) : [];
  } catch (error) {
    console.error('Error loading favorites', error);
    return [];
  }
};

// Guardar ingredientes
export const saveIngredients = async (ingredients: string[]) => {
  try {
    await AsyncStorage.setItem('@ingredients', JSON.stringify(ingredients));
  } catch (error) {
    console.error('Error saving ingredients', error);
  }
};

// Cargar ingredientes
export const loadIngredients = async (): Promise<string[]> => {
  try {
    const ingredients = await AsyncStorage.getItem('@ingredients');
    return ingredients ? JSON.parse(ingredients) : [];
  } catch (error) {
    console.error('Error loading ingredients', error);
    return [];
  }
};