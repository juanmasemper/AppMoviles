import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { Meal } from '../services/RecipeApi';
import { useThemeContext } from '../../hooks/ThemeContext';

interface RecipeCardProps {
  recipe: Meal;
  onPress: () => void;
}

const RecipeCard: React.FC<RecipeCardProps> = ({ recipe, onPress }) => {
  const { theme } = useThemeContext();
  const isDark = theme === 'dark';

  return (
    <TouchableOpacity
      style={[
        styles.card,
        { backgroundColor: isDark ? '#1e1e1e' : '#fff' },
      ]}
      onPress={onPress}
    >
      <Image source={{ uri: recipe.strMealThumb }} style={styles.image} />
      <View style={styles.infoContainer}>
        <Text style={[styles.name, { color: isDark ? '#fff' : '#333' }]}>
          {recipe.strMeal}
        </Text>
        {recipe.strCategory && (
          <Text style={[styles.category, { color: isDark ? '#bbb' : '#666' }]}>
            Categoría: {recipe.strCategory}
          </Text>
        )}
        {recipe.strArea && (
          <Text style={[styles.category, { color: isDark ? '#bbb' : '#666' }]}>
            Origen: {recipe.strArea}
          </Text>
        )}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 20,
    marginHorizontal: 15,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    flexDirection: 'column',
  },
  image: {
    width: '100%',
    height: 200,
  },
  infoContainer: {
    padding: 15,
  },
  name: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  category: {
    fontSize: 14,
    marginBottom: 4,
  },
});

export default RecipeCard;
