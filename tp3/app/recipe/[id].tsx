import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, Image, StyleSheet, ActivityIndicator, Linking } from 'react-native';
import { getRecipeDetailsById } from '../services/RecipeApi';
import { useLocalSearchParams } from 'expo-router';
import FavoriteButton from '../components/FavoriteButton';
import { useAppContext } from '../context/AppContext';

const RecipeDetailScreen = () => {
  const { id } = useLocalSearchParams();
  const [recipe, setRecipe] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const { favorites, addFavorite, removeFavorite } = useAppContext();
  
  const isFavorite = favorites.some(fav => fav.idMeal === recipe?.idMeal);

  useEffect(() => {
    const fetchRecipe = async () => {
      try {
        const recipeData = await getRecipeDetailsById(id as string);
        setRecipe(recipeData);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchRecipe();
  }, [id]);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (!recipe) {
    return (
      <View style={styles.container}>
        <Text>Receta no encontrada</Text>
      </View>
    );
  }

  // Extraer ingredientes y medidas
  const ingredients = [];
  for (let i = 1; i <= 20; i++) {
    const ingredient = recipe[`strIngredient${i}`];
    const measure = recipe[`strMeasure${i}`];
    if (ingredient && ingredient.trim() !== '') {
      ingredients.push(`${ingredient} - ${measure}`);
    }
  }

  return (
    <ScrollView style={styles.container}>
      <Image source={{ uri: recipe.strMealThumb }} style={styles.image} />
      
      <View style={styles.header}>
        <Text style={styles.title}>{recipe.strMeal}</Text>
        <FavoriteButton 
          isFavorite={isFavorite} 
          onPress={() => isFavorite ? removeFavorite(recipe.idMeal) : addFavorite(recipe)} 
        />
      </View>
      
      <Text style={styles.sectionTitle}>Categoría: {recipe.strCategory}</Text>
      <Text style={styles.sectionTitle}>Área: {recipe.strArea}</Text>
      
      <Text style={styles.sectionTitle}>Ingredientes:</Text>
      {ingredients.map((ing, index) => (
        <Text key={index} style={styles.ingredient}>{ing}</Text>
      ))}
      
      <Text style={styles.sectionTitle}>Instrucciones:</Text>
      <Text style={styles.instructions}>{recipe.strInstructions}</Text>
      
      {recipe.strYoutube && (
        <Text 
          style={styles.youtubeLink}
          onPress={() => Linking.openURL(recipe.strYoutube)}>
          Ver en YouTube
        </Text>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 15,
    backgroundColor: '#fff',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: '100%',
    height: 300,
    borderRadius: 10,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 15,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    flex: 1,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 15,
    marginBottom: 5,
    color: '#333',
  },
  ingredient: {
    fontSize: 16,
    marginLeft: 10,
    marginBottom: 3,
  },
  instructions: {
    fontSize: 16,
    lineHeight: 24,
    marginBottom: 20,
  },
  youtubeLink: {
    color: 'red',
    fontSize: 16,
    marginTop: 10,
    textDecorationLine: 'underline',
  },
});

export default RecipeDetailScreen;