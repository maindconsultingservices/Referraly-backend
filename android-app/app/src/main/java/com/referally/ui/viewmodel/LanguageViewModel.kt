package com.referally.viewmodel

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.referally.datastore.UserPreferences
import com.referally.repository.LanguageRepository
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.first
import kotlinx.coroutines.launch

class LanguageViewModel(
    private val repository: LanguageRepository = LanguageRepository(),
    private val userPreferences: UserPreferences = UserPreferences()
) : ViewModel() {

    private val _currentLanguage = MutableStateFlow<String>("en")
    val currentLanguage: StateFlow<String> get() = _currentLanguage

    init {
        viewModelScope.launch {
            _currentLanguage.value = userPreferences.languagePreference.first() ?: "en"
        }
    }

    fun changeLanguage(language: String) {
        viewModelScope.launch {
            try {
                repository.changeLanguage(language)
                userPreferences.saveLanguagePreference(language)
                _currentLanguage.value = language
            } catch (e: Exception) {
                // Handle error
            }
        }
    }
}
