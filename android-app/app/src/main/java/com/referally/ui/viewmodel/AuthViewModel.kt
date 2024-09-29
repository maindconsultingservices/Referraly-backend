package com.referally.ui.viewmodel

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.referally.ui.repository.AuthRepository 
import com.referally.ui.model.UIState
import kotlinx.coroutines.launch

class AuthViewModel(private val repository: AuthRepository = AuthRepository()) : ViewModel() {
    var uiState = UIState()
        private set

    fun login(email: String, password: String, onResult: (Boolean, String) -> Unit) {
        viewModelScope.launch {
            try {
                val role = repository.login(email, password)
                onResult(true, role)
            } catch (e: Exception) {
                uiState = uiState.copy(error = e.message)
                onResult(false, "")
            }
        }
    }

    fun register(
        email: String,
        username: String,
        password: String,
        firstName: String,
        lastName: String,
        onResult: (Boolean) -> Unit
    ) {
        viewModelScope.launch {
            try {
                repository.register(email, username, password, firstName, lastName)
                onResult(true)
            } catch (e: Exception) {
                uiState = uiState.copy(error = e.message)
                onResult(false)
            }
        }
    }
}
