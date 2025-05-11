package com.example.tp2appmoviles.data.dao

import androidx.room.*
import com.example.tp2appmoviles.data.entities.CapitalCity

@Dao
interface CapitalDao {
    @Insert
    suspend fun insert(capital: CapitalCity)

    @Query("SELECT * FROM capitals")
    fun getAll(): kotlinx.coroutines.flow.Flow<List<CapitalCity>>

    @Query("SELECT * FROM capitals WHERE city_name = :cityName")
    suspend fun getByCity(cityName: String): CapitalCity?

    @Delete
    suspend fun delete(capital: CapitalCity)

    @Query("DELETE FROM capitals WHERE city_name = :cityName")
    suspend fun deleteByCity(cityName: String)

    @Query("DELETE FROM capitals WHERE country = :country")
    suspend fun deleteByCountry(country: String)

    @Update
    suspend fun update(capital: CapitalCity)
}