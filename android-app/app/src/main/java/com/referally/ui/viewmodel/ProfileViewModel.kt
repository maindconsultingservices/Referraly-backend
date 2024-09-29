package com.referally.viewmodel

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.referally.model.UserProfile
import com.referally.model.UIState
import com.referally.repository.ProfileRepository
import kotlinx.coroutines.launch

class ProfileViewModel(private val repository: ProfileRepository = ProfileRepository()) : ViewModel() {
    var profileState = UIState<UserProfile>()
        private set

    fun fetchProfile() {
        viewModelScope.launch {
            profileState = profileState.copy(isLoading = true)
            try {
                val userProfile = repository.getProfile()
                profileState = UIState(data = userProfile)
            } catch (e: Exception) {
                profileState = UIState(error = e.message)
            }
        }
    }

    fun updateFirstName(firstName: String) {
        profileState = profileState.copy(data = profileState.data?.copy(firstName = firstName))
    }

    // Similar methods for updating other profile fields

    fun saveProfile() {
        viewModelScope.launch {
            profileState = profileState.copy(isLoading = true)
            try {
                repository.updateProfile(profileState.data!!)
                profileState = profileState.copy(isLoading = false)
            } catch (e: Exception) {
                profileState = UIState(error = e.message)
            }
        }
    }
}
