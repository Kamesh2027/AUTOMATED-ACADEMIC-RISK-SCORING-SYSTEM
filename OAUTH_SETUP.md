# Google OAuth Setup Guide

This guide explains how to set up Google OAuth authentication for the AARSS application.

## Prerequisites
- Google account
- Access to Google Cloud Console

## Steps to Configure Google OAuth

### 1. Create a Google Cloud Project

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Click "Select a Project" → "New Project"
3. Enter project name (e.g., "AARSS") and click "Create"
4. Wait for the project to be created and select it

### 2. Enable Google+ API

1. In the left sidebar, go to "APIs & Services" → "Library"
2. Search for "Google+ API"
3. Click on it and press "Enable"

### 3. Configure OAuth Consent Screen

1. Go to "APIs & Services" → "OAuth consent screen"
2. Select "External" (unless you have Google Workspace)
3. Click "Create"
4. Fill in the required fields:
   - **App name**: AARSS
   - **User support email**: Your email
   - **Developer contact information**: Your email
5. Click "Save and Continue"
6. Skip "Scopes" (click "Save and Continue")
7. Add test users if needed (during development)
8. Click "Save and Continue"

### 4. Create OAuth 2.0 Credentials

1. Go to "APIs & Services" → "Credentials"
2. Click "Create Credentials" → "OAuth client ID"
3. Select "Web application"
4. Fill in the details:
   - **Name**: AARSS Web Client
   - **Authorized JavaScript origins**: 
     - http://localhost:5173 (for development)
     - Your production frontend URL (for production)
   - **Authorized redirect URIs**:
     - http://localhost:5000/api/auth/google/callback (for development)
     - Your production backend URL + /api/auth/google/callback (for production)
5. Click "Create"
6. Copy the **Client ID** and **Client Secret**

### 5. Configure Backend Environment Variables

1. Navigate to the `backend` folder
2. Copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```
3. Edit `.env` file and add your OAuth credentials:
   ```env
   GOOGLE_CLIENT_ID=your-client-id-from-step-4
   GOOGLE_CLIENT_SECRET=your-client-secret-from-step-4
   GOOGLE_CALLBACK_URL=http://localhost:5000/api/auth/google/callback
   ```

### 6. Update Frontend URL

Make sure the `FRONTEND_URL` in your `.env` matches your frontend URL:
```env
FRONTEND_URL=http://localhost:5173
```

### 7. Restart the Backend Server

After updating the `.env` file:
```bash
cd backend
npm start
```

## How OAuth Works in AARSS

1. User clicks "Sign in with Google" on the login page
2. User is redirected to Google's authentication page
3. User grants permission to the app
4. Google redirects back to the backend callback URL
5. Backend creates or finds the user in the database
6. Backend redirects to frontend with user data
7. Frontend stores user data and redirects to appropriate dashboard

## Default User Role

By default, new users created via OAuth are assigned the "student" role. You can customize this in the `backend/config/passport.js` file.

## Security Notes

- Never commit your `.env` file to version control
- Use strong, random strings for SESSION_SECRET in production
- Always use HTTPS in production
- Regularly rotate your OAuth secrets
- Set `NODE_ENV=production` in production environment

## Troubleshooting

### "Redirect URI mismatch" error
- Ensure the redirect URI in Google Cloud Console exactly matches the one in your `.env` file
- Check for trailing slashes
- Verify HTTP vs HTTPS

### OAuth not working
- Check that all environment variables are set correctly
- Ensure the backend server has restarted after `.env` changes
- Verify that the Google+ API is enabled
- Check browser console for errors

### Users not being created
- Check MongoDB connection
- Verify User model has `googleId` field
- Check backend logs for errors

## Production Deployment

When deploying to production:

1. Update OAuth redirect URIs in Google Cloud Console to include production URLs
2. Update `.env` variables:
   ```env
   NODE_ENV=production
   FRONTEND_URL=https://your-frontend-domain.com
   GOOGLE_CALLBACK_URL=https://your-backend-domain.com/api/auth/google/callback
   ```
3. Ensure CORS settings in `backend/server.js` include your production domain
4. Use environment variables provided by your hosting platform (Render, Heroku, etc.)
