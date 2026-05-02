# Authentication System Guide

## Overview
The REVEURA application now has a fully functional signup and login system using localStorage.

## Features Implemented

### ✅ Sign Up
- **Email Validation**: Checks for valid email format
- **Password Validation**: Minimum 6 characters required
- **Password Matching**: Confirms password and confirm password match
- **Duplicate Check**: Prevents creating accounts with existing emails
- **Data Storage**: Stores user credentials securely in localStorage under `reveura_users`

### ✅ Sign In
- **Credential Validation**: Verifies email exists and password matches
- **Error Messages**: Shows "Invalid email or password" for wrong credentials
- **Success Feedback**: Displays success message before redirecting
- **Profile Management**: Creates/updates user profile in localStorage

### ✅ User Experience
- **Real-time Validation**: Errors clear as user types
- **Form Clearing**: Forms reset when switching between Sign In/Sign Up
- **Animated Messages**: Error and success messages with smooth animations
- **Responsive Design**: Works on all screen sizes

## How It Works

### Sign Up Flow
1. User enters email, password, and confirms password
2. System validates:
   - All fields are filled
   - Email format is valid
   - Password is at least 6 characters
   - Passwords match
   - Email doesn't already exist
3. If valid, creates user account in localStorage
4. Redirects to dashboard

### Sign In Flow
1. User enters email and password
2. System validates:
   - Fields are filled
   - Email format is valid
3. Checks localStorage for matching credentials
4. If valid, logs in and redirects to dashboard
5. If invalid, shows error message

## LocalStorage Structure

### Users Database
```javascript
// Key: 'reveura_users'
[
  {
    email: "user@example.com",
    password: "password123",
    createdAt: "2026-05-02T10:30:00.000Z"
  }
]
```

### User Profile
```javascript
// Key: 'reveura_user_profile'
{
  name: "user",
  email: "user@example.com",
  loginTime: "2026-05-02T10:30:00.000Z",
  isNewUser: true/false
}
```

## Testing the System

### Test Sign Up
1. Go to the login page
2. Click "Sign Up" tab
3. Enter: test@example.com / password123 / password123
4. Click "Create Account"
5. Should redirect to dashboard

### Test Sign In
1. Go to the login page
2. Click "Sign In" tab
3. Enter the credentials you used during signup
4. Click "Sign In Now"
5. Should redirect to dashboard

### Test Validation
- **Empty fields**: Try submitting without filling all fields
- **Invalid email**: Try "notanemail" - should show error
- **Short password**: Try "123" - should show error
- **Passwords mismatch**: Try different passwords in sign up
- **Wrong password**: Sign in with wrong password - should show "Invalid email or password"
- **Non-existent user**: Sign in with email that doesn't exist

## Error Messages

| Scenario | Error Message |
|----------|--------------|
| Empty fields | "All fields are required" (Sign Up) / "Email and password are required" (Sign In) |
| Invalid email | "Please enter a valid email address" |
| Short password | "Password must be at least 6 characters long" |
| Passwords don't match | "Passwords do not match" |
| User exists | "User already exists. Please sign in instead." |
| Wrong credentials | "Invalid email or password" |

## Success Messages

| Action | Success Message |
|--------|----------------|
| Sign Up | "Account created successfully! Redirecting..." |
| Sign In | "Login successful! Redirecting..." |

## Security Notes

⚠️ **Current Implementation**
- Passwords are stored in **plain text** in localStorage
- This is suitable for **development/demonstration** purposes only
- LocalStorage data is accessible via browser developer tools

⚠️ **For Production**
Consider implementing:
- Backend authentication API
- Password hashing (bcrypt, argon2)
- JWT tokens for session management
- HTTPS for secure transmission
- Rate limiting for login attempts
- Password reset functionality
- Two-factor authentication (2FA)

## Features to Add (Optional)

- [ ] Password strength indicator
- [ ] Email verification
- [ ] Forgot password functionality
- [ ] Session timeout
- [ ] Remember me functionality (already has UI)
- [ ] Social login integration (Google, Facebook, X)
- [ ] User profile editing
- [ ] Account deletion
- [ ] Login history tracking

## Browser Console Testing

Open browser console (F12) and try:

```javascript
// View all users
JSON.parse(localStorage.getItem('reveura_users'))

// View current user profile
JSON.parse(localStorage.getItem('reveura_user_profile'))

// Clear all users
localStorage.removeItem('reveura_users')

// Clear current session
localStorage.removeItem('reveura_user_profile')
```

## Troubleshooting

**Issue**: Can't login with correct credentials
- **Solution**: Check browser console for errors, verify localStorage has the user data

**Issue**: Getting "User already exists" but can't login
- **Solution**: Clear localStorage and try again

**Issue**: Page doesn't redirect after login
- **Solution**: Check browser console for navigation errors

**Issue**: Form doesn't clear when switching tabs
- **Solution**: This is now implemented - forms clear automatically

---

**Built with**: React, Next.js, TypeScript, Framer Motion, Tailwind CSS
**Storage**: Browser localStorage
**Status**: ✅ Fully Functional
