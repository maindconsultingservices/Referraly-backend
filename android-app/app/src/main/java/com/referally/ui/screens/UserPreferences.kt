package com.example.appname.datastore

import android.content.Context
import androidx.datastore.preferences.core.*
import androidx.datastore.preferences.preferencesDataStore
import kotlinx.coroutines.flow.Flow
import kotlinx.coroutines.flow.map

class UserPreferences(context: Context) {
    private val Context.dataStore by preferencesDataStore("user_prefs")
    private val dataStore = context.dataStore

    val authToken: Flow<String?> = dataStore.data.map { it[AUTH_TOKEN] }
    val languagePreference: Flow<String?> = dataStore.data.map { it[LANGUAGE_PREFERENCE] }

    suspend fun saveAuthToken(token: String) {
        dataStore.edit { prefs -> prefs[AUTH_TOKEN] = token }
    }

    suspend fun saveLanguagePreference(language: String) {
        dataStore.edit { prefs -> prefs[LANGUAGE_PREFERENCE] = language }
    }

    companion object {
        val AUTH_TOKEN = stringPreferencesKey("auth_token")
        val LANGUAGE_PREFERENCE = stringPreferencesKey("language_preference")
    }
}
