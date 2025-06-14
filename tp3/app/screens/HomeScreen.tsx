import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Alert,
  SafeAreaView,
  FlatList,
  Button,
} from 'react-native';
import SearchBar from '../components/SearchBar';
import { searchRecipesByName, Meal } from '../services/RecipeApi';
import RecipeCard from '../components/RecipeCard';
import { useRouter } from 'expo-router';
import { useThemeContext } from '../../hooks/ThemeContext';

const HomeScreen = () => {
  const [recipes, setRecipes] = useState<Meal[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const { theme, toggleTheme } = useThemeContext();
  const isDark = theme === 'dark';

  const handleRecipeSearch = async (query: string) => {
    if (!query.trim()) {
      setRecipes([]);
      return;
    }
    setIsLoading(true);
    setError(null);
    try {
      const results = await searchRecipesByName(query);
      setRecipes(results);
      if (results.length === 0) {
        Alert.alert('Sin resultados', 'No se encontraron recetas para tu búsqueda.');
      }
    } catch (err) {
      setError('Error al buscar recetas. Intenta de nuevo.');
      Alert.alert('Error', 'No se pudieron cargar las recetas.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRecipePress = (recipe: Meal) => {
    if (recipe && recipe.idMeal) {
      router.push({
        pathname: '/recipe/[id]',
        params: { id: recipe.idMeal },
      });
    } else {
      console.error('Error: recipe.idMeal es undefined o inválido.', recipe);
      Alert.alert(
        'Error de Navegación',
        'No se pudo obtener el ID de la receta para navegar.'
      );
    }
  };

  return (
    <SafeAreaView
      style={[
        styles.safeArea,
        { backgroundColor: isDark ? '#121212' : '#f8f8f8' },
      ]}
    >
      <View style={styles.container}>
        <Text style={[styles.title, { color: isDark ? '#fff' : '#000' }]}>
          App de recetas
        </Text>

        <Button
          title={`Cambiar a modo ${isDark ? 'claro ☀️' : 'oscuro 🌙'}`}
          onPress={toggleTheme}
          color={isDark ? '#bb86fc' : '#6200ee'}
        />

        <SearchBar onSearch={handleRecipeSearch} placeholder="Buscar por nombre" />

        {isLoading && (
          <Text style={[styles.loadingText, { color: isDark ? '#ccc' : '#333' }]}>
            Buscando...
          </Text>
        )}
        {error && (
          <Text style={[styles.errorText, { color: 'red' }]}>{error}</Text>
        )}

        <FlatList
          data={recipes}
          keyExtractor={(item) => item.idMeal}
          renderItem={({ item }) => (
            <RecipeCard recipe={item} onPress={() => handleRecipePress(item)} />
          )}
          ListEmptyComponent={() =>
            !isLoading && recipes.length === 0 && !error ? (
              <Text
                style={[styles.emptyText, { color: isDark ? '#aaa' : '#666' }]}
              >
                Ingresa un término para buscar recetas.
              </Text>
            ) : null
          }
          style={styles.list}
          contentContainerStyle={styles.listContentContainer}
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  container: {
    flex: 1,
    paddingTop: 50,
    paddingHorizontal: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    marginTop: 20,
  },
  loadingText: {
    textAlign: 'center',
    marginTop: 20,
    fontSize: 16,
  },
  errorText: {
    marginTop: 10,
    textAlign: 'center',
    marginHorizontal: 20,
  },
  list: {
    width: '100%',
  },
  listContentContainer: {
    paddingBottom: 20,
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 50,
    fontSize: 16,
  },
});

export default HomeScreen;
