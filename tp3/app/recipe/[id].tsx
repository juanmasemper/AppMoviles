import React, { useEffect, useState, useLayoutEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  ActivityIndicator,
  Alert,
  TouchableOpacity,
  Linking,
} from 'react-native';
import { useLocalSearchParams, Stack, useNavigation } from 'expo-router';
import { getRecipeDetailsById, Meal } from '../services/RecipeApi';
import { Ionicons } from '@expo/vector-icons';
import { useThemeContext } from '../../hooks/ThemeContext';
import FavoriteButton from '../components/FavoriteButton';

const RecipeDetailScreen = () => {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [recipe, setRecipe] = useState<Meal | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const { theme } = useThemeContext();
  const isDark = theme === 'dark';
  const navigation = useNavigation();

  useLayoutEffect(() => {
    navigation.setOptions({
      title: isLoading ? 'Cargando...' : (recipe?.strMeal || 'Detalle de Receta'),
      headerBackTitle: 'Volver',
      headerStyle: { backgroundColor: isDark ? '#121212' : '#fff' },
      headerTintColor: isDark ? '#fff' : '#000',
    });
  }, [navigation, isLoading, recipe?.strMeal, isDark]);

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
      <View style={[styles.centered, { backgroundColor: isDark ? '#121212' : '#fff' }]}>
        <ActivityIndicator size="large" color="#007bff" />
        <Text style={{ color: isDark ? '#fff' : '#000' }}>Cargando detalles...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={[styles.centered, { backgroundColor: isDark ? '#121212' : '#fff' }]}>
        <Text style={[styles.errorText, { color: 'red' }]}>{error}</Text>
      </View>
    );
  }

  if (!recipe) {
    return (
      <View style={[styles.centered, { backgroundColor: isDark ? '#121212' : '#fff' }]}>
        <Text style={{ color: isDark ? '#fff' : '#000' }}>No hay información de la receta disponible.</Text>
      </View>
    );
  }

  const renderIngredients = () => {
    const ingredients = [];
    for (let i = 1; i <= 20; i++) {
      const ingredient = recipe[`strIngredient${i}` as keyof Meal] as string;
      const measure = recipe[`strMeasure${i}` as keyof Meal] as string;
      if (ingredient && ingredient.trim() !== '') {
        ingredients.push(
          <Text key={i} style={[styles.ingredient, { color: isDark ? '#ddd' : '#333' }]}>
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
          title: isLoading ? 'Cargando...' : (recipe?.strMeal || 'Detalle de Receta'),
          headerBackTitle: 'Volver',
          headerStyle: { backgroundColor: isDark ? '#121212' : '#fff' },
          headerTintColor: isDark ? '#fff' : '#000',
        }}
      />

      <ScrollView
        style={[styles.container, { backgroundColor: isDark ? '#121212' : '#fff' }]}
        contentContainerStyle={styles.contentContainer}
      >
        <Image source={{ uri: recipe.strMealThumb }} style={styles.image} />

        <View style={styles.titleContainer}>
          <View style={styles.placeholderButton} />
          <View style={styles.titleWrapper}>
            <Text style={[styles.title, { color: isDark ? '#fff' : '#333' }]}>
          {recipe.strMeal}
        </Text>
          </View>
          <View style={styles.favoriteButtonContainer}>
            <FavoriteButton recipe={recipe} size={28} />
          </View>
        </View>

        {recipe.strCategory && (
          <Text style={[styles.subtitle, { color: isDark ? '#ccc' : '#555' }]}>
            Categoría: {recipe.strCategory}
          </Text>
        )}
        {recipe.strArea && (
          <Text style={[styles.subtitle, { color: isDark ? '#ccc' : '#555' }]}>
            Origen: {recipe.strArea}
          </Text>
        )}

        <Text style={[styles.sectionTitle, { color: isDark ? '#fff' : '#444', borderBottomColor: isDark ? '#444' : '#eee' }]}>
          Ingredientes:
        </Text>
        {renderIngredients()}

        <Text style={[styles.sectionTitle, { color: isDark ? '#fff' : '#444', borderBottomColor: isDark ? '#444' : '#eee' }]}>
          Instrucciones:
        </Text>
        <Text style={[styles.instructions, { color: isDark ? '#ddd' : '#333' }]}>
          {recipe.strInstructions}
        </Text>

        {recipe.strYoutube && (
          <TouchableOpacity
            style={[
              styles.youtubeButton,
              { backgroundColor: isDark ? '#cc0000' : '#FF0000' },
            ]}
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
    marginBottom: 8,
    textAlign: 'center',
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 20,
    marginBottom: 10,
    borderBottomWidth: 1,
    paddingBottom: 5,
  },
  instructions: {
    fontSize: 16,
    lineHeight: 24,
    textAlign: 'justify',
  },
  ingredient: {
    fontSize: 16,
    lineHeight: 22,
    marginLeft: 10,
  },
  errorText: {
    fontSize: 16,
    textAlign: 'center',
  },
  youtubeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
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
