package com.example.tp2appmoviles.data.entities
import androidx.room.Entity
import androidx.room.ColumnInfo
import androidx.room.PrimaryKey

@Entity(tableName = "capitals")
data class CapitalCity(
    @PrimaryKey(autoGenerate = true)
    val id: Int = 0,
    @ColumnInfo(name = "country")
    val country: String,
    @ColumnInfo(name = "city_name")
    val cityName: String,
    @ColumnInfo(name = "population")
    val population: Long
)