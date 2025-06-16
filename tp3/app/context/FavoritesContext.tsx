import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Meal } from '../services/RecipeApi';
import { useAuth } from './AuthContext'; // Importar el hook de autenticación
import { db } from '../../config/firebase';
import { doc, setDoc, getDoc, updateDoc, arrayUnion, arrayRemove, onSnapshot } from "firebase/firestore";

interface FavoritesContextType {
  favorites: Meal[];
  addToFavorites: (recipe: Meal) => Promise<void>;
  removeFromFavorites: (recipeId: string) => Promise<void>;
  isFavorite: (recipeId: string) => boolean;
}

const FavoritesContext = createContext<FavoritesContextType | undefined>(undefined);

export const FavoritesProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [favorites, setFavorites] = useState<Meal[]>([]);
  const { user } = useAuth(); // Obtener el usuario actual

  useEffect(() => {
    if (user) {
      const userFavoritesRef = doc(db, 'favorites', user.uid);
      
      const unsubscribe = onSnapshot(userFavoritesRef, (docSnap) => {
        if (docSnap.exists()) {
          const favoritesData = docSnap.data()?.recipes || [];
          setFavorites(favoritesData);
        } else {
          setDoc(userFavoritesRef, { recipes: [] });
          setFavorites([]);
        }
      });

      return () => unsubscribe();
    } else {
      setFavorites([]);
    }
  }, [user]);

  const addToFavorites = async (recipe: Meal) => {
    if (!user) return; 
    const userFavoritesRef = doc(db, 'favorites', user.uid);
    await updateDoc(userFavoritesRef, {
        recipes: arrayUnion(recipe)
    });
  };

  const removeFromFavorites = async (recipeId: string) => {
    if (!user) return; 
    const recipeToRemove = favorites.find(fav => fav.idMeal === recipeId);
    if (recipeToRemove) {
      const userFavoritesRef = doc(db, 'favorites', user.uid);
      await updateDoc(userFavoritesRef, {
          recipes: arrayRemove(recipeToRemove)
      });
    }
  };

  const isFavorite = (recipeId: string) => {
    return favorites.some(fav => fav.idMeal === recipeId);
  };

  return (
    <FavoritesContext.Provider
      value={{
        favorites,
        addToFavorites,
        removeFromFavorites,
        isFavorite,
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
