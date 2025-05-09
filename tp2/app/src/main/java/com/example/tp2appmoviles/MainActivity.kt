package com.example.tp2appmoviles

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


class MainActivity : ComponentActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContent {
            TP2appmovilesTheme {
                MainScreen()
            }
        }
    }
}

@Composable
fun MainScreen() {
    val context = LocalContext.current

    Box(
        modifier = Modifier
            .fillMaxSize()
            .background(
                Brush.verticalGradient(
                    listOf(Color(0xFFE3F2FD), Color(0xFFBBDEFB))
                )
            )
    ) {
        Column(
            modifier = Modifier
                .fillMaxSize()
                .padding(32.dp),
            verticalArrangement = Arrangement.Center,
            horizontalAlignment = Alignment.CenterHorizontally
        ) {
            // Botón para el juego
            Button(
                onClick = {
                    context.startActivity(Intent(context, GuessNumberActivity::class.java))
                },
                modifier = Modifier
                    .fillMaxWidth()
                    .height(60.dp),
                colors = ButtonDefaults.buttonColors(containerColor = Color(0xFF3F51B5)),
                shape = MaterialTheme.shapes.medium
            ) {
                Text("Juego de Adivinanza", fontSize = 18.sp, color = Color.White)
            }

            Spacer(modifier = Modifier.height(24.dp))

            // Botón para capitales
            Button(
                onClick = {
                    context.startActivity(Intent(context, CapitalsActivity::class.java))
                },
                modifier = Modifier
                    .fillMaxWidth()
                    .height(60.dp),
                colors = ButtonDefaults.buttonColors(containerColor = Color(0xFF4CAF50)),
                shape = MaterialTheme.shapes.medium
            ) {
                Text("Gestión de Capitales", fontSize = 18.sp, color = Color.White)
            }
        }
    }
}