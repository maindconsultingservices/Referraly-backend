package com.example.appname.ui.screens

import androidx.compose.foundation.layout.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.navigation.NavHostController
import com.example.appname.viewmodel.GDPRViewModel

@Composable
fun GDPRConsentScreen(navController: NavHostController, viewModel: GDPRViewModel = viewModel()) {
    Column(
        modifier = Modifier
            .fillMaxSize()
            .padding(16.dp)
    ) {
        Text(text = "GDPR Consent", style = MaterialTheme.typography.headlineMedium)
        Spacer(modifier = Modifier.height(16.dp))
        Text(text = "We need your consent to process your data...")
        Spacer(modifier = Modifier.height(16.dp))
        Button(
            onClick = {
                viewModel.giveConsent()
                navController.navigate("recommendations")
            },
            modifier = Modifier.fillMaxWidth()
        ) {
            Text("I Consent")
        }
    }
}
