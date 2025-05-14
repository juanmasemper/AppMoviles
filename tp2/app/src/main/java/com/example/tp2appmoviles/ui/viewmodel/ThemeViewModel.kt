package com.example.tp2appmoviles.ui.viewmodel

import android.content.Context
import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.launch

class ThemeViewModel(context: Context) : ViewModel() {

    private val prefs = context.getSharedPreferences("user_preferences", Context.MODE_PRIVATE)

    // Flow para observar el estado del tema
    private val _isDarkMode = MutableStateFlow(prefs.getBoolean("isDarkMode", false))
    val isDarkMode: StateFlow<Boolean> = _isDarkMode

    // Función para alternar el tema
    fun toggleTheme() {
        _isDarkMode.value = !_isDarkMode.value
        saveThemePreference(_isDarkMode.value)
    }

    // Guardar la preferencia en SharedPreferences
    private fun saveThemePreference(isDarkMode: Boolean) {
        viewModelScope.launch {
            prefs.edit().putBoolean("isDarkMode", isDarkMode).apply()
        }
    }
}