package com.example.appname.model

data class LoginResponse(
    val token: String,
    val languagePreference: String,
    val role: String
)
