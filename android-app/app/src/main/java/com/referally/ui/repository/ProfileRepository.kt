package com.referally.repository

import com.referally.model.UserProfile
import com.referally.network.ApiService

class ProfileRepository(private val apiService: ApiService = ApiService.create()) {

    suspend fun getProfile(): UserProfile {
        val response = apiService.getProfile()
        if (response.isSuccessful) {
            return response.body()!!
        } else {
            throw Exception(response.errorBody()?.string())
        }
    }

    suspend fun updateProfile(profile: UserProfile) {
        val response = apiService.updateProfile(profile.toMap())
        if (!response.isSuccessful) {
            throw Exception(response.errorBody()?.string())
        }
    }
}
