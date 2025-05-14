package com.example.tp2appmoviles

import android.app.Application
import android.content.Context
import android.os.Bundle
import android.widget.Toast
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.activity.viewModels
import androidx.compose.animation.AnimatedVisibility
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.text.KeyboardOptions
import androidx.compose.foundation.verticalScroll
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.ExpandMore
import androidx.compose.material.icons.filled.ExpandLess
import androidx.compose.material.icons.automirrored.filled.ArrowBack
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.text.input.KeyboardType
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.lifecycle.viewmodel.compose.viewModel
import androidx.navigation.NavHostController
import androidx.navigation.compose.rememberNavController
import com.example.tp2appmoviles.data.entities.CapitalCity
import com.example.tp2appmoviles.ui.components.SearchResultCard
import com.example.tp2appmoviles.ui.components.SharedBackground
import com.example.tp2appmoviles.ui.theme.TP2appmovilesTheme
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
                CapitalsScreen(navController, themeViewModel)
            }
        }
    }
}

@Composable
fun ExpandableSection(title: String, content: @Composable () -> Unit) {
    var expanded by remember { mutableStateOf(true) }

    Column(modifier = Modifier.fillMaxWidth().padding(bottom = 12.dp)) {
        Row(
            modifier = Modifier
                .fillMaxWidth()
                .clickable { expanded = !expanded }
                .padding(vertical = 8.dp),
            horizontalArrangement = Arrangement.SpaceBetween
        ) {
            Text(
                text = title,
                style = MaterialTheme.typography.titleMedium,
                color = MaterialTheme.colorScheme.primary
            )
            Icon(
                imageVector = if (expanded) Icons.Filled.ExpandLess else Icons.Filled.ExpandMore,
                contentDescription = null,
                tint = MaterialTheme.colorScheme.primary
            )
        }

        AnimatedVisibility(visible = expanded) {
            Column(modifier = Modifier.padding(top = 8.dp)) {
                content()
                Spacer(modifier = Modifier.height(12.dp)) // margen final
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
                            Icon(Icons.AutoMirrored.Filled.ArrowBack, contentDescription = "Volver")
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
                verticalArrangement = Arrangement.spacedBy(12.dp)
            ) {
                ExpandableSection("Agregar nueva capital") {
                    OutlinedTextField(value = country, onValueChange = { country = it }, label = { Text("País") }, modifier = Modifier.fillMaxWidth())
                    OutlinedTextField(value = city, onValueChange = { city = it }, label = { Text("Capital") }, modifier = Modifier.fillMaxWidth())
                    OutlinedTextField(
                        value = population,
                        onValueChange = { population = it },
                        label = { Text("Población") },
                        keyboardOptions = KeyboardOptions(keyboardType = KeyboardType.Number),
                        modifier = Modifier.fillMaxWidth()
                    )
                    Spacer(modifier = Modifier.height(8.dp))
                    Button(
                        onClick = {
                            if (country.isBlank() || city.isBlank() || population.isBlank()) {
                                showToast(context, "Complete todos los campos"); return@Button
                            }
                            try {
                                viewModel.addCapital(CapitalCity(0, country, city, population.toLong()))
                                country = ""; city = ""; population = ""
                                showToast(context, "Capital agregada!")
                            } catch (_: NumberFormatException) {
                                showToast(context, "Población inválida")
                            }
                        },
                        colors = ButtonDefaults.buttonColors(containerColor = Color(0xFF3F51B5)),
                        shape = RoundedCornerShape(50),
                        modifier = Modifier.fillMaxWidth().height(55.dp)
                    ) {
                        Text("Agregar Capital", color = Color.White, fontSize = 18.sp)
                    }
                }

                ExpandableSection("Buscar capital") {
                    OutlinedTextField(value = searchQuery, onValueChange = { searchQuery = it }, label = { Text("Nombre de la capital") }, modifier = Modifier.fillMaxWidth())
                    Spacer(modifier = Modifier.height(8.dp))
                    Button(
                        onClick = {
                            val capital = capitals.find { it.cityName.equals(searchQuery, true) }
                            searchResult = capital?.let {
                                "País: ${it.country}\nCapital: ${it.cityName}\nPoblación: ${it.population}"
                            } ?: "Capital no encontrada"
                        },
                        colors = ButtonDefaults.buttonColors(containerColor = Color(0xFF3F51B5)),
                        shape = RoundedCornerShape(50),
                        modifier = Modifier.fillMaxWidth().height(55.dp)
                    ) {
                        Text("Buscar", color = Color.White, fontSize = 18.sp)
                    }
                    if (searchResult.isNotBlank()) {
                        SearchResultCard(searchResult = searchResult)
                    }
                }

                ExpandableSection("Borrar por ciudad") {
                    OutlinedTextField(value = deleteCity, onValueChange = { deleteCity = it }, label = { Text("Nombre ciudad a borrar") }, modifier = Modifier.fillMaxWidth())
                    Spacer(modifier = Modifier.height(8.dp))
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
                        colors = ButtonDefaults.buttonColors(containerColor = Color(0xFFE57373)),
                        shape = RoundedCornerShape(50),
                        modifier = Modifier.fillMaxWidth().height(55.dp)
                    ) {
                        Text("Borrar Ciudad", color = Color.White, fontSize = 18.sp)
                    }
                }

                ExpandableSection("Borrar por país") {
                    OutlinedTextField(value = deleteCountry, onValueChange = { deleteCountry = it }, label = { Text("País a borrar") }, modifier = Modifier.fillMaxWidth())
                    Spacer(modifier = Modifier.height(8.dp))
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
                        colors = ButtonDefaults.buttonColors(containerColor = Color(0xFFF44336)),
                        shape = RoundedCornerShape(50),
                        modifier = Modifier.fillMaxWidth().height(55.dp)
                    ) {
                        Text("Borrar Todas las Capitales del País", color = Color.White, fontSize = 18.sp)
                    }
                }

                ExpandableSection("Actualizar población") {
                    OutlinedTextField(value = updateCity, onValueChange = { updateCity = it }, label = { Text("Ciudad a actualizar") }, modifier = Modifier.fillMaxWidth())
                    OutlinedTextField(
                        value = newPopulation,
                        onValueChange = { newPopulation = it },
                        label = { Text("Nueva población") },
                        keyboardOptions = KeyboardOptions(keyboardType = KeyboardType.Number),
                        modifier = Modifier.fillMaxWidth()
                    )
                    Spacer(modifier = Modifier.height(8.dp))
                    Button(
                        onClick = {
                            if (updateCity.isNotBlank() && newPopulation.isNotBlank()) {
                                val capital = capitals.find { it.cityName.equals(updateCity, true) }
                                capital?.let {
                                    viewModel.updatePopulation(updateCity, newPopulation.toLong())
                                    updateCity = ""; newPopulation = ""
                                    showToast(context, "Población actualizada")
                                } ?: showToast(context, "Ciudad no encontrada")
                            } else {
                                showToast(context, "Complete ambos campos")
                            }
                        },
                        colors = ButtonDefaults.buttonColors(containerColor = Color(0xFFFFC107)),
                        shape = RoundedCornerShape(50),
                        modifier = Modifier.fillMaxWidth().height(55.dp)
                    ) {
                        Text("Actualizar Población", color = Color.White, fontSize = 18.sp)
                    }
                }
            }
        }
    }
}

private fun showToast(context: Context, message: String) {
    Toast.makeText(context, message, Toast.LENGTH_SHORT).show()
}
