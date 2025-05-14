package com.example.tp2appmoviles.viewmodel

import android.app.Application
import androidx.lifecycle.AndroidViewModel
import androidx.lifecycle.viewModelScope
import com.example.tp2appmoviles.data.database.AppDatabase
import com.example.tp2appmoviles.data.entities.CapitalCity
import kotlinx.coroutines.flow.Flow
import kotlinx.coroutines.flow.SharingStarted
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.stateIn
import kotlinx.coroutines.launch

class CapitalsViewModel(application: Application) : AndroidViewModel(application) {
    private val dao = AppDatabase.getDatabase(application).capitalDao()

    val allCapitals: StateFlow<List<CapitalCity>> = dao.getAll().stateIn(
        scope = viewModelScope,
        started = SharingStarted.WhileSubscribed(5000),
        initialValue = emptyList()
    )
    fun addCapital(capital: CapitalCity) = viewModelScope.launch {
        dao.insert(capital)
    }

    fun deleteByCity(cityName: String) = viewModelScope.launch {
        dao.deleteByCity(cityName)
    }

    fun deleteByCountry(country: String) = viewModelScope.launch {
        dao.deleteByCountry(country)
    }

    fun updatePopulation(cityName: String, newPopulation: Long) = viewModelScope.launch {
        val capital = dao.getByCity(cityName)
        capital?.let {
            dao.update(it.copy(population = newPopulation))
        }
    }
}