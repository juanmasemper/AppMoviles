import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { Meal } from '../services/RecipeApi'; 
import FavoriteButton from './FavoriteButton';

interface RecipeCardProps {
  recipe: Meal;
  onPress: () => void;
}

const RecipeCard: React.FC<RecipeCardProps> = ({ recipe, onPress }) => {
  return (
    <TouchableOpacity style={styles.card} onPress={onPress}>
      <View style={styles.imageContainer}>
        <Image source={{ uri: recipe.strMealThumb }} style={styles.image} />
        <View style={styles.favoriteButtonContainer}>
          <FavoriteButton recipe={recipe} />
        </View>
      </View>
      <View style={styles.infoContainer}>
        <Text style={styles.name}>{recipe.strMeal}</Text>
        {recipe.strCategory && <Text style={styles.category}>Categoría: {recipe.strCategory}</Text>}
        {recipe.strArea && <Text style={styles.category}>Origen: {recipe.strArea}</Text>}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
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
  imageContainer: {
    position: 'relative',
  },
  image: {
    width: '100%',
    height: 200,
  },
  favoriteButtonContainer: {
    position: 'absolute',
    top: 10,
    right: 10,
  },
  infoContainer: {
    padding: 15,
  },
  name: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#333',
  },
  category: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  }
});

export default RecipeCard;