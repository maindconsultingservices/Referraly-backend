package com.referally.ui.model

import androidx.room.Entity
import androidx.room.PrimaryKey

@Entity
data class Recommendation(
    @PrimaryKey val id: Int,
    val content: String,
    val userId: Int,
    val programId: Int,
    val isActive: Boolean
)
