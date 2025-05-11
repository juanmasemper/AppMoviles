package com.example.tp2appmoviles

import android.content.Context
import androidx.compose.foundation.background
import androidx.compose.foundation.layout.Box
import android.content.Intent
import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.compose.foundation.layout.*
import androidx.compose.material3.*
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.example.tp2appmoviles.ui.theme.TP2appmovilesTheme
import androidx.compose.material3.Text
import androidx.compose.material3.Button
import com.example.tp2appmoviles.ui.components.SharedBackground
import androidx.compose.runtime.*
import androidx.core.content.edit
import androidx.activity.viewModels
import androidx.navigation.compose.NavHost
import androidx.navigation.compose.composable
import androidx.navigation.NavHostController
import androidx.navigation.compose.rememberNavController
import com.example.tp2appmoviles.data.database.AppDatabase
import com.example.tp2appmoviles.ui.viewmodel.ThemeViewModel
import com.example.tp2appmoviles.ui.viewmodel.ThemeViewModelFactory

class MainActivity : ComponentActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        AppDatabase.getDatabase(this)

        // Inicializar el ViewModel
        val themeViewModel: ThemeViewModel by viewModels { ThemeViewModelFactory(this) }

        setContent {
            val isDarkMode by themeViewModel.isDarkMode.collectAsState()

            TP2appmovilesTheme(darkTheme = isDarkMode) {
                // Navegación con ViewModel compartido
                val navController = rememberNavController()
                NavHost(
                    navController = navController,
                    startDestination = "main_screen"
                ) {
                    composable("main_screen") {
                        MainScreen(
                            navController = navController,
                            themeViewModel = themeViewModel
                        )
                    }
                    composable("guess_game") {
                        GuessNumberGame(
                            navController = navController,
                            themeViewModel = themeViewModel
                        )
                    }
                    composable("capitals") {
                        CapitalsScreen(
                            navController = navController,
                            themeViewModel = themeViewModel
                        )
                    }
                }
            }
        }
    }
}

@Composable
fun MainScreen(
    navController: NavHostController,
    themeViewModel: ThemeViewModel
) {
    val isDarkMode by themeViewModel.isDarkMode.collectAsState()

    SharedBackground(isDarkMode = isDarkMode) {
        Column(
            modifier = Modifier
                .fillMaxSize()
                .padding(32.dp),
            verticalArrangement = Arrangement.Center,
            horizontalAlignment = Alignment.CenterHorizontally
        ) {
            Button(
                onClick = { navController.navigate("guess_game") },
                modifier = Modifier
                    .fillMaxWidth()
                    .height(60.dp),
                colors = ButtonDefaults.buttonColors(containerColor = Color(0xFF3F51B5)),
                shape = MaterialTheme.shapes.medium
            ) {
                Text("Juego de Adivinanza", fontSize = 18.sp, color = Color.White)
            }

            Spacer(modifier = Modifier.height(24.dp))

            Button(
                onClick = { navController.navigate("capitals") },
                modifier = Modifier
                    .fillMaxWidth()
                    .height(60.dp),
                colors = ButtonDefaults.buttonColors(containerColor = Color(0xFF4CAF50)),
                shape = MaterialTheme.shapes.medium
            ) {
                Text("Gestión de Capitales", fontSize = 18.sp, color = Color.White)
            }

            Spacer(modifier = Modifier.height(24.dp))

            // Botón para alternar el tema
            Button(
                onClick = { themeViewModel.toggleTheme() },
                modifier = Modifier
                    .fillMaxWidth()
                    .height(60.dp),
                colors = ButtonDefaults.buttonColors(containerColor = Color.Gray),
                shape = MaterialTheme.shapes.medium
            ) {
                Text(
                    if (isDarkMode) "Modo Claro" else "Modo Oscuro",
                    fontSize = 18.sp,
                    color = Color.White
                )
            }
        }
    }
}

fun saveThemePreference(context: Context, isDarkMode: Boolean) {
    val sharedPreferences = context.getSharedPreferences("user_preferences", Context.MODE_PRIVATE)
    sharedPreferences.edit() {
        putBoolean("isDarkMode", isDarkMode)
    }
}