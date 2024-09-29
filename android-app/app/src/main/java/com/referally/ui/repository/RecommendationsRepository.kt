package com.referally.ui.repository

import com.referally.ui.model.Recommendation
import com.referally.ui.network.ApiService
import com.referally.ui.model.AppDatabase

class RecommendationsRepository(
    private val apiService: ApiService = ApiService.create(),
    private val database: AppDatabase = AppDatabase.getInstance()
) {

    suspend fun getRecommendations(): List<Recommendation> {
        val response = apiService.getRecommendations()
        if (response.isSuccessful) {
            val recommendations = response.body()!!
            // Cache to local database
            database.recommendationDao().insertAll(recommendations)
            return recommendations
        } else {
            // Fetch from local database in case of error
            return database.recommendationDao().getAll()
        }
    }

    // Methods to create, update, delete recommendations
}
