package com.referally.ui.model

data class LoginResponse(
    val token: String,
    val languagePreference: String,
    val role: String
)
