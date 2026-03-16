# Mailjet Migration Summary

## Changes Made

### 1. Backend Dependencies

**File**: `backend/package.json`

- ❌ Removed: `"nodemailer": "^6.10.1"`
- ✅ Added: `"node-mailjet": "^6.0.5"`

### 2. Email Service Implementation

**File**: `backend/utils/emailService.js`

- Completely rewritten to use Mailjet API
- 2 exported functions:
  - `sendVerificationEmail(email, name, link)` - For registration verification
  - `sendEmail(options)` - Generic email sending function
- Features:
  - HTML & Text email support
  - Professional email template with NITKKR branding
  - Email tracking enabled (opens & clicks)
  - Error handling & logging
  - Automatic fallback to environment variables

### 3. Environment Variables

**Files**: `.env`, `.env.example`

- Required (new):
  - `MAILJET_API_KEY`
  - `MAILJET_API_SECRET`
  - `MAILJET_FROM_EMAIL`
  - `MAILJET_FROM_NAME`
- Removed:
  - `SMTP_HOST`
  - `SMTP_PORT`
  - `SMTP_SECURE`
  - `SMTP_USER`
  - `SMTP_PASS`

### 4. No Controller Changes

**File**: `backend/controllers/authController.js`

- ✅ No changes needed!
- Function signature remains identical: `sendVerificationEmail(email, name, link)`
- Existing code works without modification

## Quick Start (5 Steps)

### Step 1: Create Mailjet Account

1. Go to https://www.mailjet.com
2. Sign up for free account
3. Verify your email

### Step 2: Get API Credentials

1. Log in to Mailjet dashboard
2. Settings → API Keys
3. Copy API Key and API Secret

### Step 3: Configure Sender Email

1. Settings → Senders & Domains → Sender Addresses
2. Click "Add sender address"
3. Enter email address (or verify Twitter/LinkedIn)
4. Check verification email and click link

### Step 4: Update Environment Variables

Add to `.env` (local) and Render dashboard:

```
MAILJET_API_KEY=your_api_key
MAILJET_API_SECRET=your_api_secret
MAILJET_FROM_EMAIL=noreply@nitkkr.ac.in
MAILJET_FROM_NAME=NITKKR
```

### Step 5: Install & Test

```bash
# In backend directory
npm install

# Test registration
npm run dev
# Post to /api/auth/register with @nitkkr.ac.in email
```

## Why This is Better

| Aspect                 | Nodemailer               | Mailjet              |
| ---------------------- | ------------------------ | -------------------- |
| Connection Type        | SMTP (TCP)               | HTTPS API            |
| Cloud Platform Support | ❌ Often blocked         | ✅ Always works      |
| Port Issues            | ❌ Render blocks 587/465 | ✅ Uses 443 (HTTPS)  |
| Setup Complexity       | ⚠️ Requires credentials  | ✅ Simple API keys   |
| Template Support       | ⚠️ Manual HTML           | ✅ Rich API support  |
| Email Tracking         | ❌ No                    | ✅ Built-in          |
| Reliability            | ⚠️ Gmail SMTP issues     | ✅ Enterprise grade  |
| Free Tier              | ⚠️ Unlimited but manual  | ✅ 200/day automated |

## Testing in Production (Render)

After deployment to Render:

1. Update Render environment variables:

   - `MAILJET_API_KEY`
   - `MAILJET_API_SECRET`
   - `MAILJET_FROM_EMAIL`
   - `MAILJET_FROM_NAME`

2. Render auto-redeploys with new env vars

3. Test registration:

   ```bash
   curl -X POST https://your-render-url.onrender.com/api/auth/register \
     -H "Content-Type: application/json" \
     -d '{
       "email": "test@nitkkr.ac.in",
       "password": "Test123!!",
       "name": "Test"
     }'
   ```

4. Check email inbox for verification link

## Troubleshooting

### Email not arriving

1. Check spam folder
2. Verify sender email in Mailjet dashboard
3. Check Mailjet Activity log for errors

### Invalid credentials error

1. Copy exact API Key and Secret from Mailjet
2. No extra spaces or characters
3. Restart server after updating .env

### "Email service timeout"

- This should NOT happen with Mailjet (API-based)
- If it does, check network connectivity to Mailjet API

## Mailjet Pricing

**Free Plan:**

- 200 emails/day
- Unlimited contacts
- Email support
- Perfect for development/testing

**Paid Plans:**

- $15+/month for higher volumes
- Includes technical support

See [Mailjet Pricing](https://www.mailjet.com/pricing) for details.

## Files Modified

1. ✅ `backend/package.json` - Dependency update
2. ✅ `backend/utils/emailService.js` - Complete rewrite
3. ✅ `backend/.env.example` - Template added
4. ✅ `MAILJET_SETUP.md` - Setup guide (NEW)
5. ✅ `MAILJET_MIGRATION.md` - This file (NEW)

## No Other Changes Needed

The following files remain unchanged and work correctly:

- `backend/controllers/authController.js` - Uses same `sendVerificationEmail()` signature
- `backend/models/authModel.js` - No email logic
- `backend/routes/authRoutes.js` - No changes
- `backend/schema/profileSchema.js` - No changes
- All frontend files - No changes
- All other backend services - No changes

## Next: Test the Flow

1. **Local Testing** (localhost:5000):

   - Register with @nitkkr.ac.in email
   - Check inbox for verification link
   - Click link and verify
   - Login with account

2. **Production Testing** (Render):

   - Update .env vars in Render dashboard
   - Repeat above steps

3. **Check Mailjet Analytics**:
   - Dashboard shows email delivery stats
   - View opens/clicks
   - Monitor bounce rates

**Everything is ready! Just add Mailjet credentials to .env and you're good to go.** 🚀
