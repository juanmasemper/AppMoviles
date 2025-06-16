import React, { useState } from 'react';
import { View, Text, TextInput, Button, FlatList, StyleSheet, SafeAreaView, TouchableOpacity, Alert } from 'react-native';
import { useIngredients } from '../context/IngredientsContext'; // Asegúrate de que la ruta sea correcta
import { useThemeContext } from '../../hooks/ThemeContext'; // Asegúrate de que la ruta sea correcta
import { Ionicons } from '@expo/vector-icons';

export default function IngredientsScreen() {
  const { ingredients, addIngredient, removeIngredient } = useIngredients();
  const [inputValue, setInputValue] = useState('');
  const { theme } = useThemeContext();
  const isDark = theme === 'dark';

  const handleAddIngredient = () => {
    if (inputValue.trim()) {
      addIngredient(inputValue.trim());
      setInputValue('');
    } else {
      Alert.alert("Inválido", "Por favor, ingresa un nombre para el ingrediente.");
    }
  };

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: isDark ? '#121212' : '#f8f8f8' }]}>
      <View style={styles.container}>
        <Text style={[styles.title, { color: isDark ? '#fff' : '#333' }]}>Mi Despensa</Text>
        <Text style={[styles.subtitle, { color: isDark ? '#ccc' : '#666' }]}>
          Añade los ingredientes que tienes en casa.
        </Text>

        <View style={styles.inputContainer}>
          <TextInput
            style={[styles.input, { 
              backgroundColor: isDark ? '#2c2c2c' : '#f0f0f0', 
              color: isDark ? '#fff' : '#000',
              borderColor: isDark ? '#444' : '#ccc'
            }]}
            placeholder="Ej: Pollo, arroz, tomate..."
            placeholderTextColor={isDark ? '#aaa' : '#666'}
            value={inputValue}
            onChangeText={setInputValue}
          />
          <Button title="Añadir" onPress={handleAddIngredient} color={isDark ? '#bb86fc' : '#6200ee'} />
        </View>

        <FlatList
          data={ingredients}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View style={[styles.ingredientItem, { backgroundColor: isDark ? '#1e1e1e' : '#fff' }]}>
              <Text style={[styles.ingredientText, { color: isDark ? '#ddd' : '#333' }]}>{item.name}</Text>
              {/* --- CAMBIO REALIZADO AQUÍ --- */}
              {/* Ahora pasamos el objeto 'item' completo a la función para poder eliminarlo de Firestore */}
              <TouchableOpacity onPress={() => removeIngredient(item)}>
                <Ionicons name="trash-bin-outline" size={24} color="#ff6b6b" />
              </TouchableOpacity>
            </View>
          )}
          ListEmptyComponent={
            <Text style={[styles.emptyText, { color: isDark ? '#aaa' : '#666' }]}>
              Tu despensa está vacía. Inicia sesión y añade ingredientes.
            </Text>
          }
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: { flex: 1 },
  container: { flex: 1, padding: 20, paddingTop: 50 },
  title: { fontSize: 28, fontWeight: 'bold', textAlign: 'center', marginBottom: 10 },
  subtitle: { fontSize: 16, textAlign: 'center', marginBottom: 20 },
  inputContainer: { flexDirection: 'row', marginBottom: 20, alignItems: 'center' },
  input: { flex: 1, borderWidth: 1, padding: 10, borderRadius: 8, marginRight: 10 },
  ingredientItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
    backgroundColor: '#fff',
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 2,
    shadowOffset: { width: 0, height: 1 },
  },
  ingredientText: { fontSize: 18 },
  emptyText: { textAlign: 'center', marginTop: 50, fontSize: 16, fontStyle: 'italic' },
});
