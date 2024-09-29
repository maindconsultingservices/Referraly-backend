package com.referally.ui.screens

import androidx.compose.foundation.layout.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.lifecycle.viewmodel.compose.viewModel
import com.referally.ui.viewmodel.AdminViewModel

@Composable
fun AdminDashboardScreen(navController: NavHostController, viewModel: AdminViewModel = viewModel()) {
    val dashboardState = viewModel.dashboardState

    LaunchedEffect(Unit) {
        viewModel.fetchDashboardData()
    }

    if (dashboardState.isLoading) {
        CircularProgressIndicator()
    } else {
        Column(modifier = Modifier.fillMaxSize().padding(16.dp)) {
            Text(text = "Admin Dashboard", style = MaterialTheme.typography.headlineMedium)
            Spacer(modifier = Modifier.height(16.dp))
            Text(text = "Total Users: ${dashboardState.data?.usersCount}")
            Text(text = "Total Recommendations: ${dashboardState.data?.recommendationsCount}")
            Text(text = "Total Affiliate Programs: ${dashboardState.data?.affiliateProgramsCount}")
            // Display data in an appealing way
        }
    }
}
