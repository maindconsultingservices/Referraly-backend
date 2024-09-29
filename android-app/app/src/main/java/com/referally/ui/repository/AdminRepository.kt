package com.referally.ui.repository

import com.referally.ui.model.AdminDashboardData
import com.referally.ui.network.ApiService

class AdminRepository(private val apiService: ApiService = ApiService.create()) {

    suspend fun getDashboardData(): AdminDashboardData {
        val response = apiService.getAdminDashboard()
        if (response.isSuccessful) {
            return response.body()!!
        } else {
            throw Exception(response.errorBody()?.string())
        }
    }
}
