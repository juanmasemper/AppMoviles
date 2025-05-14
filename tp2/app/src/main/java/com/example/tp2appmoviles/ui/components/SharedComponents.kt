package com.example.tp2appmoviles.ui.components

import androidx.compose.foundation.background
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.runtime.Composable
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color

@Composable
fun SharedBackground(isDarkMode: Boolean, content: @Composable () -> Unit) {
    val colors = if (isDarkMode) {
        Brush.verticalGradient(
            listOf(Color(0xFF212121), Color(0xFF424242)) // Tonos oscuros
        )
    } else {
        Brush.verticalGradient(
            listOf(Color(0xFFE3F2FD), Color(0xFFBBDEFB)) // Tonos claros
        )
    }

    Box(
        modifier = Modifier
            .fillMaxSize()
            .background(colors)
    ) {
        content()
    }
}