package com.example.tp2appmoviles.viewmodel
import android.app.Application
import androidx.lifecycle.ViewModel
import androidx.lifecycle.ViewModelProvider

class CapitalsViewModelFactory(private val application: Application) : ViewModelProvider.Factory {
    override fun <T : ViewModel> create(modelClass: Class<T>): T {
        if (modelClass.isAssignableFrom(CapitalsViewModel::class.java)) {
            return CapitalsViewModel(application) as T
        }
        throw IllegalArgumentException("Unknown ViewModel class")
    }
}