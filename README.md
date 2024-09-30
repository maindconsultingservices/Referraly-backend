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
- **Why it's used**: To easily switch between shared affiliate IDs and individual user affiliate IDs, providing flexibility in the affiliate system.

### ADMIN_USERS

- **Purpose**: A comma-separated list of email addresses for users who should have admin privileges.
- **Usage**: In the user registration process (`/api/users/register`).
- **Example**: `ADMIN_USERS=admin@example.com,superuser@example.com`
- **Why it's used**: To automatically assign admin roles to specific users upon registration, simplifying the admin user creation process.

### AFFILIATE_ID_1 to AFFILIATE_ID_5

- **Purpose**: These variables store the actual affiliate IDs for each of the five affiliate programs.
- **Usage**: When generating external affiliate IDs and in affiliate-related operations.
- **Example**: 
  ```
  AFFILIATE_ID_1=aff_123456
  AFFILIATE_ID_2=partner_789012
  AFFILIATE_ID_3=ref_345678
  AFFILIATE_ID_4=associate_901234
  AFFILIATE_ID_5=promo_567890
  ```
- **Why they're used**: To keep the actual affiliate IDs secure and easily configurable without changing the code.

### AFFILIATE_API_KEY_1 to AFFILIATE_API_KEY_5

- **Purpose**: These variables store the API keys for each of the five affiliate programs.
- **Usage**: In API calls to the respective affiliate programs (not implemented in the current code, but prepared for future use).
- **Example**: 
  ```
  AFFILIATE_API_KEY_1=abcdef123456
  AFFILIATE_API_KEY_2=ghijkl789012
  AFFILIATE_API_KEY_3=mnopqr345678
  AFFILIATE_API_KEY_4=stuvwx901234
  AFFILIATE_API_KEY_5=yzabcd567890
  ```
- **Why they're used**: To authenticate API requests to the affiliate programs securely, keeping the keys out of the codebase.

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

## Mobile App Integration

This section outlines how a mobile app front-end should correctly leverage the API endpoints provided by this backend.

### Authentication Flow

1. **User Registration**:
   - Endpoint: `POST /api/users/register`
   - The app should collect user information and send it to this endpoint.
   - Store the returned token securely (e.g., in encrypted storage).

2. **User Login**:
   - Endpoint: `POST /api/users/login`
   - Send user credentials and store the returned token securely.
   - Use this token for all subsequent authenticated requests.

3. **Token Management**:
   - Include the token in the `Authorization` header of all authenticated requests.
   - Format: `Bearer <token>`
   - Implement token refresh logic if needed (endpoint not provided in current API).

### User Profile Management

1. **Fetch User Profile**:
   - Endpoint: `GET /api/users/profile`
   - Call this endpoint after successful login to get user details.

2. **Update User Profile**:
   - Endpoint: `PUT /api/users/profile`
   - Allow users to edit their profile information in the app.

3. **GDPR Consent**:
   - Endpoint: `PUT /api/users/gdpr-consent`
   - Implement a GDPR consent flow in the app and update the backend when user consents.

4. **Language Preference**:
   - Endpoint: `PUT /api/users/language`
   - Allow users to change their language preference in the app settings.

### Recommendations

1. **Fetch Recommendations**:
   - Endpoint: `GET /api/recommendations`
   - Use this to populate the main feed or recommendations list in the app.

2. **Create Recommendation**:
   - Endpoint: `POST /api/recommendations`
   - Implement a feature for users to create new recommendations.

3. **Update Recommendation**:
   - Endpoint: `PUT /api/recommendations/[id]`
   - Allow users to edit their own recommendations.

4. **Delete Recommendation**:
   - Endpoint: `DELETE /api/recommendations/[id]`
   - Provide an option for users to delete their recommendations.

### Affiliate Program Integration

1. **Fetch Affiliate Program Details**:
   - Endpoint: `GET /api/affiliate/[programId]`
   - Use this to display details about specific affiliate programs.

2. **Generate External Affiliate ID**:
   - Endpoint: `POST /api/affiliate/generate`
   - Call this when a user wants to participate in an affiliate program.

3. **Match Content with Affiliate Programs**:
   - Endpoint: `POST /api/affiliate/match`
   - Use this to suggest relevant affiliate programs based on user-generated content.

### Localization

1. **Fetch UI Messages**:
   - Endpoint: `GET /api/ui-messages/[languageCode]`
   - Call this endpoint when the app starts or when the user changes language.
   - Use the returned messages for all UI text in the app.

### Admin Features

1. **Admin Dashboard**:
   - Endpoint: `GET /api/admin/dashboard`
   - If implementing admin features in the mobile app, use this endpoint to fetch admin-specific data.
   - Ensure proper access control in the app UI based on user role.

### Best Practices

1. **Error Handling**: Implement robust error handling for all API calls. Display user-friendly error messages.
2. **Loading States**: Show loading indicators while waiting for API responses.
3. **Caching**: Implement appropriate caching strategies to reduce API calls and improve app performance.
4. **Offline Support**: Consider implementing offline support for critical features.
5. **Security**: Ensure all sensitive data is encrypted in transit and at rest.
6. **Rate Limiting**: Implement client-side rate limiting to prevent API abuse.
7. **Versioning**: Be prepared to handle API versioning in the future.

By following these guidelines, your mobile app can effectively integrate with the Referraly backend, providing a smooth and feature-rich experience for users.
