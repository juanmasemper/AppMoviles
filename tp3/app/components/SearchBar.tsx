import React, { useState } from 'react';
import {
  View,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Keyboard,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useThemeContext } from '../../hooks/ThemeContext';

interface SearchBarProps {
  onSearch: (query: string) => void;
  placeholder?: string;
}

const SearchBar: React.FC<SearchBarProps> = ({ onSearch, placeholder }) => {
  const [query, setQuery] = useState('');
  const { theme } = useThemeContext();
  const isDark = theme === 'dark';

  const handleSearch = () => {
    Keyboard.dismiss();
    onSearch(query);
  };

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: isDark ? '#2c2c2c' : '#f0f0f0' },
      ]}
    >
      <TextInput
        style={[
          styles.input,
          {
            color: isDark ? '#fff' : '#333',
          },
        ]}
        placeholder={placeholder || 'Buscar...'}
        placeholderTextColor={isDark ? '#aaa' : '#555'}
        value={query}
        onChangeText={setQuery}
        onSubmitEditing={handleSearch}
        returnKeyType="search"
      />
      <TouchableOpacity onPress={handleSearch} style={styles.iconContainer}>
        <Ionicons name="search" size={20} color={isDark ? '#ccc' : '#555'} />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 25,
    paddingHorizontal: 15,
    paddingVertical: 8,
    marginHorizontal: 15,
    marginVertical: 10,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
  },
  input: {
    flex: 1,
    fontSize: 16,
    marginLeft: 8,
  },
  iconContainer: {
    padding: 5,
  },
});

export default SearchBar;
