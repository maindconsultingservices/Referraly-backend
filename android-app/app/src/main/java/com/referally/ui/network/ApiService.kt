package com.referally.ui.network

import com.example.appname.model.*
import okhttp3.Interceptor
import okhttp3.OkHttpClient
import retrofit2.Response
import retrofit2.Retrofit
import retrofit2.converter.gson.GsonConverterFactory
import retrofit2.http.*

interface ApiService {

    @POST("api/users/login")
    suspend fun login(@Body credentials: Map<String, String>): Response<LoginResponse>

    @POST("api/users/register")
    suspend fun register(@Body userData: Map<String, String>): Response<Void>

    // Other API methods...

    companion object {
        private const val BASE_URL = "https://your-vercel-backend-url.com/"

        fun create(): ApiService {
            val client = OkHttpClient.Builder()
                .addInterceptor(AuthInterceptor())
                .build()

            return Retrofit.Builder()
                .baseUrl(BASE_URL)
                .client(client)
                .addConverterFactory(GsonConverterFactory.create())
                .build()
                .create(ApiService::class.java)
        }
    }
}

class AuthInterceptor : Interceptor {
    private val userPreferences = UserPreferences()

    override fun intercept(chain: Interceptor.Chain): okhttp3.Response {
        val token = runBlocking { userPreferences.authToken.first() }
        val request = if (token != null) {
            chain.request().newBuilder()
                .addHeader("Authorization", "Bearer $token")
                .build()
        } else {
            chain.request()
        }
        return chain.proceed(request)
    }
}
