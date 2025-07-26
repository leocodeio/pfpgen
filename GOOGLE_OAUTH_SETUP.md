# Google OAuth Setup Guide

## Quick Setup Instructions

1. **Visit Google Cloud Console**: https://console.cloud.google.com/
2. **Create a new project** or select existing one
3. **Enable APIs**:
   - Go to "APIs & Services" > "Library"
   - Search and enable "Google+ API" or "Google Identity"

4. **Create OAuth Credentials**:
   - Go to "APIs & Services" > "Credentials"
   - Click "Create Credentials" > "OAuth 2.0 Client IDs"
   - Application type: "Web application"
   - Name: "PFPGen Development"
   - **Authorized JavaScript origins**:
     ```
     http://localhost:3001
     ```
   - **Authorized redirect URIs**:
     ```
     http://localhost:3001/api/auth/callback/google
     ```
5. **Copy credentials to .env.local**:
   ```bash
   GOOGLE_CLIENT_ID="your-actual-client-id-here"
   GOOGLE_CLIENT_SECRET="your-actual-client-secret-here"
   ```

## After Setup

- Restart your development server
- Test the "Sign In with Google" button
- You should be redirected to Google's OAuth flow

## Troubleshooting

- Make sure the redirect URI exactly matches what's in Google Console
- Ensure both Client ID and Secret are set correctly
- Check that the Google+ API is enabled for your project
