package com.example.tp2appmoviles

import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Button
import androidx.compose.material3.Text
import android.content.Context
import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.compose.foundation.background
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.text.KeyboardOptions
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.automirrored.filled.ArrowBack
import androidx.compose.material3.ButtonDefaults
import androidx.compose.runtime.*
import androidx.compose.ui.Modifier
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.text.input.KeyboardType
import androidx.compose.ui.unit.dp
import com.example.tp2appmoviles.ui.theme.TP2appmovilesTheme
import androidx.compose.material3.ExperimentalMaterial3Api
import androidx.compose.material3.Scaffold
import androidx.compose.material3.TopAppBar
import androidx.compose.material3.Icon
import androidx.compose.material3.IconButton
import androidx.compose.material3.HorizontalDivider
import androidx.compose.material3.OutlinedTextField
import androidx.compose.ui.graphics.Color
import com.example.tp2appmoviles.ui.components.SharedBackground
import com.example.tp2appmoviles.ui.components.SearchResultCard
import androidx.compose.material3.Text
import androidx.compose.ui.unit.sp
import androidx.activity.viewModels
import androidx.navigation.compose.rememberNavController
import androidx.navigation.NavHostController
import com.example.tp2appmoviles.ui.viewmodel.ThemeViewModel
import com.example.tp2appmoviles.ui.viewmodel.ThemeViewModelFactory


class CapitalsActivity : ComponentActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)

        val themeViewModel: ThemeViewModel by viewModels { ThemeViewModelFactory(this) }

        setContent {
            val isDarkMode by themeViewModel.isDarkMode.collectAsState()
            val navController = rememberNavController()

            TP2appmovilesTheme(darkTheme = isDarkMode) {
                CapitalsScreen(
                    navController = navController,
                    themeViewModel = themeViewModel
                )
            }
        }
    }
}

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun CapitalsScreen(
    navController: NavHostController,
    themeViewModel: ThemeViewModel
) {
    val isDarkMode by themeViewModel.isDarkMode.collectAsState()
    val context = LocalContext.current
    var country by remember { mutableStateOf("") }
    var city by remember { mutableStateOf("") }
    var population by remember { mutableStateOf("") }
    var searchQuery by remember { mutableStateOf("") }
    var searchResult by remember { mutableStateOf("") }
    val capitals = remember { mutableStateListOf<CapitalCity>() }

    SharedBackground(isDarkMode = isDarkMode) {
        Scaffold(
            containerColor = Color.Transparent,
            topBar = {
                TopAppBar(
                    title = { Text("Gestión de Capitales") }, // Corregido "Gestion" -> "Gestión"
                    navigationIcon = {
                        IconButton(onClick = { navController.navigateUp() }) {
                            Icon(
                                imageVector = Icons.AutoMirrored.Filled.ArrowBack, // Versión actualizada
                                contentDescription = "Volver"
                            )
                        }
                    }
                )
            }
        ) { innerPadding ->
            Column(
                modifier = Modifier
                    .padding(innerPadding)
                    .fillMaxSize()
                    .padding(24.dp),
                verticalArrangement = Arrangement.spacedBy(16.dp)
            ) {
                // Sección para agregar capitales
                Text("Agregar nueva capital", color = MaterialTheme.colorScheme.onBackground, style = MaterialTheme.typography.titleMedium)

                OutlinedTextField(
                    value = country,
                    onValueChange = { country = it },
                    label = { Text("País") },
                    modifier = Modifier.fillMaxWidth()
                )

                OutlinedTextField(
                    value = city,
                    onValueChange = { city = it },
                    label = { Text("Capital") },
                    modifier = Modifier.fillMaxWidth()
                )

                OutlinedTextField(
                    value = population,
                    onValueChange = { population = it },
                    label = { Text("Población") }, // Corregido "Poblacion"
                    keyboardOptions = KeyboardOptions(keyboardType = KeyboardType.Number),
                    modifier = Modifier.fillMaxWidth()
                )

                Button(
                    onClick = {
                        if (country.isBlank() || city.isBlank() || population.isBlank()) {
                            showToast(context, "Complete todos los campos")
                            return@Button
                        }

                        try {
                            capitals.add(CapitalCity(country, city, population.toLong()))
                            country = ""
                            city = ""
                            population = ""
                            showToast(context, "Capital agregada!")
                        } catch (e: NumberFormatException) {
                            showToast(context, "Población inválida") // Corregido "Invalida"
                        }
                    },
                    colors = ButtonDefaults.buttonColors(containerColor = Color(0xFF3F51B5)),
                    shape = RoundedCornerShape(50),
                    modifier = Modifier
                        .fillMaxWidth()
                        .height(55.dp)
                        .padding(vertical = 4.dp)
                ) {
                    Text("Agregar Capital", color = Color.White, fontSize = 18.sp)
                }

                HorizontalDivider( // Divider actualizado
                    modifier = Modifier.padding(vertical = 16.dp),
                    color = MaterialTheme.colorScheme.outline
                )

                // Sección para buscar capitales
                Text("Buscar capital", color = MaterialTheme.colorScheme.onBackground, style = MaterialTheme.typography.titleMedium)

                OutlinedTextField(
                    value = searchQuery,
                    onValueChange = { searchQuery = it },
                    label = { Text("Nombre de la capital") },
                    modifier = Modifier.fillMaxWidth()
                )

                Button(
                    onClick = {
                        val capital = capitals.find { it.cityName.equals(searchQuery, true) }
                        searchResult = capital?.let {
                            "País: ${it.country}\nCapital: ${it.cityName}\nPoblación: ${it.population}"
                        } ?: "Capital no encontrada"
                    },
                    colors = ButtonDefaults.buttonColors(containerColor = Color(0xFF3F51B5)),
                    shape = RoundedCornerShape(50),
                    modifier = Modifier
                        .fillMaxWidth()
                        .height(55.dp)
                        .padding(vertical = 4.dp)
                ) {
                    Text("Buscar", color = Color.White, fontSize = 18.sp)
                }

                if (searchResult.isNotBlank()) {
                    SearchResultCard(searchResult = searchResult)
                }
            }
        }
    }
}

private fun showToast(context: Context, message: String) {
    android.widget.Toast.makeText(context, message, android.widget.Toast.LENGTH_SHORT).show()
}