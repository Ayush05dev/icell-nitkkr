# Mailjet Email Service Setup Guide

## Overview

This project now uses **Mailjet** for sending email verification messages instead of Nodemailer SMTP. Mailjet is a reliable email service that works seamlessly on cloud platforms like Render, Vercel, and Heroku.

## Why Mailjet?

- ✅ **Reliable HTTPS API**: No SMTP connection issues
- ✅ **Works on Cloud Platforms**: No port blocking on Render, Heroku, etc.
- ✅ **Email Tracking**: Built-in open and click tracking
- ✅ **Templates**: Simple to use API
- ✅ **Free Tier**: 200 emails/day on free account (sufficient for testing)
- ✅ **Production Ready**: Excellent for scaling

## Setup Steps

### 1. Create a Mailjet Account

1. Go to [Mailjet.com](https://www.mailjet.com)
2. Click "Sign Up" and create a free account
3. Verify your email address
4. Complete the registration process

### 2. Get API Credentials

1. Log in to your Mailjet dashboard
2. Go to **Settings** → **API Keys**
3. You'll see your **API Key** and **API Secret** (Master API Key)
4. Copy both - you'll need them for environment variables

### 3. Configure Sender Email

Before sending emails, you need to verify or configure a sender email address:

#### Option A: Verify Your Email (Free)

1. Go to **Settings** → **Senders & Domains** → **Sender Addresses**
2. Click "Add sender address"
3. Enter your email (e.g., `noreply@yourcompany.com`)
4. Mailjet will send a verification link
5. Click the link in the email to verify

#### Option B: Add a Custom Domain

1. Go to **Settings** → **Senders & Domains** → **Domains**
2. Click "Add new domain"
3. Follow DNS configuration instructions (more advanced)

**For NITKKR:**

- Sender Email: Use an email you control (e.g., `noreply@nitkkr.ac.in` if available, or your personal email for testing)
- Sender Name: "NITKKR" or "NIT Kurukshetra"

### 4. Environment Variables

Add the following to your `.env` file (in the `backend/` directory):

```env
# Mailjet Configuration
MAILJET_API_KEY=your_api_key_here
MAILJET_API_SECRET=your_api_secret_here
MAILJET_FROM_EMAIL=noreply@nitkkr.ac.in
MAILJET_FROM_NAME=NITKKR

# Alternative: Keep SMTP_FROM if you prefer (Mailjet will use this if MAILJET_FROM_EMAIL not set)
SMTP_FROM=noreply@nitkkr.ac.in
```

**Important:**

- Replace `your_api_key_here` with your actual API Key
- Replace `your_api_secret_here` with your actual API Secret
- Use a verified sender email address

### 5. Install Dependencies

In the `backend/` directory, run:

```bash
npm install node-mailjet
```

Or if you're updating an existing project:

```bash
npm update
```

### 6. Test Email Sending

You can test the email service quickly:

1. Run the development server:

   ```bash
   npm run dev
   ```

2. Make a registration request to `/api/auth/register`:

   ```bash
   curl -X POST http://localhost:5000/api/auth/register \
     -H "Content-Type: application/json" \
     -d '{
       "email": "test@nitkkr.ac.in",
       "password": "TestPassword123",
       "name": "Test User"
     }'
   ```

3. Check your email inbox (or spam folder) for the verification link

4. Click the link to verify your email

### 7. Production Deployment

#### For Render:

1. Go to your Render backend dashboard
2. Click on your service
3. Go to **Environment** tab
4. Add the environment variables:

   - `MAILJET_API_KEY` = your API key
   - `MAILJET_API_SECRET` = your API secret
   - `MAILJET_FROM_EMAIL` = your verified sender email
   - `MAILJET_FROM_NAME` = NITKKR

5. Click "Save Changes"
6. Service will auto-redeploy with new environment variables

#### For Other Platforms (Heroku, Railway, etc.):

1. Open platform dashboard
2. Navigate to Environment/Config Variables section
3. Add the same 4 environment variables
4. Redeploy or restart the application

#### Important for Gmail Sender Email (Testing Only):

If testing with a Gmail account temporarily:

1. Enable "Less secure app access" (not recommended for production)
2. Or use an App Password: [Create App Password](https://myaccount.google.com/apppasswords)
3. Set `MAILJET_FROM_EMAIL` to your Gmail address

## Mailjet Free Tier Limits

- **Email Limit**: 200 emails/day
- **Contacts**: Unlimited
- **API Requests**: Unlimited
- **Email Retention**: 90 days
- **Support**: Community forum

For production with higher volume, upgrade to a paid plan ($15+/month).

## Common Issues & Troubleshooting

### Issue: "Invalid sender address"

**Solution**: Verify the sender email in Mailjet dashboard under Settings → Senders & Domains

### Issue: "API Key not found" error

**Solution**:

- Check `.env` file contains `MAILJET_API_KEY` and `MAILJET_API_SECRET`
- Ensure no typos in variable names
- Restart the server after adding env vars

### Issue: Email not received

**Check**:

1. Spam/Junk folder
2. Recipient email address is correct
3. Sender email is verified in Mailjet
4. Check Mailjet dashboard → Activity → Sent emails for delivery status

### Issue: "Email service timeout" (old error)

**Solution**: This is fixed! Mailjet uses HTTP API (not SMTP), so no timeouts on Render/cloud platforms.

## API Reference

### sendVerificationEmail()

```javascript
import { sendVerificationEmail } from "../utils/emailService.js";

await sendVerificationEmail(
  recipientEmail, // "user@nitkkr.ac.in"
  recipientName, // "John Doe"
  verificationLink // "https://your-backend.com/api/auth/verify-email?token=..."
);
```

### sendEmail() (Generic)

```javascript
import { sendEmail } from "../utils/emailService.js";

await sendEmail({
  to: "recipient@example.com",
  subject: "Your Subject",
  htmlContent: "<html>...</html>",
  textContent: "Text version",
  fromEmail: "noreply@nitkkr.ac.in", // Optional
  fromName: "NITKKR", // Optional
});
```

## Monitoring & Analytics

In Mailjet dashboard, you can:

1. **View sent emails**: Settings → Activity
2. **Track opens**: See which users opened verification emails
3. **Track clicks**: See which users clicked the verification link
4. **Monitor delivery**: Check bounce rates, spam complaints
5. **API statistics**: Usage over time

## Migration from Nodemailer

This project has been migrated from Nodemailer SMTP to Mailjet. Changes:

- ✅ Replaced `nodemailer` with `node-mailjet` in package.json
- ✅ Rewrote `backend/utils/emailService.js` to use Mailjet API
- ✅ Updated environment variables
- ✅ Same function signatures - no changes needed in controllers

## Next Steps

1. Create Mailjet account and get API credentials
2. Add environment variables to `.env` and Render dashboard
3. Run `npm install` in backend directory
4. Test registration flow with an email
5. Verify email in your inbox and complete registration

## Support

For issues with Mailjet:

- [Mailjet Documentation](https://dev.mailjet.com)
- [Mailjet API Reference](https://dev.mailjet.com/email/guides)
- [Mailjet Community](https://mailjet.com/community)

For issues with this integration:

- Check the logs in `backend/utils/emailService.js`
- Verify environment variables are set correctly
- Check Mailjet activity/logs for error details
