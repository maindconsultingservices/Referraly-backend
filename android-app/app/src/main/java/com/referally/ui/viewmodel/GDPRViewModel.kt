package com.referally.ui.viewmodel

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.referally.ui.repository.GDPRRepository
import kotlinx.coroutines.launch

class GDPRViewModel(private val repository: GDPRRepository = GDPRRepository()) : ViewModel() {

    fun giveConsent() {
        viewModelScope.launch {
            try {
                repository.giveConsent()
            } catch (e: Exception) {
                // Handle error
            }
        }
    }
}
