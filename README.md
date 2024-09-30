# Referraly Backend

## Table of Contents

1. [Introduction](#introduction)
2. [System Architecture](#system-architecture)
3. [API Endpoints](#api-endpoints)
4. [Authentication and Authorization](#authentication-and-authorization)
5. [Database Schema](#database-schema)
6. [Environment Variables](#environment-variables)
7. [Development and Deployment](#development-and-deployment)
8. [Mobile App Integration](#mobile-app-integration)

## Introduction

Referraly is a recommendation platform that integrates with multiple affiliate programs. The backend is built using Next.js API routes and Vercel Postgres, providing a scalable and efficient serverless architecture.

## System Architecture

The backend is structured as follows:

- API Routes: Located in the `pages/api` directory
- Middleware: Located in the `middleware` directory
- Utility Functions: Located in the `utils` directory

The system uses JSON Web Tokens (JWT) for authentication and bcrypt for password hashing.

## API Endpoints

### User Management

- `POST /api/users/register`: User registration
- `POST /api/users/login`: User login
- `GET /api/users/profile`: Get user profile
- `PUT /api/users/profile`: Update user profile
- `PUT /api/users/gdpr-consent`: Update GDPR consent
- `PUT /api/users/language`: Update language preference

### Recommendations

- `GET /api/recommendations`: Get user recommendations
- `POST /api/recommendations`: Create a new recommendation
- `PUT /api/recommendations/[id]`: Update a recommendation
- `DELETE /api/recommendations/[id]`: Delete a recommendation

### Affiliate Programs

- `GET /api/affiliate/[programId]`: Get affiliate program details
- `POST /api/affiliate/generate`: Generate external affiliate ID
- `POST /api/affiliate/match`: Match content with affiliate programs

### Admin

- `GET /api/admin/dashboard`: Get admin dashboard data

### UI Messages

- `GET /api/ui-messages/[languageCode]`: Get UI messages for a specific language

## Authentication and Authorization

The system uses JWT for authentication. The `authMiddleware` function in `middleware/authMiddleware.ts` verifies the token and adds the user ID to the request body.

## Database Schema

The database uses Vercel Postgres and consists of the following tables:

### users

| Column Name         | Data Type                    | Constraints |
|---------------------|------------------------------|-------------|
| id                  | integer                      | PK          |
| username            | character varying(255)       | NOT NULL    |
| email               | character varying(255)       | NOT NULL    |
| password_hash       | character varying(255)       | NOT NULL    |
| first_name          | character varying(255)       | NOT NULL    |
| last_name           | character varying(255)       | NOT NULL    |
| gender              | character varying(50)        |             |
| phone_number        | character varying(20)        |             |
| date_of_birth       | date                         |             |
| address             | text                         |             |
| language_preference | character varying(10)        | DEFAULT 'en'|
| created_at          | timestamp without time zone  | DEFAULT NOW |
| updated_at          | timestamp without time zone  | DEFAULT NOW |
| last_login          | timestamp without time zone  |             |
| is_active           | boolean                      | DEFAULT true|
| gdpr_consent        | boolean                      | DEFAULT false|
| gdpr_consent_date   | timestamp without time zone  |             |
| role                | character varying(50)        | DEFAULT 'user'|

### recommendations

| Column Name | Data Type                   | Constraints |
|-------------|-----------------------------|-------------|
| id          | integer                     | PK          |
| user_id     | integer                     | FK (users)  |
| content     | text                        | NOT NULL    |
| program_id  | integer                     | FK (affiliate_programs) |
| created_at  | timestamp without time zone | DEFAULT NOW |
| updated_at  | timestamp without time zone | DEFAULT NOW |
| is_active   | boolean                     | DEFAULT true|

### affiliate_programs

| Column Name        | Data Type                   | Constraints |
|--------------------|-----------------------------|--------------------|
| id                 | integer                     | PK                 |
| name               | character varying(255)      | NOT NULL           |
| tags               | ARRAY                       |                    |
| shared_affiliate_id| character varying(255)      |                    |
| commission_rate    | numeric                     |                    |
| cookie_duration    | integer                     |                    |
| payout_threshold   | numeric                     |                    |
| website_url        | text                        |                    |
| created_at         | timestamp without time zone | DEFAULT NOW        |
| updated_at         | timestamp without time zone | DEFAULT NOW        |

### external_affiliate_ids

| Column Name | Data Type                   | Constraints |
|-------------|-----------------------------|--------------------|
| id          | integer                     | PK                 |
| user_id     | integer                     | FK (users)         |
| program_id  | integer                     | FK (affiliate_programs) |
| external_id | character varying(255)      | NOT NULL           |
| created_at  | timestamp without time zone | DEFAULT NOW        |
| updated_at  | timestamp without time zone | DEFAULT NOW        |

### referrals

| Column Name   | Data Type                   | Constraints |
|---------------|-----------------------------|--------------------|
| id            | integer                     | PK                 |
| user_id       | integer                     | FK (users)         |
| original_link | text                        | NOT NULL           |
| converted_link| text                        | NOT NULL           |
| timestamp     | timestamp without time zone | DEFAULT NOW        |

### ui_messages

| Column Name   | Data Type                   | Constraints |
|---------------|-----------------------------|--------------------|
| id            | integer                     | PK                 |
| message_key   | character varying(255)      | NOT NULL           |
| language_code | character varying(10)       | NOT NULL           |
| message_text  | text                        | NOT NULL           |
| created_at    | timestamp without time zone | DEFAULT NOW        |
| updated_at    | timestamp without time zone | DEFAULT NOW        |

The `ui_messages` table is the only table that needs to be populated with data before the application can run properly. This table contains all the user interface messages in different languages, allowing for easy localization of the application. Below are the SQL queries needed to populate this table with the initial set of messages:

```sql
INSERT INTO ui_messages (message_key, language_code, message_text, created_at, updated_at) VALUES
('gdpr_title', 'en', 'GDPR Consent', NOW(), NOW()),
('gdpr_title', 'es', 'Consentimiento GDPR', NOW(), NOW()),
('login_email_label', 'en', 'Email', NOW(), NOW()),
('login_button', 'en', 'Login', NOW(), NOW()),
('profile_address_label', 'es', 'Dirección', NOW(), NOW()),
('profile_save_button', 'en', 'Save', NOW(), NOW()),
('profile_save_button', 'es', 'Guardar', NOW(), NOW()),
('profile_change_language_button', 'en', 'Change Language', NOW(), NOW()),
('profile_change_language_button', 'es', 'Cambiar idioma', NOW(), NOW()),
('profile_logout_button', 'en', 'Logout', NOW(), NOW()),
('profile_logout_button', 'es', 'Cerrar sesión', NOW(), NOW()),
('profile_update_success', 'en', 'Profile updated successfully', NOW(), NOW()),
('profile_update_success', 'es', 'Perfil actualizado correctamente', NOW(), NOW()),
('gdpr_message', 'en', 'We need your consent to process your data...', NOW(), NOW()),
('gdpr_message', 'es', 'Necesitamos tu consentimiento para procesar tus datos...', NOW(), NOW()),
('recommendations_profile_button', 'es', 'Perfil', NOW(), NOW()),
('recommendation_detail_title', 'en', 'Recommendation Detail', NOW(), NOW()),
('recommendation_detail_title', 'es', 'Detalle de la recomendación', NOW(), NOW()),
('share_processing_message', 'en', 'Processing shared content...', NOW(), NOW()),
('share_processing_message', 'es', 'Procesando contenido compartido...', NOW(), NOW()),
('share_no_match_found', 'en', 'No matching affiliate program found', NOW(), NOW()),
('share_no_match_found', 'es', 'No se encontró un programa de afiliados coincidente', NOW(), NOW()),
('share_match_found', 'en', 'Match found: {programName}', NOW(), NOW()),
('share_match_found', 'es', 'Se encontró coincidencia: {programName}', NOW(), NOW()),
('login_title', 'en', 'Login', NOW(), NOW()),
('admin_dashboard_title', 'en', 'Admin Dashboard', NOW(), NOW()),
('admin_dashboard_title', 'es', 'Panel de administración', NOW(), NOW()),
('admin_total_users', 'en', 'Total Users: {count}', NOW(), NOW()),
('admin_total_users', 'es', 'Total de usuarios: {count}', NOW(), NOW()),
('admin_total_recommendations', 'en', 'Total Recommendations: {count}', NOW(), NOW()),
('admin_total_recommendations', 'es', 'Total de recomendaciones: {count}', NOW(), NOW()),
('admin_total_affiliate_programs', 'en', 'Total Affiliate Programs: {count}', NOW(), NOW()),
('admin_total_affiliate_programs', 'es', 'Total de programas de afiliados: {count}', NOW(), NOW()),
('error_generic', 'en', 'An error occurred. Please try again.', NOW(), NOW()),
('error_generic', 'es', 'Ocurrió un error. Por favor, inténtalo de nuevo.', NOW(), NOW()),
('error_network', 'en', 'Network error. Please check your internet connection.', NOW(), NOW()),
('error_network', 'es', 'Error de red. Por favor, verifica tu conexión a internet.', NOW(), NOW()),
('error_server', 'en', 'Server error. Please try again later.', NOW(), NOW()),
('error_server', 'es', 'Error del servidor. Por favor, inténtalo más tarde.', NOW(), NOW()),
('logout_confirmation', 'en', 'Are you sure you want to logout?', NOW(), NOW()),
('logout_confirmation', 'es', '¿Estás seguro de que deseas cerrar sesión?', NOW(), NOW()),
('delete_confirmation', 'en', 'Are you sure you want to delete this?', NOW(), NOW()),
('delete_confirmation', 'es', '¿Estás seguro de que deseas eliminar esto?', NOW(), NOW()),
('yes', 'es', 'Sí', NOW(), NOW()),
('no', 'en', 'No', NOW(), NOW()),
('no', 'es', 'No', NOW(), NOW()),
('recommendation_update_success', 'en', 'Recommendation updated successfully', NOW(), NOW()),
('recommendation_update_success', 'es', 'Recomendación actualizada correctamente', NOW(), NOW()),
('recommendation_delete_success', 'en', 'Recommendation deleted successfully', NOW(), NOW()),
('recommendation_delete_success', 'es', 'Recomendación eliminada correctamente', NOW(), NOW()),
('required_field', 'en', 'This field is required', NOW(), NOW()),
('required_field', 'es', 'Este campo es obligatorio', NOW(), NOW()),
('invalid_email', 'en', 'Invalid email address', NOW(), NOW()),
('invalid_email', 'es', 'Dirección de correo electrónico inválida', NOW(), NOW()),
('password_min_length', 'en', 'Password must be at least {minLength} characters', NOW(), NOW()),
('password_min_length', 'es', 'La contraseña debe tener al menos {minLength} caracteres', NOW(), NOW()),
('password_mismatch', 'en', 'Passwords do not match', NOW(), NOW()),
('password_mismatch', 'es', 'Las contraseñas no coinciden', NOW(), NOW()),
('loading', 'en', 'Loading...', NOW(), NOW()),
('loading', 'es', 'Cargando...', NOW(), NOW()),
('welcome_message', 'en', 'Welcome, {firstName}!', NOW(), NOW()),
('welcome_message', 'es', '¡Bienvenido, {firstName}!', NOW(), NOW()),
('login_title', 'es', 'Iniciar sesión', NOW(), NOW()),
('login_email_label', 'es', 'Correo electrónico', NOW(), NOW()),
('login_password_label', 'en', 'Password', NOW(), NOW()),
('login_password_label', 'es', 'Contraseña', NOW(), NOW()),
('login_button', 'es', 'Iniciar sesión', NOW(), NOW()),
('login_register_prompt', 'en', 'Don''t have an account? Register', NOW(), NOW()),
('login_register_prompt', 'es', '¿No tienes una cuenta? Regístrate', NOW(), NOW()),
('login_error_invalid_credentials', 'en', 'Invalid credentials', NOW(), NOW()),
('login_error_invalid_credentials', 'es', 'Credenciales inválidas', NOW(), NOW()),
('register_title', 'en', 'Register', NOW(), NOW()),
('register_title', 'es', 'Registrarse', NOW(), NOW()),
('register_username_label', 'en', 'Username', NOW(), NOW()),
('register_username_label', 'es', 'Nombre de usuario', NOW(), NOW()),
('register_email_label', 'en', 'Email', NOW(), NOW()),
('register_email_label', 'es', 'Correo electrónico', NOW(), NOW()),
('register_first_name_label', 'en', 'First Name', NOW(), NOW()),
('register_first_name_label', 'es', 'Nombre', NOW(), NOW()),
('register_last_name_label', 'en', 'Last Name', NOW(), NOW()),
('register_last_name_label', 'es', 'Apellido', NOW(), NOW()),
('register_password_label', 'en', 'Password', NOW(), NOW()),
('register_password_label', 'es', 'Contraseña', NOW(), NOW()),
('register_button', 'en', 'Register', NOW(), NOW()),
('register_button', 'es', 'Registrarse', NOW(), NOW()),
('register_error_user_exists', 'en', 'User already exists', NOW(), NOW()),
('register_error_user_exists', 'es', 'El usuario ya existe', NOW(), NOW()),
('profile_title', 'en', 'Profile', NOW(), NOW()),
('profile_title', 'es', 'Perfil', NOW(), NOW()),
('profile_first_name_label', 'en', 'First Name', NOW(), NOW()),
('profile_first_name_label', 'es', 'Nombre', NOW(), NOW()),
('profile_last_name_label', 'en', 'Last Name', NOW(), NOW()),
('profile_last_name_label', 'es', 'Apellido', NOW(), NOW()),
('profile_gender_label', 'en', 'Gender', NOW(), NOW()),
('profile_gender_label', 'es', 'Género', NOW(), NOW()),
('profile_phone_number_label', 'en', 'Phone Number', NOW(), NOW()),
('profile_phone_number_label', 'es', 'Número de teléfono', NOW(), NOW()),
('profile_date_of_birth_label', 'en', 'Date of Birth', NOW(), NOW()),
('profile_date_of_birth_label', 'es', 'Fecha de nacimiento', NOW(), NOW()),
('profile_address_label', 'en', 'Address', NOW(), NOW()),
('gdpr_consent_button', 'en', 'I Consent', NOW(), NOW()),
('gdpr_consent_button', 'es', 'Consiento', NOW(), NOW()),
('gdpr_consent_recorded', 'en', 'GDPR consent recorded', NOW(), NOW()),
('gdpr_consent_recorded', 'es', 'Consentimiento GDPR registrado', NOW(), NOW()),
('language_selection_title', 'en', 'Select Language', NOW(), NOW()),
('language_selection_title', 'es', 'Seleccionar idioma', NOW(), NOW()),
('language_english', 'en', 'English', NOW(), NOW()),
('language_english', 'es', 'Inglés', NOW(), NOW()),
('language_spanish', 'en', 'Spanish', NOW(), NOW()),
('language_spanish', 'es', 'Español', NOW(), NOW()),
('language_update_success', 'en', 'Language preference updated', NOW(), NOW()),
('language_update_success', 'es', 'Preferencia de idioma actualizada', NOW(), NOW()),
('recommendations_title', 'en', 'Recommendations', NOW(), NOW()),
('recommendations_title', 'es', 'Recomendaciones', NOW(), NOW()),
('recommendations_add_button', 'en', 'Add Recommendation', NOW(), NOW()),
('recommendations_add_button', 'es', 'Agregar recomendación', NOW(), NOW()),
('recommendations_profile_button', 'en', 'Profile', NOW(), NOW()),
('yes', 'en', 'Yes', NOW(), NOW());
```

These queries will populate the `ui_messages` table with all the necessary UI text in both English and Spanish. This table should be populated before the application is run for the first time to ensure proper localization functionality.

## Environment Variables

The following environment variables are required for the proper functioning of the Referraly backend:

### JWT_SECRET

- **Purpose**: This is the secret key used for JSON Web Token (JWT) generation and verification.
- **Usage**: In authentication processes, particularly in `utils/auth.ts`.
- **Example**: `JWT_SECRET=my_very_long_and_secure_random_string_for_jwt`
- **Why it's used**: To ensure the security and integrity of user authentication tokens.

### SECRET_KEY

- **Purpose**: This secret key is used for generating external affiliate IDs.
- **Usage**: In the `/api/affiliate/generate` endpoint.
- **Example**: `SECRET_KEY=another_very_long_and_secure_random_string`
- **Why it's used**: To create unique and secure external affiliate IDs that can't be easily guessed or replicated.

### SHARED_AFFILIATE_IDS

- **Purpose**: A boolean flag to enable or disable the use of shared affiliate IDs.
- **Usage**: Throughout the application where affiliate IDs are generated or used.
- **Example**: `SHARED_AFFILIATE_IDS=true`
- **Why it's used**: To control the affiliate ID generation strategy. 
- **Detailed explanation**: 
  - When set to "true" (initial setup): All users share 5 master affiliate IDs (one per program). This simplifies the system for the first iterations of the app, reducing complexity and API calls to affiliate programs.
  - When set to "false" (future implementation): The system will generate unique affiliate IDs for each user-program combination. This more advanced setup allows for better tracking and potentially higher commissions but requires integration with each affiliate program's API.

### AFFILIATE_ID_1 to AFFILIATE_ID_5

- **Purpose**: These variables store the master affiliate IDs for each of the five affiliate programs.
- **Usage**: When `SHARED_AFFILIATE_IDS` is set to "true", these IDs are used for all users across the platform.
- **Example**: 
  ```
  AFFILIATE_ID_1=aff_123456
  AFFILIATE_ID_2=partner_789012
  AFFILIATE_ID_3=ref_345678
  AFFILIATE_ID_4=associate_901234
  AFFILIATE_ID_5=promo_567890
  ```
- **Why they're used**: In the initial phase with shared affiliate IDs, these master IDs simplify tracking and management of affiliate links. They allow the platform to start operating without the complexity of individual user-program affiliate ID generation.

### AFFILIATE_API_KEY_1 to AFFILIATE_API_KEY_5

- **Purpose**: These variables store the API keys for each of the five affiliate programs.
- **Usage**: For future implementation when `SHARED_AFFILIATE_IDS` is set to "false". They will be used in API calls to the respective affiliate programs to generate unique user-specific affiliate IDs.
- **Example**: 
  ```
  AFFILIATE_API_KEY_1=abcdef123456
  AFFILIATE_API_KEY_2=ghijkl789012
  AFFILIATE_API_KEY_3=mnopqr345678
  AFFILIATE_API_KEY_4=stuvwx901234
  AFFILIATE_API_KEY_5=yzabcd567890
  ```
- **Why they're used**: To authenticate API requests to the affiliate programs securely, keeping the keys out of the codebase. In the future, these will be crucial for generating unique affiliate IDs for each user-program combination, allowing for more granular tracking and potentially higher commissions.

### ADMIN_USERS

- **Purpose**: A comma-separated list of email addresses for users who should have admin privileges.
- **Usage**: In the user registration process (`/api/users/register`).
- **Example**: `ADMIN_USERS=admin@example.com,superuser@example.com`
- **Why it's used**: To automatically assign admin roles to specific users upon registration, simplifying the admin user creation process.

### Additional Database-Related Environment Variables

When using Vercel Postgres, you typically don't need to set these manually as Vercel handles them, but they're important to be aware of:

- `POSTGRES_URL`: The connection URL for your Postgres database.
- `POSTGRES_PRISMA_URL`: A connection URL specifically formatted for Prisma ORM (if used).
- `POSTGRES_URL_NON_POOLING`: A non-pooling connection URL for direct database access.
- `POSTGRES_USER`: The database user.
- `POSTGRES_HOST`: The host address of your database.
- `POSTGRES_PASSWORD`: The password for your database user.
- `POSTGRES_DATABASE`: The name of your database.

These database-related variables are automatically set by Vercel when you link a Postgres database to your project.

## Development and Deployment

### Deployment

For deployment on Vercel:

1. Push your code to a GitHub repository.
2. Connect your repository to Vercel.
3. Set up environment variables in the Vercel dashboard:
   - Go to your project settings in the Vercel dashboard.
   - Navigate to the "Environment Variables" section.
   - Add each variable and its value.
4. Deploy your application.

Remember to never commit your `.env.local` file or any file containing actual secret values to version control. Always use placeholder values in example configurations and documentation.

## Mobile App Integration

To integrate a mobile app frontend with the Referraly backend, follow these guidelines for API usage and UI/UX design:

### API Integration

1. **Authentication**:
   - Use the `/api/users/login` endpoint to authenticate users.
   - Store the returned JWT token securely (e.g., in secure storage or keychain).
   - Include the JWT token in the `Authorization` header for all authenticated requests.

2. **User Management**:
   - Implement a registration flow using the `/api/users/register` endpoint.
   - Fetch and display user profile information using `/api/users/profile`.
   - Allow users to update their profile with `/api/users/profile` (PUT request).
   - Implement GDPR consent management using `/api/users/gdpr-consent`.
   - Allow language preference updates with `/api/users/language`.

3. **Recommendations**:
   - Fetch user recommendations using `/api/recommendations`.
   - Implement creation, updating, and deletion of recommendations using the respective endpoints.

4. **Affiliate Programs**:
   - Fetch affiliate program details when needed using `/api/affiliate/[programId]`.
   - Generate external affiliate IDs when required with `/api/affiliate/generate`.
   - Use `/api/affiliate/match` to suggest relevant affiliate programs for user content.

5. **Localization**:
   - Fetch UI messages for the user's preferred language using `/api/ui-messages/[languageCode]`.

### UI/UX Design

1. **Onboarding**:
   - Welcome screen
   - Registration form
   - Login screen
   - GDPR consent screen

2. **Main Navigation**:
   - Home/Feed
   - Create Recommendation
   - Profile
   - Settings

3. **Home/Feed Screen**:
   - List of user's recommendations
   - Pull-to-refresh functionality
   - Infinite scroll for pagination

4. **Create Recommendation Screen**:
   - Text input for recommendation content
   - Affiliate program selector (use `/api/affiliate/match` for suggestions)
   - Preview of generated affiliate link

5. **Profile Screen**:
   - Display user information
   - Edit profile button
   - List of user's active recommendations

6. **Settings Screen**:
   - Language preference selector
   - GDPR consent management
   - Logout option

7. **Recommendation Detail Screen**:
   - Display full recommendation content
   - Show associated affiliate program details
   - Edit and delete options for user's own recommendations

8. **Affiliate Program Detail Screen**:
   - Display program details (commission rate, payout threshold, etc.)
   - List of user's recommendations for this program

9. **Admin Dashboard** (for admin users):
   - Overview of platform statistics
   - User management features
   - Affiliate program management

### Best Practices

1. Implement proper error handling and display user-friendly error messages.
2. Use loading indicators for asynchronous operations.
3. Implement offline support where possible, syncing data when the connection is restored.
4. Ensure the app follows platform-specific design guidelines (Material Design for Android, Human Interface Guidelines for iOS).
5. Implement deep linking for easy sharing of recommendations.
6. Use secure storage for sensitive data like tokens and user information.
7. Implement analytics to track user engagement and app performance.

By following these guidelines, you can create a mobile app that effectively leverages the Referraly backend API and provides a user-friendly experience for managing recommendations and affiliate links.
