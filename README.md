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

[Database schema section remains unchanged]

## Environment Variables

[Environment variables section remains unchanged]

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
