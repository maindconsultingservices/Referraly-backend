package com.referally.ui.viewmodel

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.referally.ui.model.Recommendation
import com.referally.ui.model.UIState
import com.referally.ui.repository.RecommendationsRepository
import kotlinx.coroutines.launch

class RecommendationsViewModel(private val repository: RecommendationsRepository = RecommendationsRepository()) : ViewModel() {
    var recommendationsState = UIState<List<Recommendation>>(isLoading = true)
        private set

    fun fetchRecommendations() {
        viewModelScope.launch {
            recommendationsState = recommendationsState.copy(isLoading = true)
            try {
                val recommendations = repository.getRecommendations()
                recommendationsState = UIState(data = recommendations)
            } catch (e: Exception) {
                recommendationsState = UIState(error = e.message)
            }
        }
    }

    // Methods to create, update, delete recommendations can be added here
}
