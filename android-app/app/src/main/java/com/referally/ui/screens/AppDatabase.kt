package com.example.appname.model

import androidx.room.Database
import androidx.room.RoomDatabase

@Database(entities = [Recommendation::class], version = 1)
abstract class AppDatabase : RoomDatabase() {
    abstract fun recommendationDao(): RecommendationDao
}
