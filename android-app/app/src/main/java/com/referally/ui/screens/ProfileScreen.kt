package com.referally.ui.screens

import androidx.compose.foundation.layout.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.lifecycle.viewmodel.compose.viewModel
import androidx.navigation.NavHostController
import com.referally.ui.screens.viewmodel.ProfileViewModel

@Composable
fun ProfileScreen(navController: NavHostController, viewModel: ProfileViewModel = viewModel()) {
    val profileState = viewModel.profileState

    LaunchedEffect(Unit) {
        viewModel.fetchProfile()
    }

    if (profileState.isLoading) {
        CircularProgressIndicator()
    } else {
        Column(
            modifier = Modifier
                .fillMaxSize()
                .padding(16.dp)
        ) {
            Text(text = "Profile", style = MaterialTheme.typography.headlineMedium)
            Spacer(modifier = Modifier.height(16.dp))
            // Display and edit profile data
            OutlinedTextField(
                value = profileState.user?.firstName ?: "",
                onValueChange = { viewModel.updateFirstName(it) },
                label = { Text("First Name") }
            )
            // Similar fields for lastName, gender, etc.
            Spacer(modifier = Modifier.height(16.dp))
            Button(
                onClick = { viewModel.saveProfile() },
                modifier = Modifier.fillMaxWidth()
            ) {
                Text("Save")
            }
            Spacer(modifier = Modifier.height(8.dp))
            Button(
                onClick = { navController.navigate("language") },
                modifier = Modifier.fillMaxWidth()
            ) {
                Text("Change Language")
            }
            Spacer(modifier = Modifier.height(8.dp))
            Button(
                onClick = { /* Logout logic */ },
                modifier = Modifier.fillMaxWidth()
            ) {
                Text("Logout")
            }
        }
    }
}
