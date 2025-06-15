import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Image, ActivityIndicator, Alert, TouchableOpacity, Linking } from 'react-native';
import { useLocalSearchParams, Stack } from 'expo-router';
import { getRecipeDetailsById, Meal } from '../services/RecipeApi';
import { Ionicons } from '@expo/vector-icons';
import FavoriteButton from '../components/FavoriteButton';

const RecipeDetailScreen = () => {
  const { id } = useLocalSearchParams<{ id: string }>(); 
  const [recipe, setRecipe] = useState<Meal | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (id) {
      const fetchRecipeDetails = async () => {
        setIsLoading(true);
        setError(null);
        try {
          const details = await getRecipeDetailsById(id);
          if (details) {
            setRecipe(details);
          } else {
            setError('No se encontraron detalles para esta receta.');
            Alert.alert('Error', 'No se encontraron detalles para esta receta.');
          }
        } catch (err) {
          console.error(err);
          setError('Error al cargar los detalles de la receta.');
          Alert.alert('Error', 'No se pudieron cargar los detalles de la receta.');
        } finally {
          setIsLoading(false);
        }
      };
      fetchRecipeDetails();
    } else {
      setError('ID de receta no proporcionado.');
      setIsLoading(false);
    }
  }, [id]);

  if (isLoading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#007bff" />
        <Text>Cargando detalles...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centered}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  if (!recipe) {
    return (
      <View style={styles.centered}>
        <Text>No hay información de la receta disponible.</Text>
      </View>
    );
  }

  const renderIngredients = () => {
    const ingredients = [];
    for (let i = 1; i <= 20; i++) {
      const ingredient = recipe[`strIngredient${i}` as keyof Meal] as string;
      const measure = recipe[`strMeasure${i}` as keyof Meal] as string;
      if (ingredient && ingredient.trim() !== "") {
        ingredients.push(
          <Text key={i} style={styles.ingredient}>
            - {ingredient} ({measure})
          </Text>
        );
      }
    }
    return ingredients;
  };


  return (
    <>
      <Stack.Screen 
        options={{ 
          title: recipe.strMeal || 'Detalle de Receta',
        }} 
      />
      <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
        <Image source={{ uri: recipe.strMealThumb }} style={styles.image} />

        <View style={styles.titleContainer}>
          <View style={styles.placeholderButton} />
          <View style={styles.titleWrapper}>
            <Text style={styles.title}>{recipe.strMeal}</Text>
          </View>
          <View style={styles.favoriteButtonContainer}>
            <FavoriteButton recipe={recipe} size={28} />
          </View>
        </View>

        {recipe.strCategory && <Text style={styles.subtitle}>Categoría: {recipe.strCategory}</Text>}
        {recipe.strArea && <Text style={styles.subtitle}>Origen: {recipe.strArea}</Text>}

        <Text style={styles.sectionTitle}>Ingredientes:</Text>
        {renderIngredients()}

        <Text style={styles.sectionTitle}>Instrucciones:</Text>
        <Text style={styles.instructions}>{recipe.strInstructions}</Text>

        {recipe.strYoutube && (
          <TouchableOpacity
            style={styles.youtubeButton}
            onPress={() => Linking.openURL(recipe.strYoutube!)}
          >
            <Ionicons name="logo-youtube" size={24} color="white" style={styles.youtubeIcon} />
            <Text style={styles.youtubeButtonText}>Ver en YouTube</Text>
          </TouchableOpacity>
        )}

      </ScrollView>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  contentContainer: {
    padding: 20,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  image: {
    width: '100%',
    height: 250,
    borderRadius: 12,
    marginBottom: 20,
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
    paddingHorizontal: 5,
  },
  placeholderButton: {
    width: 44,
    height: 44,
  },
  titleWrapper: {
    flex: 1,
    alignItems: 'center',
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
  },
  favoriteButtonContainer: {
    width: 44,
    height: 44,
    justifyContent: 'center',
    alignItems: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#555',
    marginBottom: 8,
    textAlign: 'center',
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 20,
    marginBottom: 10,
    color: '#444',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    paddingBottom: 5,
  },
  instructions: {
    fontSize: 16,
    lineHeight: 24,
    color: '#333',
    textAlign: 'justify',
  },
  ingredient: {
    fontSize: 16,
    lineHeight: 22,
    color: '#333',
    marginLeft: 10,
  },
  errorText: {
    color: 'red',
    fontSize: 16,
    textAlign: 'center',
  },
    youtubeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FF0000', 
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    marginTop: 20,
    elevation: 2, 
    shadowColor: '#000', 
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
  },
  youtubeIcon: {
    marginRight: 10,
  },
  youtubeButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default RecipeDetailScreen;