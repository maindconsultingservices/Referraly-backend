override fun onCreate(savedInstanceState: Bundle?) {
    super.onCreate(savedInstanceState)
    val sharedText = intent?.getStringExtra(Intent.EXTRA_TEXT)
    setContent {
        AppTheme {
            if (sharedText != null) {
                // Navigate to ShareProcessingScreen with sharedText
            } else {
                AppNavigation()
            }
        }
    }
}
