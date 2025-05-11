
package com.example.tp2appmoviles

import android.app.Application
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Button
import androidx.compose.material3.Text
import android.content.Context
import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
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
import androidx.compose.ui.unit.sp
import androidx.activity.viewModels
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.verticalScroll
import androidx.lifecycle.viewmodel.compose.viewModel
import androidx.navigation.compose.rememberNavController
import androidx.navigation.NavHostController
import com.example.tp2appmoviles.data.entities.CapitalCity
import com.example.tp2appmoviles.ui.viewmodel.ThemeViewModel
import com.example.tp2appmoviles.ui.viewmodel.ThemeViewModelFactory
import com.example.tp2appmoviles.viewmodel.CapitalsViewModel
import com.example.tp2appmoviles.viewmodel.CapitalsViewModelFactory


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
    themeViewModel: ThemeViewModel,
    viewModel: CapitalsViewModel = viewModel(factory = CapitalsViewModelFactory(LocalContext.current.applicationContext as Application))
) {
    val isDarkMode by themeViewModel.isDarkMode.collectAsState()
    val context = LocalContext.current
    var country by remember { mutableStateOf("") }
    var city by remember { mutableStateOf("") }
    var population by remember { mutableStateOf("") }
    var searchQuery by remember { mutableStateOf("") }
    var searchResult by remember { mutableStateOf("") }
    val capitals by viewModel.allCapitals.collectAsState()
    var deleteCity by remember { mutableStateOf("") }
    var deleteCountry by remember { mutableStateOf("") }
    var updateCity by remember { mutableStateOf("") }
    var newPopulation by remember { mutableStateOf("") }

    SharedBackground(isDarkMode = isDarkMode) {
        Scaffold(
            containerColor = Color.Transparent,
            topBar = {
                TopAppBar(
                    title = { Text("Gestión de Capitales") },
                    navigationIcon = {
                        IconButton(onClick = { navController.navigateUp() }) {
                            Icon(Icons.AutoMirrored.Filled.ArrowBack, "Volver")
                        }
                    }
                )
            }
        ) { innerPadding ->
            Column(
                modifier = Modifier
                    .padding(innerPadding)
                    .fillMaxSize()
                    .verticalScroll(rememberScrollState())
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
                            viewModel.addCapital(
                                CapitalCity(
                                    id = 0,
                                    country = country,
                                    cityName = city,
                                    population = population.toLong()
                                )
                            )
                            country = ""
                            city = ""
                            population = ""
                            showToast(context, "Capital agregada!")
                        } catch (_: NumberFormatException) {
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
                HorizontalDivider( // Divider actualizado
                    modifier = Modifier.padding(vertical = 16.dp),
                    color = MaterialTheme.colorScheme.outline
                )

                // Sección Borrar por Ciudad
                OutlinedTextField(
                    value = deleteCity,
                    onValueChange = { deleteCity = it },
                    label = { Text("Nombre ciudad a borrar") },
                    modifier = Modifier.fillMaxWidth()
                )
                Button(
                    onClick = {
                        if (deleteCity.isNotBlank()) {
                            viewModel.deleteByCity(deleteCity)
                            deleteCity = ""
                            showToast(context, "Ciudad borrada")
                        } else {
                            showToast(context, "Ingrese una ciudad")
                        }
                    },
                    colors = ButtonDefaults.buttonColors(containerColor = Color(0xFFE57373)), // Rojo
                    shape = RoundedCornerShape(50),
                    modifier = Modifier
                        .fillMaxWidth()
                        .height(55.dp)
                ) {
                    Text("Borrar Ciudad", color = Color.White, fontSize = 18.sp)
                }

                HorizontalDivider( // Divider actualizado
                    modifier = Modifier.padding(vertical = 16.dp),
                    color = MaterialTheme.colorScheme.outline
                )

                // Sección Borrar por País
                OutlinedTextField(
                    value = deleteCountry,
                    onValueChange = { deleteCountry = it },
                    label = { Text("País a borrar") },
                    modifier = Modifier.fillMaxWidth()
                )
                Button(
                    onClick = {
                        if (deleteCountry.isNotBlank()) {
                            viewModel.deleteByCountry(deleteCountry)
                            deleteCountry = ""
                            showToast(context, "Capitales borradas")
                        } else {
                            showToast(context, "Ingrese un país")
                        }
                    },
                    colors = ButtonDefaults.buttonColors(containerColor = Color(0xFFF44336)), // Rojo más intenso
                    shape = RoundedCornerShape(50),
                    modifier = Modifier
                        .fillMaxWidth()
                        .height(55.dp)
                ) {
                    Text("Borrar Todas las Capitales del País", color = Color.White, fontSize = 18.sp)
                }

                HorizontalDivider( // Divider actualizado
                    modifier = Modifier.padding(vertical = 16.dp),
                    color = MaterialTheme.colorScheme.outline
                )

                // Sección Actualizar Población
                Column(verticalArrangement = Arrangement.spacedBy(8.dp)) {
                    OutlinedTextField(
                        value = updateCity,
                        onValueChange = { updateCity = it },
                        label = { Text("Ciudad a actualizar") },
                        modifier = Modifier.fillMaxWidth()
                    )

                    OutlinedTextField(
                        value = newPopulation,
                        onValueChange = { newPopulation = it },
                        label = { Text("Nueva población") },
                        keyboardOptions = KeyboardOptions(keyboardType = KeyboardType.Number),
                        modifier = Modifier.fillMaxWidth()
                    )

                    Button(
                        onClick = {
                            if (updateCity.isNotBlank() && newPopulation.isNotBlank()) {
                                val capital = capitals.find { it.cityName.equals(updateCity, true) }
                                capital?.let {
                                    viewModel.updatePopulation(
                                        cityName = updateCity,
                                        newPopulation = newPopulation.toLong()
                                    )
                                    updateCity = ""
                                    newPopulation = ""
                                    showToast(context, "Población actualizada")
                                } ?: showToast(context, "Ciudad no encontrada")
                            } else {
                                showToast(context, "Complete ambos campos")
                            }
                        },
                        colors = ButtonDefaults.buttonColors(containerColor = Color(0xFFFFC107)), // Amarillo
                        shape = RoundedCornerShape(50),
                        modifier = Modifier
                            .fillMaxWidth()
                            .height(55.dp)
                    ) {
                        Text("Actualizar Población", color = Color.White, fontSize = 18.sp)
                    }
                }
                HorizontalDivider(
                    modifier = Modifier.padding(vertical = 16.dp),
                    color = MaterialTheme.colorScheme.outline
                )
            }
        }
    }
}

private fun showToast(context: Context, message: String) {
    android.widget.Toast.makeText(context, message, android.widget.Toast.LENGTH_SHORT).show()
}