import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useAuth } from './AuthContext'; // Asegúrate de que la ruta a tu AuthContext sea correcta
import { db } from '../../config/firebase'; // Asegúrate de que la ruta a tu config de Firebase sea correcta
import { doc, onSnapshot, updateDoc, arrayUnion, arrayRemove, setDoc } from "firebase/firestore";

// La estructura de un ingrediente sigue siendo la misma
interface Ingredient {
  id: string;
  name: string;
}

interface IngredientsContextType {
  ingredients: Ingredient[];
  addIngredient: (name: string) => Promise<void>;
  // Importante: Ahora necesitamos el objeto completo para eliminarlo de Firestore
  removeIngredient: (ingredient: Ingredient) => Promise<void>;
}

const IngredientsContext = createContext<IngredientsContextType | undefined>(undefined);

export const IngredientsProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [ingredients, setIngredients] = useState<Ingredient[]>([]);
  const { user } = useAuth(); // Obtenemos el usuario actual del contexto de autenticación

  useEffect(() => {
    // Si hay un usuario con sesión iniciada, nos suscribimos a sus datos
    if (user) {
      // Apuntamos a un documento en la colección 'ingredients' que tiene el ID del usuario
      const userIngredientsRef = doc(db, 'ingredients', user.uid);

      // onSnapshot escucha cambios en tiempo real en ese documento
      const unsubscribe = onSnapshot(userIngredientsRef, (docSnap) => {
        if (docSnap.exists()) {
          // Si el documento del usuario ya existe, cargamos sus ingredientes
          setIngredients(docSnap.data()?.items || []);
        } else {
          // Si es un usuario nuevo, creamos su documento en la base de datos con una despensa vacía
          setDoc(userIngredientsRef, { items: [] });
          setIngredients([]);
        }
      });

      // Se desuscribe del listener cuando el usuario cambia o el componente se desmonta para evitar fugas de memoria
      return () => unsubscribe();
    } else {
      // Si no hay usuario, la despensa se vacía
      setIngredients([]);
    }
  }, [user]); // Este efecto se ejecuta cada vez que 'user' cambia

  const addIngredient = async (name: string) => {
    if (!user) return; // Guardia para asegurarse de que haya un usuario
    if (name.trim() === '' || ingredients.some(i => i.name.toLowerCase() === name.toLowerCase())) {
      return; // Previene duplicados o ingredientes vacíos
    }
    const newIngredient: Ingredient = { id: Date.now().toString(), name: name.trim() };
    const userIngredientsRef = doc(db, 'ingredients', user.uid);
    // Añade el nuevo ingrediente al array 'items' en Firestore de forma atómica
    await updateDoc(userIngredientsRef, {
        items: arrayUnion(newIngredient)
    });
  };

  const removeIngredient = async (ingredientToRemove: Ingredient) => {
    if (!user) return; // Guardia para asegurarse de que haya un usuario
    const userIngredientsRef = doc(db, 'ingredients', user.uid);
    // Elimina el ingrediente del array 'items' en Firestore de forma atómica
    await updateDoc(userIngredientsRef, {
        items: arrayRemove(ingredientToRemove)
    });
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
