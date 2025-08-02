import React, { createContext, useState, useContext, ReactNode } from 'react';
import { Appearance } from 'react-native';

// Define la estructura de los colores para autocompletado
interface ThemeColors {
  background: string;
  text: string;
  primary: string;
  cellBorder: string;
  cellDefault: string;
  cellText: string;
  keyboardBg: string; // Color de fondo para el teclado
  keyDefault: string; // Color para teclas no usadas
  keyText: string; // Color para el texto de las teclas
}

// Define los colores para el modo claro
const lightColors: ThemeColors = {
  background: '#FFFFFF',
  text: '#333333',
  primary: '#4A90E2',
  cellBorder: '#D3D6DA',
  cellDefault: '#FFFFFF',
  cellText: '#333333',
  keyboardBg: '#DCDCDC',
  keyDefault: '#F8F8F8',
  keyText: '#000000',
};

// Define los colores para el modo oscuro
const darkColors: ThemeColors = {
  background: '#121213',
  text: '#FFFFFF',
  primary: '#4A90E2',
  cellBorder: '#3A3A3C',
  cellDefault: '#121213',
  cellText: '#FFFFFF',
  keyboardBg: '#121213',
  keyDefault: '#818384',
  keyText: '#FFFFFF',
};

interface ThemeContextType {
  theme: 'light' | 'dark';
  colors: ThemeColors;
  toggleTheme: () => void;
}

// Crea el contexto con un valor por defecto
const ThemeContext = createContext<ThemeContextType>({
  theme: 'light',
  colors: lightColors,
  toggleTheme: () => {},
});

// Crea el componente "Proveedor" que envolverá la app
export const ThemeProvider = ({ children }: { children: ReactNode }) => {
  // Detecta el tema del sistema para el estado inicial
  const systemTheme = Appearance.getColorScheme() || 'light';
  const [theme, setTheme] = useState<'light' | 'dark'>(systemTheme);

  const toggleTheme = () => {
    setTheme(prevTheme => (prevTheme === 'light' ? 'dark' : 'light'));
  };

  const colors = theme === 'light' ? lightColors : darkColors;

  return (
    <ThemeContext.Provider value={{ theme, colors, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

// Hook personalizado para usar el tema fácilmente en cualquier componente
export const useTheme = () => useContext(ThemeContext);