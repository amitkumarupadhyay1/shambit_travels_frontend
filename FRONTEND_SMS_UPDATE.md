# Frontend SMS Password Reset Update

## Changes Made

Password reset forms have been updated to use phone numbers and SMS OTP instead of email.

## Files Modified

### 1. ForgotPasswordForm.tsx
**Location:** `src/components/auth/ForgotPasswordForm.tsx`

**Changes:**
- Changed input field from `email` to `phone`
- Updated validation schema to accept phone numbers (10-13 digits)
- Changed icon from `Mail` to `Phone`
- Updated placeholder text to show phone format examples
- Updated API call to send `phone` instead of `email`
- Updated error messages for phone-specific scenarios
- Updated success message to mention SMS
- Added helper text for phone number format

**API Endpoint:** `POST /api/auth/forgot-password/`
**Request Body:** `{ "phone": "+919876543210" }`

### 2. ResetPasswordForm.tsx
**Location:** `src/components/auth/ResetPasswordForm.tsx`

**Changes:**
- Changed input field from `email` to `phone`
- Updated validation schema to accept phone numbers
- Changed icon from `Mail` to `Phone`
- Updated URL parameter from `?email=` to `?phone=`
- Updated API call to send `phone` instead of `email`
- Changed "Reset Code" label to "OTP Code"
- Updated resend functionality to use phone
- Updated error messages for phone-specific scenarios
- Updated helper text to mention SMS

**API Endpoint:** `POST /api/auth/reset-password/`
**Request Body:**
```json
{
  "phone": "+919876543210",
  "otp": "123456",
  "password": "newpassword123",
  "password_confirm": "newpassword123"
}
```

## Phone Number Format

The forms accept phone numbers in these formats:
- `9876543210` (10 digits)
- `+919876543210` (with country code)
- `919876543210` (without + symbol)

**Validation:**
- Minimum 10 digits
- Maximum 13 characters (to accommodate country codes)
- Only numbers and + symbol allowed
- Regex: `/^[0-9+]{10,13}$/`

## User Experience Flow

### Forgot Password Flow:
1. User goes to `/forgot-password`
2. Enters phone number
3. Clicks "Send OTP via SMS"
4. Receives SMS with 6-digit OTP
5. Redirected to `/reset-password?phone=+919876543210`

### Reset Password Flow:
1. User on `/reset-password` page (with phone in URL)
2. Phone number pre-filled from URL parameter
3. Enters 6-digit OTP from SMS
4. Enters new password
5. Confirms new password
6. Clicks "Reset Password"
7. Redirected to `/login?reset=success`

## Testing

### Test Forgot Password:
1. Go to `http://localhost:3000/forgot-password`
2. Enter phone: `+919876543210` (or your test number)
3. Click "Send OTP via SMS"
4. Check phone for SMS
5. Should redirect to reset password page

### Test Reset Password:
1. On reset password page
2. Phone should be pre-filled
3. Enter OTP from SMS
4. Enter new password (min 8 characters)
5. Confirm password
6. Click "Reset Password"
7. Should redirect to login page

### Test Resend OTP:
1. On reset password page
2. Click "Resend OTP" button
3. Should receive new SMS
4. Green message appears: "New OTP sent to your phone"

## Error Handling

### Forgot Password Errors:
- **404:** "No account found with this phone number"
- **500:** "Failed to send SMS. Please try again or contact support."
- **Timeout:** "Request timed out. Please check your internet connection and try again."
- **Network:** "An unexpected error occurred. Please try again."

### Reset Password Errors:
- **400:** "Invalid or expired OTP. Please try again."
- **404:** "User not found. Please check your phone number."
- **Network:** "An unexpected error occurred. Please try again."

## UI/UX Improvements

### Visual Changes:
- Phone icon instead of Mail icon
- Updated placeholder text with phone format examples
- Helper text explaining phone number format
- "OTP Code" instead of "Reset Code"
- "Send OTP via SMS" button text
- Success messages mention SMS delivery

### Accessibility:
- Input type changed to `tel` for better mobile keyboard
- Pattern attribute for phone validation
- Clear error messages
- Loading states with spinner
- Disabled states during submission

## Deployment

### Environment Variables Required:
No new frontend environment variables needed. The existing `NEXT_PUBLIC_API_URL` is used.

### Build and Deploy:
```bash
# Install dependencies (if needed)
npm install

# Build for production
npm run build

# Start production server
npm start
```

### Vercel/Railway Deployment:
Changes will be automatically deployed when pushed to the main branch.

## Backward Compatibility

**Breaking Change:** This is a breaking change. Users who previously used email for password reset must now use their phone number.

**Migration Notes:**
- Existing users need to have phone numbers in their profiles
- Users without phone numbers cannot reset passwords
- Consider adding a "Update Phone Number" feature in user profile
- May need to communicate this change to existing users

## Future Enhancements

1. **Phone Number Verification:** Add phone verification during registration
2. **International Support:** Better handling of international phone formats
3. **SMS Delivery Status:** Show SMS delivery confirmation
4. **Alternative Methods:** Provide email fallback for users without phone access
5. **Rate Limiting:** Add visual feedback for rate limiting

## Support

### Common User Issues:

**"I didn't receive the SMS"**
- Check phone number is correct
- Check SMS inbox and spam
- Try resending OTP
- Verify phone has network coverage
- Contact support if issue persists

**"Invalid phone number"**
- Must be 10-13 digits
- Can include country code (+91)
- Only numbers and + allowed
- Try format: +919876543210

**"OTP expired"**
- OTP valid for 5 minutes only
- Request new OTP using "Resend OTP" button
- Enter OTP immediately after receiving

## Technical Details

### Dependencies:
- `react-hook-form` - Form handling
- `zod` - Schema validation
- `@hookform/resolvers/zod` - Zod integration
- `axios` - API calls
- `lucide-react` - Icons (Phone, Key, Lock, etc.)

### State Management:
- Local component state (useState)
- Form state (react-hook-form)
- No global state needed

### API Integration:
- Base URL from `process.env.NEXT_PUBLIC_API_URL`
- 30-second timeout for requests
- Proper error handling with try-catch
- Loading states during API calls

## Monitoring

After deployment, monitor:
1. Form submission success rate
2. SMS delivery rate (check Fast2SMS dashboard)
3. User error reports
4. API response times
5. Failed password reset attempts

## Rollback Plan

If issues occur:
1. Revert to previous commit
2. Redeploy frontend
3. Backend can remain as-is (supports both email and phone)
4. Communicate with users about temporary revert
