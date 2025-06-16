import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Alert,
  SafeAreaView,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  Modal,
  Pressable
} from 'react-native';
import SearchBar from '../components/SearchBar';
import { searchRecipesByName, searchRecipesByIngredient, Meal } from '../services/RecipeApi';
import RecipeCard from '../components/RecipeCard';
import { useRouter } from 'expo-router'; 
import { useThemeContext } from '../../hooks/ThemeContext';
import { useAuth } from '../context/AuthContext'; 
import { signOut } from 'firebase/auth'; 
import { auth } from '../../config/firebase';
import { Ionicons } from '@expo/vector-icons';

export default function HomeScreen() { 
  const [recipes, setRecipes] = useState<Meal[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchType, setSearchType] = useState<'name' | 'ingredient'>('name');
  const [isSettingsVisible, setSettingsVisible] = useState(false);
  
  // --- NUEVO: Refs y Estado para la posición del menú ---
  const settingsIconRef = useRef(null);
  const [menuPosition, setMenuPosition] = useState({ top: 0, left: 0 });

  const router = useRouter();
  const { theme, toggleTheme } = useThemeContext();
  const isDark = theme === 'dark';
  const { user } = useAuth();

  const getActiveSearchTypeStyle = (isActive: boolean) => {
    if (!isActive) return {};
    return { backgroundColor: isDark ? '#bb86fc' : '#6200ee' };
  };

  const handleRecipeSearch = async (query: string) => {
    if (!query.trim()) { setRecipes([]); return; }
    setIsLoading(true);
    setError(null);
    try {
      const results = searchType === 'name' 
        ? await searchRecipesByName(query) 
        : await searchRecipesByIngredient(query);
      setRecipes(results);
      if (results.length === 0) { Alert.alert('Sin resultados', `No se encontraron recetas.`); }
    } catch (err) {
      setError('Error al buscar recetas.');
      Alert.alert('Error', 'No se pudieron cargar las recetas.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRecipePress = (recipe: Meal) => {
    router.push(`/recipe/${recipe.idMeal}`);
  };

  const handleLogout = () => {
    signOut(auth);
    setSettingsVisible(false);
  };
  
  const openSettingsMenu = () => {
    if (settingsIconRef.current) {
      (settingsIconRef.current as any).measure((fx: number, fy: number, width: number, height: number, px: number, py: number) => {
        // Posiciona el menú debajo del ícono
        setMenuPosition({ top: py + height, left: px });
        setSettingsVisible(true);
      });
    }
  };

  const SearchTypeSelector = () => (
    <View style={styles.searchTypeContainer}>
      <TouchableOpacity
        style={[styles.searchTypeButton, getActiveSearchTypeStyle(searchType === 'name')]}
        onPress={() => setSearchType('name')}
      >
        <Text style={[styles.searchTypeText, searchType === 'name' && { color: '#fff' }]}>Por Nombre</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[styles.searchTypeButton, getActiveSearchTypeStyle(searchType === 'ingredient')]}
        onPress={() => setSearchType('ingredient')}
      >
        <Text style={[styles.searchTypeText, searchType === 'ingredient' && { color: '#fff' }]}>Por Ingrediente</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: isDark ? '#121212' : '#f8f8f8' }]}>
      
      {/* --- MODIFICADO: Modal ahora es un Popover --- */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={isSettingsVisible}
        onRequestClose={() => setSettingsVisible(false)}
      >
        <Pressable style={styles.modalOverlay} onPress={() => setSettingsVisible(false)}>
          {/* El contenido del modal ahora se posiciona de forma absoluta */}
          <View style={[
            styles.popoverContent,
            { 
              backgroundColor: isDark ? '#2c2c2c' : '#fff',
              top: menuPosition.top,
              left: menuPosition.left,
            }
          ]}>
            <TouchableOpacity style={styles.modalOption} onPress={() => { toggleTheme(); setSettingsVisible(false); }}>
              <Ionicons name={isDark ? 'sunny-outline' : 'moon-outline'} size={22} color={isDark ? '#bb86fc' : '#6200ee'} />
              <Text style={[styles.modalOptionText, { color: isDark ? '#fff' : '#333' }]}>
                Modo {isDark ? 'Claro' : 'Oscuro'}
              </Text>
            </TouchableOpacity>

            {/* La opción cambia dependiendo si el usuario está logueado o no */}
            {user ? (
              <TouchableOpacity style={styles.modalOption} onPress={handleLogout}>
                <Ionicons name="log-out-outline" size={22} color="#ff6b6b" />
                <Text style={[styles.modalOptionText, { color: '#ff6b6b' }]}>Cerrar Sesión</Text>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity style={styles.modalOption} onPress={() => { setSettingsVisible(false); router.push('/login' as any); }}>
                <Ionicons name="log-in-outline" size={22} color={isDark ? '#fff' : '#333'} />
                <Text style={[styles.modalOptionText, { color: isDark ? '#fff' : '#333' }]}>Iniciar Sesión</Text>
              </TouchableOpacity>
            )}
          </View>
        </Pressable>
      </Modal>

      <View style={styles.headerContainer}>
        {/* El ícono ahora tiene una ref y llama a la nueva función */}
        <TouchableOpacity ref={settingsIconRef} style={styles.settingsIcon} onPress={openSettingsMenu}>
          <Ionicons name="settings-outline" size={28} color={isDark ? '#fff' : '#000'} />
        </TouchableOpacity>
        <Text style={[styles.title, { color: isDark ? '#fff' : '#000' }]}>App de recetas</Text>
        <View style={styles.placeholderIcon} />
      </View>
      
      <View style={styles.container}>
        <SearchTypeSelector />
        <SearchBar onSearch={handleRecipeSearch} placeholder={`Buscar por ${searchType === 'name' ? 'nombre' : 'ingrediente'}`} />
        
        {isLoading && <ActivityIndicator size="large" color={isDark ? '#bb86fc' : '#6200ee'} style={{ marginTop: 20 }} />}
        
        <FlatList
          data={recipes}
          keyExtractor={(item) => item.idMeal}
          renderItem={({ item }) => (
            <RecipeCard recipe={item} onPress={() => handleRecipePress(item)} />
          )}
          style={styles.list}
          ListEmptyComponent={
            <Text style={{ textAlign: 'center', marginTop: 40, color: isDark ? '#888' : '#666' }}>
              Ingresa un término para buscar recetas.
            </Text>
          }
        />
      </View>
    </SafeAreaView>
  );
};

// --- ESTILOS ACTUALIZADOS ---
const styles = StyleSheet.create({
  safeArea: { flex: 1 },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 15,
    paddingTop: 50,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.05)',
  },
  settingsIcon: { padding: 5 },
  placeholderIcon: { width: 38 },
  title: { fontSize: 24, fontWeight: 'bold' },
  container: { flex: 1, paddingHorizontal: 16 },
  searchTypeContainer: { flexDirection: 'row', justifyContent: 'center', marginVertical: 10, backgroundColor: '#e0e0e030', borderRadius: 20, alignSelf: 'center' },
  searchTypeButton: { paddingVertical: 10, paddingHorizontal: 20, borderRadius: 20 },
  searchTypeText: { fontWeight: 'bold' },
  list: { width: '100%' },
  // Estilos para el Popover
  modalOverlay: { flex: 1 },
  popoverContent: {
    position: 'absolute',
    borderRadius: 8,
    padding: 10,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  modalOption: { flexDirection: 'row', alignItems: 'center', paddingVertical: 10, paddingHorizontal: 5 },
  modalOptionText: { fontSize: 16, marginLeft: 10 },
});
