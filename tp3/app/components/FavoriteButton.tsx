import React from 'react';
import { TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useFavorites } from '../context/FavoritesContext';
import { Meal } from '../services/RecipeApi';

interface FavoriteButtonProps {
  recipe: Meal;
  size?: number;
  color?: string;
}

const FavoriteButton: React.FC<FavoriteButtonProps> = ({ 
  recipe, 
  size = 24, 
  color = '#ff6b6b' 
}) => {
  const { addToFavorites, removeFromFavorites, isFavorite } = useFavorites();
  const isRecipeFavorite = isFavorite(recipe.idMeal);

  const handleToggleFavorite = async () => {
    try {
      if (isRecipeFavorite) {
        await removeFromFavorites(recipe.idMeal);
        Alert.alert('Removido', 'Receta removida de favoritos');
      } else {
        await addToFavorites(recipe);
        Alert.alert('Agregado', 'Receta agregada a favoritos');
      }
    } catch (error) {
      Alert.alert('Error', 'No se pudo actualizar favoritos');
      console.error('Error toggling favorite:', error);
    }
  };

  return (
    <TouchableOpacity
      style={styles.button}
      onPress={handleToggleFavorite}
      activeOpacity={0.7}
    >
      <Ionicons
        name={isRecipeFavorite ? 'heart' : 'heart-outline'}
        size={size}
        color={color}
      />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    padding: 4,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
  },
});

export default FavoriteButton;