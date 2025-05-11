package com.example.tp2appmoviles

import android.content.Context
import android.media.MediaPlayer
import android.os.Build
import android.os.Bundle
import android.os.VibrationEffect
import android.os.Vibrator
import android.provider.Settings
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.compose.animation.animateColorAsState
import androidx.compose.foundation.background
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.core.content.ContextCompat
import androidx.core.content.edit
import com.example.tp2appmoviles.ui.theme.TP2appmovilesTheme
import kotlinx.coroutines.launch
import kotlin.random.Random
import androidx.compose.material3.Text
import androidx.compose.material3.OutlinedTextField
import androidx.compose.material3.Button
import com.example.tp2appmoviles.ui.components.SharedBackground
import androidx.compose.material3.Scaffold
import androidx.compose.material3.TopAppBar
import androidx.compose.material.icons.automirrored.filled.ArrowBack
import androidx.compose.material.icons.Icons
import androidx.activity.viewModels
import androidx.navigation.compose.rememberNavController
import androidx.navigation.NavHostController
import com.example.tp2appmoviles.ui.viewmodel.ThemeViewModel
import com.example.tp2appmoviles.ui.viewmodel.ThemeViewModelFactory

class GuessNumberActivity : ComponentActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)

        val themeViewModel: ThemeViewModel by viewModels { ThemeViewModelFactory(this) }

        setContent {
            val isDarkMode by themeViewModel.isDarkMode.collectAsState()
            val navController = rememberNavController()

            TP2appmovilesTheme(darkTheme = isDarkMode) {
                GuessNumberGame(
                    navController = navController,
                    themeViewModel = themeViewModel
                )
            }
        }
    }
}

@Composable
@OptIn(ExperimentalMaterial3Api::class)
fun GuessNumberGame(
    navController: NavHostController,
    themeViewModel: ThemeViewModel
) {
    val isDarkMode by themeViewModel.isDarkMode.collectAsState()
    val context = LocalContext.current
    val prefs = context.getSharedPreferences("game_prefs", Context.MODE_PRIVATE)
    val coroutineScope = rememberCoroutineScope()

    var currentScore by remember { mutableIntStateOf(0) }
    var maxScore by remember { mutableIntStateOf(0) }
    var consecutiveFails by remember { mutableIntStateOf(0) }
    var message by remember { mutableStateOf("") }
    var guessInput by remember { mutableStateOf("") }
    var messageColor by remember { mutableStateOf(Color.Gray) }

    LaunchedEffect(Unit) {
        maxScore = prefs.getInt("MAX_SCORE", 0)
    }

    val animatedMessageColor by animateColorAsState(targetValue = messageColor)

    SharedBackground(isDarkMode = isDarkMode) {
        Scaffold(
            containerColor = Color.Transparent,
            topBar = {
                TopAppBar(
                    title = { Text("Adivina el Número") },
                    navigationIcon = {
                        IconButton(onClick = { navController.navigateUp() }) {
                            Icon(
                                imageVector = Icons.AutoMirrored.Filled.ArrowBack,
                                contentDescription = "Volver",
                            )
                        }
                    },
                )
            }
        ) { innerPadding ->
            Column(
                modifier = Modifier
                    .padding(innerPadding)
                    .fillMaxSize()
                    .padding(24.dp),
                verticalArrangement = Arrangement.SpaceEvenly,
                horizontalAlignment = Alignment.CenterHorizontally
            ) {
                Column(horizontalAlignment = Alignment.CenterHorizontally) {
                    Text("Puntaje: $currentScore", color = MaterialTheme.colorScheme.onBackground, fontSize = 28.sp, fontWeight = FontWeight.Bold)
                    Text("Máximo puntaje: $maxScore", color = MaterialTheme.colorScheme.onBackground, fontSize = 24.sp)
                    Text("Fallos seguidos: $consecutiveFails / 5", color = MaterialTheme.colorScheme.onBackground, fontSize = 18.sp)
                }

                OutlinedTextField(
                    value = guessInput,
                    onValueChange = { guessInput = it },
                    label = { Text("Adiviná un número (1-5)") },
                    modifier = Modifier.fillMaxWidth(0.85f)
                )

                Column(
                    modifier = Modifier.fillMaxWidth(0.85f),
                    horizontalAlignment = Alignment.CenterHorizontally
                ) {
                    Button(
                        onClick = {
                            val guess = guessInput.toIntOrNull()
                            val randomNumber = Random.nextInt(1, 6)

                            if (guess == null || guess !in 1..5) {
                                message = "Ingresá un número válido entre 1 y 5."
                                messageColor = Color.Gray
                                return@Button
                            }

                            if (guess == randomNumber) {
                                currentScore += 10
                                consecutiveFails = 0
                                message = "¡Adivinaste! 🎉"
                                messageColor = Color(0xFF4CAF50)
                                vibrateSafe(context, 200)
                                MediaPlayer.create(context, Settings.System.DEFAULT_NOTIFICATION_URI).start()
                            } else {
                                consecutiveFails++
                                message = "Fallaste. Era $randomNumber."
                                messageColor = Color(0xFFF44336)
                                vibrateSafe(context, 400)

                                if (consecutiveFails == 5) {
                                    currentScore = 0
                                    consecutiveFails = 0
                                    message = "Perdiste. Puntaje reiniciado."
                                    messageColor = Color.Gray
                                }
                            }

                            if (currentScore > maxScore) {
                                maxScore = currentScore
                                coroutineScope.launch {
                                    prefs.edit { putInt("MAX_SCORE", maxScore) }
                                }
                            }

                            guessInput = ""
                        },
                        colors = ButtonDefaults.buttonColors(containerColor = Color(0xFF3F51B5)),
                        shape = RoundedCornerShape(50),
                        modifier = Modifier
                            .fillMaxWidth()
                            .height(55.dp)
                            .padding(vertical = 4.dp)
                    ) {
                        Text("Adivinar", color = Color.White, fontSize = 18.sp)
                    }

                    Button(
                        onClick = {
                            currentScore = 0
                            consecutiveFails = 0
                            message = "Juego reiniciado."
                            messageColor = Color.Gray
                        },
                        colors = ButtonDefaults.buttonColors(containerColor = Color(0xFFD32F2F)),
                        shape = RoundedCornerShape(50),
                        modifier = Modifier
                            .fillMaxWidth()
                            .height(55.dp)
                            .padding(vertical = 4.dp)
                    ) {
                        Text("Reiniciar juego", color = Color.White, fontSize = 18.sp)
                    }
                }

                if (message.isNotEmpty()) {
                    Box(
                        modifier = Modifier
                            .fillMaxWidth(0.85f)
                            .background(animatedMessageColor, shape = RoundedCornerShape(12.dp))
                            .padding(16.dp)
                    ) {
                        Text(message, fontSize = 18.sp, color = Color.White)
                    }
                }
            }
        }
    }
}

fun vibrateSafe(context: Context, duration: Long) {
    val vibrator = ContextCompat.getSystemService(context, Vibrator::class.java)
    vibrator?.let {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            it.vibrate(VibrationEffect.createOneShot(duration, VibrationEffect.DEFAULT_AMPLITUDE))
        } else {
            @Suppress("DEPRECATION")
            it.vibrate(duration)
        }
    }
}

