# Deployment & Activation Guide

## Pre-Deployment Checklist

### Local Testing

- [ ] Backend server starts without errors
- [ ] MongoDB connection successful
- [ ] Cleanup service logs appear: `[Cleanup Service] Started background cleanup job`
- [ ] Register new student account
- [ ] Verify email works
- [ ] Admin can promote verified student
- [ ] Dashboard stats updated correctly

### Environment Setup

- [ ] `.env` configured with all variables
- [ ] MAILJET_API_KEY and MAILJET_API_SECRET set
- [ ] MAILJET_FROM_EMAIL verified in Mailjet dashboard
- [ ] MongoDB Atlas connection string valid
- [ ] NODE_ENV set appropriately (development/production)

---

## Deployment Steps

### Step 1: Push Code Changes

```bash
# In your project root
git add .
git commit -m "Implement student role management with email verification and auto-cleanup"
git push -u origin main  # or your deployment branch
```

### Step 2: Update Backend on Render

**If using Render (recommended):**

1. Go to Render dashboard
2. Click on your backend service
3. Go to **Environment** tab
4. Verify these env vars are set:

   ```
   MAILJET_API_KEY = [your-key]
   MAILJET_API_SECRET = [your-secret]
   MAILJET_FROM_EMAIL = [verified-sender]
   MAILJET_FROM_NAME = NITKKR
   ```

5. Go to **Settings** tab
6. Click **Redeploy**
7. Wait for deployment to complete

**Render will:**

- Pull latest code from GitHub
- Run `npm install` (installs all dependencies)
- Start server with `npm start`
- Run cleanup service automatically

### Step 3: Verify Deployment

#### Check Backend Health

```bash
curl https://your-backend.onrender.com/api/health

# Response should be:
{
  "ok": true,
  "ts": "2026-03-16T10:00:00.000Z"
}
```

#### Check Cleanup Service Started

1. Go to Render dashboard
2. Click your backend service
3. Go to **Logs** tab
4. Look for:
   ```
   ✅ Connected to MongoDB
   [Cleanup Service] Started background cleanup job - runs every hour
   ```

### Step 4: Test Full Flow

#### Test Registration

```bash
curl -X POST https://your-backend.onrender.com/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@nitkkr.ac.in",
    "password": "TestPass123!",
    "name": "Test User"
  }'
```

#### Test Admin Endpoints

```bash
# Get verified students
curl -X GET https://your-backend.onrender.com/api/admin/students/verified \
  -H "Authorization: Bearer YOUR_ADMIN_TOKEN"

# Get cleanup stats
curl -X GET https://your-backend.onrender.com/api/admin/cleanup/stats \
  -H "Authorization: Bearer YOUR_ADMIN_TOKEN"
```

#### Test Email Verification

- Check email inbox for verification link
- Click link and verify it works
- Try login - should succeed

---

## Production Configuration

### Cleanup Job Settings (Recommended for Production)

Current settings in `backend/utils/cleanupService.js`:

```javascript
const CLEANUP_INTERVAL_MS = 60 * 60 * 1000; // Every 1 hour ✅
const UNVERIFIED_EXPIRY_HOURS = 48; // 2 days ✅
```

**These are production-ready. No changes needed.**

### Monitoring Production

#### Check Cleanup in Production Logs

```
# SSH into Render or check web dashboard logs
[Cleanup Service] Running cleanup job at 2026-03-16T10:00:00.000Z
[Cleanup Service] Deleted 5 unverified student account(s) older than 48 hours
```

#### Alert Setup (Optional)

- Set up Render webhooks to monitor errors
- Monitor cleanup logs for failures
- Create admin endpoint to check cleanup stats regularly

---

## Rollback Plan (If Issues)

### If Cleanup Service Causes Problems

**Option 1: Quick Disable (Keep Code)**
Edit `backend/index.js`:

```javascript
// COMMENT OUT these two lines temporarily:
// await connectDB();
// console.log("✅ Connected to MongoDB");

// startCleanupJob();  // ← Comment this out
```

