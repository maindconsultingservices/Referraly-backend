package com.example.appname.repository

import com.example.appname.network.ApiService
import com.example.appname.datastore.UserPreferences
import kotlinx.coroutines.flow.first

class AuthRepository(private val apiService: ApiService = ApiService.create()) {
    private val userPreferences = UserPreferences()

    suspend fun login(email: String, password: String): String {
        val response = apiService.login(mapOf("email" to email, "password" to password))
        if (response.isSuccessful) {
            val body = response.body()!!
            userPreferences.saveAuthToken(body.token)
            userPreferences.saveLanguagePreference(body.languagePreference)
            return body.role
        } else {
            throw Exception(response.errorBody()?.string())
        }
    }

    suspend fun register(
        email: String,
        username: String,
        password: String,
        firstName: String,
        lastName: String
    ) {
        val response = apiService.register(
            mapOf(
                "email" to email,
                "username" to username,
                "password" to password,
                "firstName" to firstName,
                "lastName" to lastName
            )
        )
        if (!response.isSuccessful) {
            throw Exception(response.errorBody()?.string())
        }
    }
}
