import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, FlatList, TouchableOpacity, Alert } from 'react-native';
import { useAppContext } from '../context/AppContext';
import { Ionicons } from '@expo/vector-icons';
import { searchRecipesByIngredient } from '../services/RecipeApi';
import RecipeCard from '../components/RecipeCard';
import { useRouter } from 'expo-router';

const IngredientsScreen = () => {
  const { availableIngredients, addIngredient, removeIngredient } = useAppContext();
  const [newIngredient, setNewIngredient] = useState('');
  const [ingredientRecipes, setIngredientRecipes] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleAddIngredient = () => {
    if (newIngredient.trim() === '') {
      Alert.alert('Error', 'Por favor ingresa un ingrediente');
      return;
    }
    addIngredient(newIngredient.trim());
    setNewIngredient('');
  };

  const handleSearchByIngredient = async (ingredient: string) => {
    setLoading(true);
    try {
      const recipes = await searchRecipesByIngredient(ingredient);
      setIngredientRecipes(recipes);
      if (recipes.length === 0) {
        Alert.alert('Sin resultados', `No se encontraron recetas con ${ingredient}`);
      }
    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'No se pudieron cargar las recetas');
    } finally {
      setLoading(false);
    }
  };

  const handleRecipePress = (recipe: any) => {
    router.push({ pathname: "/recipe/[id]", params: { id: recipe.idMeal } });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Ingredientes Disponibles</Text>
      
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Agregar ingrediente (ej: pollo)"
          value={newIngredient}
          onChangeText={setNewIngredient}
          onSubmitEditing={handleAddIngredient}
        />
        <TouchableOpacity onPress={handleAddIngredient} style={styles.addButton}>
          <Ionicons name="add" size={24} color="white" />
        </TouchableOpacity>
      </View>

      {availableIngredients.length > 0 && (
        <>
          <Text style={styles.subtitle}>Tus ingredientes:</Text>
          <View style={styles.ingredientsContainer}>
            {availableIngredients.map((ingredient, index) => (
              <TouchableOpacity 
                key={index} 
                style={styles.ingredientPill}
                onPress={() => handleSearchByIngredient(ingredient)}
              >
                <Text style={styles.ingredientText}>{ingredient}</Text>
                <TouchableOpacity 
                  onPress={() => removeIngredient(ingredient)}
                  style={styles.removeButton}
                >
                  <Ionicons name="close" size={16} color="#ff4444" />
                </TouchableOpacity>
              </TouchableOpacity>
            ))}
          </View>
        </>
      )}

      {loading && <Text style={styles.loadingText}>Buscando recetas...</Text>}
      
      {ingredientRecipes.length > 0 && (
        <>
          <Text style={styles.subtitle}>Recetas con estos ingredientes:</Text>
          <FlatList
            data={ingredientRecipes}
            keyExtractor={(item) => item.idMeal}
            renderItem={({ item }) => (
              <RecipeCard recipe={item} onPress={() => handleRecipePress(item)} />
            )}
            contentContainerStyle={styles.listContent}
          />
        </>
      )}

      {availableIngredients.length === 0 && !loading && ingredientRecipes.length === 0 && (
        <Text style={styles.emptyText}>
          Agrega ingredientes que tengas disponibles para buscar recetas
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f8f8f8',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginVertical: 10,
    color: '#333',
  },
  inputContainer: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  input: {
    flex: 1,
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
    backgroundColor: 'white',
  },
  addButton: {
    backgroundColor: '#4CAF50',
    borderRadius: 8,
    padding: 8,
    marginLeft: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  ingredientsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 20,
  },
  ingredientPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#e0e0e0',
    borderRadius: 20,
    paddingVertical: 6,
    paddingHorizontal: 12,
    margin: 4,
  },
  ingredientText: {
    marginRight: 5,
  },
  removeButton: {
    marginLeft: 5,
  },
  listContent: {
    paddingBottom: 20,
  },
  loadingText: {
    textAlign: 'center',
    marginVertical: 10,
    fontStyle: 'italic',
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 50,
    fontSize: 16,
    color: '#666',
  },
});

export default IngredientsScreen;