**Option 2: Full Rollback to Previous Code**

```bash
git revert HEAD --no-edit
git push origin main
# Render auto-redeploys with previous version
```

**Option 3: Modify Cleanup Timing**
Edit `backend/utils/cleanupService.js`:

```javascript
// Make cleanup run less frequently (e.g., once a day)
const CLEANUP_INTERVAL_MS = 24 * 60 * 60 * 1000; // Every 24 hours instead of 1

// Or disable automatic cleanup (but keep manual trigger)
// Comment out: cleanupJobInterval = setInterval(...)
```

---

## Post-Deployment Verification

### Checklist for First Week

**Daily:**

- [ ] Check Render logs for errors
- [ ] Verify new student registrations work
- [ ] Check email deliveries (Mailjet dashboard)

**Weekly:**

- [ ] Monitor cleanup job logs
- [ ] Check admin endpoints still respond
- [ ] Verify promoted students can access member features
- [ ] Check database size (cleanup should reduce unverified accounts)

### Database Monitoring

```javascript
// Check total students by role
db.profiles.aggregate([{ $group: { _id: "$role", count: { $sum: 1 } } }]);

// Result should be:
// { _id: "student", count: 150 }
// { _id: "member", count: 45 }
// { _id: "post_holder", count: 12 }
// { _id: "admin", count: 1 }

// Check unverified students
db.profiles.countDocuments({
  role: "student",
  email_verified: false,
  created_at: { $gt: new Date(Date.now() - 48 * 60 * 60 * 1000) },
});
// Should be: 0 after 48+ hours
```

---

## Performance Impact

### Expected Impact

- **Memory**: Minimal - cleanup job runs in background
- **Database**: Reduced (old unverified accounts deleted)
- **API Calls**: 5 new endpoints (low traffic admin-only routes)
- **Email**: Same as before (Mailjet SMTP)

### Optimization Tips

- Cleanup runs every 1 hour - adjust if needed
- Filter queries optimized (indexes on role, email_verified)
- No blocking operations during cleanup

---

## Integration with Frontend

### No Changes Needed!

Frontend already supports:

- ✅ Student role in redirect logic
- ✅ Email verification status checks
- ✅ Member-only features

### Optional Enhancements (For Future)

- Add "pending verification" message on login page
- Show promotion status in student profile
- Display member benefits after promotion
- Countdown timer for account deletion (2 days)

---

## Admin Documentation for End Users

### For Student Management (Admin Only)

Create internal documentation:

**1. How to Promote a Student**

```
1. Log in to admin dashboard
2. Go to "Student Management" tab
3. Look for "Verified Students" section
4. Find the student to promote
5. Click "Promote to Member" or "Promote to Post Holder"
6. Confirm action
7. Student now has access to member features
```

**2. How to Monitor Unverified Accounts**

```
1. Go to "Student Management" tab
2. Click "View All Students"
3. Check "Stats" section:
   - Total Students: All accounts
   - Verified: Ready for promotion
   - Unverified: Will be deleted after 48 hours
```

**3. What is the Cleanup Schedule?**

```
- Runs every hour automatically
- Deletes unverified accounts older than 48 hours (2 days)
- Cannot be paused (designed for automatic cleanup)
- Can be manually triggered immediately if needed
```

---

## Database Migration (If Migrating from Old System)

### For Existing Users

```javascript
// Don't need to migrate! Existing data preserved:
// - role stays as "member" if already set
// - email_verified stays as true if already verified

// Only new registrations get role="student"
```

### If You Want to Convert All Old Members to Students (Optional)

```javascript
// WARNING: This breaks member functionality!
// Only do if you want fresh start

db.profiles.updateMany(
  { role: "member" },
  {
    $set: {
      role: "student",
      is_member: false,
    },
  }
);

// Then admins should re-promote them
```

---

## Support & Troubleshooting

### Issue: "Cleanup Service not running"

**Cause**: Server didn't start properly
**Solution**:

