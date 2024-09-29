package com.referally.ui.screens

import androidx.compose.foundation.layout.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.lifecycle.viewmodel.compose.viewModel
import androidx.navigation.NavHostController
import com.referally.ui.viewmodel.LanguageViewModel

@Composable
fun LanguageSelectionScreen(navController: NavHostController, viewModel: LanguageViewModel = viewModel()) {
    val languages = listOf("en", "es")
    var selectedLanguage by remember { mutableStateOf(viewModel.currentLanguage) }

    Column(
        modifier = Modifier
            .fillMaxSize()
            .padding(16.dp)
    ) {
        Text(text = "Select Language", style = MaterialTheme.typography.headlineMedium)
        Spacer(modifier = Modifier.height(16.dp))
        languages.forEach { language ->
            Row(
                modifier = Modifier
                    .fillMaxWidth()
                    .clickable {
                        selectedLanguage = language
                        viewModel.changeLanguage(language)
                    }
                    .padding(8.dp),
                verticalAlignment = Alignment.CenterVertically
            ) {
                RadioButton(
                    selected = selectedLanguage == language,
                    onClick = {
                        selectedLanguage = language
                        viewModel.changeLanguage(language)
                    }
                )
                Text(text = if (language == "en") "English" else "Spanish")
            }
        }
    }
}
