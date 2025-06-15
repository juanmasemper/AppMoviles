import React from 'react';
import { View, Text, StyleSheet, FlatList, SafeAreaView } from 'react-native';
import { useFavorites } from '../context/FavoritesContext';
import { useThemeContext } from '../../hooks/ThemeContext';
import RecipeCard from '../components/RecipeCard';
import { useRouter } from 'expo-router';
import { Meal } from '../services/RecipeApi';

const FavoritesScreen = () => {
  const { favorites } = useFavorites();
  const { theme } = useThemeContext();
  const isDark = theme === 'dark';
  const router = useRouter();

  const handleRecipePress = (recipe: Meal) => {
    if (recipe && recipe.idMeal) {
      router.push({
        pathname: "/recipe/[id]",
        params: { id: recipe.idMeal },
      });
    }
  };

  const renderEmptyState = () => (
    <View style={styles.emptyContainer}>
      <Text style={[styles.emptyTitle, { color: isDark ? '#fff' : '#666' }]}>
        No tienes favoritos aún
      </Text>
      <Text style={[styles.emptySubtitle, { color: isDark ? '#ccc' : '#888' }]}>
        Explora recetas y agrega tus favoritas tocando el corazón ❤️
      </Text>
    </View>
  );

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: isDark ? '#121212' : '#f8f8f8' }]}>
      <View style={styles.container}>
        <Text style={[styles.title, { color: isDark ? '#fff' : '#333' }]}>
          Mis Favoritos
        </Text>
        
        <FlatList
          data={favorites}
          keyExtractor={(item) => item.idMeal}
          renderItem={({ item }) => (
            <RecipeCard 
              recipe={item} 
              onPress={() => handleRecipePress(item)} 
            />
          )}
          ListEmptyComponent={renderEmptyState}
          style={styles.list}
          contentContainerStyle={[
            styles.listContentContainer,
            favorites.length === 0 && styles.emptyListContainer
          ]}
          showsVerticalScrollIndicator={false}
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
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    marginTop: 20,
  },
  list: {
    flex: 1,
  },
  listContentContainer: {
    paddingBottom: 20,
  },
  emptyListContainer: {
    flexGrow: 1,
    justifyContent: 'center',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  emptyTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
  },
  emptySubtitle: {
    fontSize: 16,
    textAlign: 'center',
    lineHeight: 24,
  },
});

export default FavoritesScreen;