1. Check Render logs for error
2. Verify MongoDB connection
3. Restart service

### Issue: "Too many unverified students being deleted"

**Cause**: Cleanup threshold set too low
**Solution**: Increase `UNVERIFIED_EXPIRY_HOURS` to 72 (3 days) or 96 (4 days)

### Issue: "Students can't login even after verification"

**Cause**: Email verification endpoint not working
**Solution**:

1. Check Mailjet email delivery (Mailjet dashboard)
2. Verify token is being hashed correctly
3. Check database email_verified flag

### Issue: "Admin can't promote student"

**Cause**: Student not verified or already promoted
**Solution**:

1. Check email_verified = true in database
2. Check role = "student"
3. Resend verification email if needed

---

## Monitoring Queries

### Cleanup Service Health

```bash
# Check recent cleanup execution
curl https://your-backend.onrender.com/api/admin/cleanup/stats \
  -H "Authorization: Bearer ADMIN_TOKEN" | jq .

# Check for this in logs every hour:
# [Cleanup Service] Running cleanup job at [TIMESTAMP]
```

### Student Statistics

```bash
# Monitor student counts
curl https://your-backend.onrender.com/api/admin/stats \
  -H "Authorization: Bearer ADMIN_TOKEN" | jq .

# Should show:
# - higher verifiedStudents count over time
# - lower unverifiedStudents count over time (after 48h)
```

### Real-time Logs

```bash
# Render: Use web dashboard Logs tab
# Or SSH into Render and tail logs:
tail -f /var/log/render/app.log | grep "Cleanup Service"
```

---

## Scheduled Maintenance Windows (Optional)

### If You Need Downtime

1. **Pause Cleanup**: Comment out `startCleanupJob()` temporarily
2. **Do Maintenance**: Update code, migrate data, etc.
3. **Resume Cleanup**: Uncomment and restart
4. **Verify**: Check logs for normal operation

### Recommended Maintenance Schedule

- **Weekly**: Check cleanup logs for errors
- **Monthly**: Review student statistics
- **Quarterly**: Optimize cleanup thresholds based on data

---

## Success Metrics (Track These)

### After 1 Week

- ✅ 0 errors in cleanup job
- ✅ Unverified accounts > 48h deleted
- ✅ All admin endpoints responding
- ✅ Student registration flow working

### After 1 Month

- ✅ Student promoted count increasing
- ✅ Email verification rate > 80%
- ✅ Zero failed promotions
- ✅ Cleanup automatically removing spam accounts

### After 3 Months

- ✅ Role distribution stabilized
- ✅ Admin comfortable using promotion feature
- ✅ No unverified accounts lasting > 48h
- ✅ Database cleaning working as designed

---

## Questions & Support

### Common Admin Questions

**Q: Can I undo a promotion?**
A: Yes! Use the demote endpoint: `POST /api/admin/students/demote`

**Q: What if student wants to delete their account?**
A: Not implemented yet, but you can:

- Delete via `POST /api/admin/students/delete-unverified` (if unverified)
- Or remove manually from database (if verified)

**Q: How long do students have to verify?**
A: 48 hours before account auto-deleted. But they can re-register anytime.

**Q: Can cleanup be disabled?**
A: Yes, but not recommended. Comment out `startCleanupJob()` in index.js

---

## Final Deployment Verification

Before declaring deployment complete:

- [ ] Server starts without errors
- [ ] Cleanup service logs appear
- [ ] Student can register
- [ ] Verification email received
- [ ] Student can login after verification
- [ ] Admin can see student in dashboard
- [ ] Admin can promote student
- [ ] Stats updated correctly
- [ ] No errors in Render logs
- [ ] Mailjet showing email deliveries

✅ **If all checks pass: Deployment successful!** 🎉

---

**Need help? Check the troubleshooting guide above or review:**

- `STUDENT_ROLE_MANAGEMENT.md` - Complete system documentation
- `TESTING_GUIDE.md` - Detailed test scenarios
- `IMPLEMENTATION_SUMMARY.md` - Technical summary
