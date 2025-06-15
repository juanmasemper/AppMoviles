import React from 'react';
import { TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useFavorites } from '../context/FavoritesContext';
import { useThemeContext } from '../../hooks/ThemeContext';
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
  const { theme } = useThemeContext();
  const isDark = theme === 'dark';
  const isRecipeFavorite = isFavorite(recipe.idMeal);

  const handleToggleFavorite = async () => {
    try {
      if (isRecipeFavorite) {
        await removeFromFavorites(recipe.idMeal);
      } else {
        await addToFavorites(recipe);
      }
    } catch (error) {
      Alert.alert('Error', 'No se pudo actualizar favoritos');
      console.error('Error toggling favorite:', error);
    }
  };

  return (
    <TouchableOpacity
      style={[
        styles.button,
        {
          backgroundColor: isDark 
            ? 'rgba(0, 0, 0, 0.6)' 
            : 'rgba(255, 255, 255, 0.9)'
        }
      ]}
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
    padding: 8,
    borderRadius: 20,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
  },
});

export default FavoriteButton;