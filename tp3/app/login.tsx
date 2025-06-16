import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, SafeAreaView, Alert, KeyboardAvoidingView, Platform } from 'react-native';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../config/firebase';
import { useNavigation } from 'expo-router';
import { useThemeContext } from '../hooks/ThemeContext'; 

const LoginScreen = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLogin, setIsLogin] = useState(true);
    const navigation = useNavigation();
    
    const { theme } = useThemeContext();
    const isDark = theme === 'dark';

    const containerStyle = {
        backgroundColor: isDark ? '#121212' : '#f8f8f8',
    };
    const cardStyle = {
        backgroundColor: isDark ? '#1e1e1e' : '#fff',
    };
    const titleStyle = {
        color: isDark ? '#ffffff' : '#222',
    };
    const subtitleStyle = {
        color: isDark ? '#e0e0e0' : '#333',
    };
    const inputStyle = {
        backgroundColor: isDark ? '#2c2c2c' : '#f0f0f0',
        color: isDark ? '#fff' : '#000',
        borderColor: isDark ? '#444' : '#ccc',
    };
    const toggleTextStyle = {
        color: isDark ? '#bb86fc' : '#6200ee',
    };


    const handleAuthentication = async () => {
        if (!email || !password) {
            Alert.alert("Campos vacíos", "Por favor, ingresa tu email y contraseña.");
            return;
        }
        try {
            if (isLogin) {
                await signInWithEmailAndPassword(auth, email, password);
                Alert.alert("¡Bienvenido/a!", "Inicio de sesión correcto.");
            } else {
                await createUserWithEmailAndPassword(auth, email, password);
                Alert.alert("¡Cuenta Creada!", "Usuario registrado correctamente.");
            }
            if (navigation.canGoBack()) {
                navigation.goBack();
            }
        } catch (error: any) {
            console.log("Firebase auth error:", error.code, error.message);
            let friendlyMessage = "Ocurrió un error. Inténtalo de nuevo.";
            if (error.code === 'auth/user-not-found' || error.code === 'auth/wrong-password') {
                friendlyMessage = "Email o contraseña incorrectos.";
            } else if (error.code === 'auth/email-already-in-use') {
                friendlyMessage = "Este correo electrónico ya está registrado.";
            } else if (error.code === 'auth/weak-password') {
                friendlyMessage = "La contraseña debe tener al menos 6 caracteres.";
            }
            Alert.alert("Error de autenticación", friendlyMessage);
        }
    };

    return (
        <SafeAreaView style={[styles.container, containerStyle]}>
            <KeyboardAvoidingView 
                behavior={Platform.OS === "ios" ? "padding" : "height"}
                style={styles.keyboardAvoidingContainer}
            >
                <View style={[styles.card, cardStyle]}>
                    <Text style={[styles.mainTitle, titleStyle]}>Bienvenido/a a la app de Recetas JAFL</Text>
                    <Text style={[styles.subtitle, subtitleStyle]}>{isLogin ? 'Iniciar Sesión' : 'Crear una Cuenta'}</Text>
                    
                    <TextInput
                        style={[styles.input, inputStyle]}
                        placeholder="Email"
                        placeholderTextColor={isDark ? '#aaa' : '#666'}
                        value={email}
                        onChangeText={setEmail}
                        keyboardType="email-address"
                        autoCapitalize="none"
                    />
                    <TextInput
                        style={[styles.input, inputStyle]}
                        placeholder="Contraseña"
                        placeholderTextColor={isDark ? '#aaa' : '#666'}
                        value={password}
                        onChangeText={setPassword}
                        secureTextEntry
                    />
                    
                    <View style={styles.buttonContainer}>
                      <Button 
                          title={isLogin ? 'Entrar' : 'Crear cuenta'} 
                          onPress={handleAuthentication} 
                          color="#6200ee"
                      />
                    </View>
                    
                    <Text style={styles.toggleText} onPress={() => setIsLogin(!isLogin)}>
                        <Text style={toggleTextStyle}>
                            {isLogin ? '¿No tienes cuenta? Regístrate' : '¿Ya tienes cuenta? Inicia sesión'}
                        </Text>
                    </Text>
                </View>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: { 
        flex: 1, 
        justifyContent: 'center', 
    },
    keyboardAvoidingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    card: {
        width: '100%',
        maxWidth: 400,
        padding: 25,
        borderRadius: 15,
        alignItems: 'center',
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
    mainTitle: {
        fontSize: 26,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 10,
    },
    subtitle: {
        fontSize: 20,
        textAlign: 'center',
        marginBottom: 30,
    },
    input: {
        width: '100%',
        height: 50,
        borderWidth: 1,
        marginBottom: 15,
        paddingHorizontal: 15,
        borderRadius: 8,
    },
    buttonContainer: {
        width: '100%',
        marginVertical: 10,
    },
    toggleText: {
        marginTop: 20,
        fontSize: 16,
        fontWeight: '600',
    }
});

export default LoginScreen;
