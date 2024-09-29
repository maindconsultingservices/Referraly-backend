package com.referally.viewmodel

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.referally.model.AdminDashboardData
import com.referally.model.UIState
import com.referally.repository.AdminRepository
import kotlinx.coroutines.launch

class AdminViewModel(private val repository: AdminRepository = AdminRepository()) : ViewModel() {
    var dashboardState = UIState<AdminDashboardData>()
        private set

    fun fetchDashboardData() {
        viewModelScope.launch {
            dashboardState = dashboardState.copy(isLoading = true)
            try {
                val data = repository.getDashboardData()
                dashboardState = UIState(data = data)
            } catch (e: Exception) {
                dashboardState = UIState(error = e.message)
            }
        }
    }
}
