package com.referally.ui.screens

import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.lifecycle.viewmodel.compose.viewModel
import androidx.navigation.NavHostController
import com.referally.ui.viewmodel.RecommendationsViewModel

@Composable
fun RecommendationsListScreen(navController: NavHostController, viewModel: RecommendationsViewModel = viewModel()) {
    val recommendationsState = viewModel.recommendationsState

    LaunchedEffect(Unit) {
        viewModel.fetchRecommendations()
    }

    Column(modifier = Modifier.fillMaxSize()) {
        TopAppBar(
            title = { Text("Recommendations") },
            actions = {
                IconButton(onClick = { navController.navigate("profile") }) {
                    Icon(Icons.Default.Person, contentDescription = "Profile")
                }
            }
        )
        if (recommendationsState.isLoading) {
            CircularProgressIndicator()
        } else {
            LazyColumn {
                items(recommendationsState.recommendations) { recommendation ->
                    RecommendationItem(recommendation, navController)
                }
            }
        }
        FloatingActionButton(
            onClick = { /* Navigate to Create Recommendation Screen */ },
            modifier = Modifier
                .padding(16.dp)
                .align(alignment = Alignment.End)
        ) {
            Icon(Icons.Default.Add, contentDescription = "Add Recommendation")
        }
    }
}

@Composable
fun RecommendationItem(recommendation: Recommendation, navController: NavHostController) {
    Card(
        modifier = Modifier
            .fillMaxWidth()
            .padding(8.dp)
            .clickable { navController.navigate("recommendation/${recommendation.id}") }
    ) {
        Column(modifier = Modifier.padding(16.dp)) {
            Text(text = recommendation.content, style = MaterialTheme.typography.bodyLarge)
            // Additional details
        }
    }
}
