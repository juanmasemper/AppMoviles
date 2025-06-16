# App de Recetas con Expo y Firebase

Esta es una aplicación móvil de recetas desarrollada con Expo y React Native. Permite a los usuarios buscar recetas de cocina, ver sus detalles, guardarlas como favoritas y gestionar una lista personal de ingredientes en su despensa.

## ✨ Características Principales

* **Búsqueda Dual:** Búsqueda de recetas por **Nombre** o por **Ingrediente** utilizando la API externa [TheMealDB](https://www.themealdb.com/api.php).
* **Detalle de Receta:** Vista completa con imagen, categoría, origen, lista de ingredientes con medidas, instrucciones paso a paso y un enlace directo a un video de YouTube (si está disponible).
* **Autenticación de Usuarios:** Sistema completo de **Registro** e **Inicio de Sesión** utilizando el servicio de **Firebase Authentication**.
* **Sistema de Favoritos:** Los usuarios pueden marcar y desmarcar recetas como favoritas. La lista de favoritos es **persistente por usuario** y se almacena en la nube con **Cloud Firestore**.
* **Mi Despensa:** Funcionalidad que permite a los usuarios guardar una lista de los ingredientes que tienen. Esta lista también es **persistente por usuario** y se guarda en Cloud Firestore.
* **Tema Claro y Oscuro:** La aplicación cuenta con un interruptor para cambiar entre modo claro y oscuro, adaptando toda la interfaz.
* **Navegación Moderna:** Utiliza **Expo Router** para una navegación basada en la estructura de archivos del proyecto.
* **Menú de Configuración:** Un menú desplegable intuitivo para acceder a las opciones de cambio de tema y cierre de sesión.

## 🛠️ Tecnologías Utilizadas

* **Framework:** React Native con Expo SDK
* **Lenguaje:** TypeScript
* **Navegación:** Expo Router
* **Backend como Servicio (BaaS):** Firebase
    * **Autenticación:** Firebase Authentication (Email/Contraseña)
    * **Base de Datos:** Cloud Firestore
* **Estilos:** StyleSheet de React Native

## 🚀 Cómo Empezar

Sigue estos pasos para levantar el proyecto en tu entorno de desarrollo.



### 1. Instalación de Dependencias

Para instalar las dependencias del proyecto, debes ingresar el siguiente comando en la terminal de powershell

```bash
npm install
```

### 2. Iniciar la Aplicación

Ejecuta el siguiente comando para iniciar el servidor de desarrollo de Expo.

```bash
npx expo start
```

En la terminal, encontrarás un código QR para escanear con la aplicación **Expo Go** en tu dispositivo móvil (Android o iOS) y así abrir el proyecto.
