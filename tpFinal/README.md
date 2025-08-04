# PalabrAr - Juego de Palabras en Español

Una aplicación móvil inspirada en Wordle, desarrollada con React Native y Expo. Los jugadores deben adivinar una palabra de 5 letras en español en un máximo de 6 intentos.

## ✨ Características

* **Palabra del Día:** Un desafío diario con la misma palabra para todos los jugadores
* **Modo Libre:** Juega palabras aleatorias sin límite
* **Estadísticas:** Seguimiento de partidas jugadas, ganadas, rachas y distribución de intentos
* **Tema Claro/Oscuro:** Cambia entre modo claro y oscuro
* **Persistencia:** El progreso se guarda automáticamente usando AsyncStorage
* **Instrucciones:** Pantalla de ayuda con ejemplos visuales

## 🛠️ Tecnologías Utilizadas

* **Framework:** React Native con Expo SDK
* **Lenguaje:** TypeScript
* **Navegación:** Navegación por estados (sin router)
* **Almacenamiento:** AsyncStorage para persistencia local
* **Estilos:** StyleSheet de React Native con soporte para temas

## 📋 Requisitos Previos

Antes de comenzar, asegúrate de tener instalado:

* [Node.js](https://nodejs.org/) (versión 16 o superior)
* [npm](https://www.npmjs.com/) o [yarn](https://yarnpkg.com/)
* [Expo CLI](https://docs.expo.dev/get-started/installation/)
* La aplicación [Expo Go](https://expo.dev/client) en tu dispositivo móvil

### Instalación de Expo CLI

```bash
npm install -g @expo/cli
```

## 🚀 Instalación y Configuración

### 1. Clonar el Repositorio

```bash
git clone https://github.com/juanmasemper/AppMoviles.git
cd tpFinal
```

### 2. Instalar Dependencias

```bash
npm install
```

### 3. Iniciar la Aplicación

```bash
npx expo start
```

o

```bash
expo start
```

### 4. Ejecutar en Dispositivo

Después de ejecutar `expo start`, verás:

1. **Un código QR en la terminal**
2. **Una página web con opciones de desarrollo**

**Para dispositivos móviles:**
- **Android:** Escanea el código QR con la app Expo Go
- **iOS:** Escanea el código QR con la cámara del iPhone o con la app Expo Go

**Para emuladores:**
- Presiona `a` para abrir en emulador Android
- Presiona `i` para abrir en simulador iOS (solo en macOS)

## 📱 Dependencias Principales

```json
{
  "expo": "~51.0.28",
  "react": "18.2.0",
  "react-native": "0.74.5",
  "@react-native-async-storage/async-storage": "1.23.1",
  "expo-status-bar": "~1.12.1"
}
```

### Instalar Dependencias Específicas

Si necesitas instalar las dependencias una por una:

```bash
# Dependencias principales
npm install expo@~51.0.28
npm install react@18.2.0
npm install react-native@0.74.5

# AsyncStorage para persistencia
npm install @react-native-async-storage/async-storage@1.23.1

# StatusBar de Expo
npm install expo-status-bar@~1.12.1

# TypeScript (desarrollo)
npm install -D typescript@latest
npm install -D @types/react@latest
npm install -D @types/react-native@latest
```

## 🔧 Scripts Disponibles

```bash
# Iniciar en modo desarrollo
npm start
# o
npx expo start

# Limpiar caché y reiniciar
npx expo start --clear

# Construir para producción
npx expo build

# Exportar para web
npx expo export:web
```

## 🐛 Solución de Problemas

### Error de dependencias
```bash
# Limpiar node_modules y reinstalar
rm -rf node_modules
npm install
```

### Error de caché de Expo
```bash
# Limpiar caché de Expo
npx expo start --clear
```

### Problemas con AsyncStorage
```bash
# Reinstalar AsyncStorage
npm uninstall @react-native-async-storage/async-storage
npm install @react-native-async-storage/async-storage
```
