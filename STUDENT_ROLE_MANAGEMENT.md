# Student Role Management & Email Verification System

## Overview

This system implements a hierarchical role-based user management with automatic cleanup of unverified accounts. Users start as **students**, and admins can promote them to **members** or **post_holders** based on their performance and role.

## User Roles Hierarchy

```
┌─────────────┐
│    Admin    │ (System administrator, full access)
└─────────────┘
       ▲
       │ (Admin can promote/demote)
       │
┌─────────────────────────────────────┐
│  Member  ◄──────────►  Post Holder  │ (Promoted students)
└──────────────────────────────────────┘
       ▲
       │ (Verified email required)
       │
┌─────────────┐
│   Student   │ (Default role for new registrations)
└─────────────┘
```

## Key Features

### 1. **Default Role Assignment**

When a new user registers:

- ✅ Email must be `@nitkkr.ac.in` (NITKKR domain)
- ✅ Default role is **"student"**
- ✅ `email_verified` is set to `false`
- ✅ `is_member` is set to `false` (only members have this flag)

### 2. **Email Verification Required**

- Users receive a verification email with a 24-hour expiry token
- Login is **blocked** until email is verified
- Verified students can then be promoted by admins

### 3. **Student Promotion**

Admin can promote verified students to:

- **Member**: Regular promoted user
- **Post Holder**: Leadership position
- **Admin**: Administrative access (rare)

Requirements for promotion:

- ✅ Student must have **verified email**
- ✅ Only students can be promoted
- ✅ Sets `is_member = true` when promoted to member/post_holder

### 4. **Automatic Cleanup of Unverified Accounts**

- **Runs every 1 hour** in the background
- **Deletes** unverified student accounts older than **48 hours (2 days)**
- Cannot delete verified or admin accounts
- Configurable via `cleanupService.js`

### 5. **Admin Dashboard Integration**

New statistics available:

- `totalStudents`: Count of all students (any verification status)
- `verifiedStudents`: Count of verified students only
- `unverifiedStudents`: Count of unverified students pending deletion
- `totalMembers`: Promoted members
- `totalPostHolders`: Post holders
- `activeMembers`: Members + Post Holders combined

## Database Fields

### User Profile Document

```javascript
{
  _id: "uuid",
  email: "user@nitkkr.ac.in",
  password: "hashed",
  name: "John Doe",
  phone: "9876543210",
  branch: "CSE",
  year: "2024",
  roll_number: "123456",

  // NEW ROLE SYSTEM
  role: "student",              // student, member, post_holder, admin
  is_member: false,             // true if member or post_holder

  // EMAIL VERIFICATION
  email_verified: false,
  verification_token_hash: "sha256_hash",
  verification_token_expires_at: ISODate,

  created_at: ISODate,
  updated_at: ISODate
}
```

## API Endpoints

### Student Management (Admin Only)

#### 1. Get Verified Students

```
GET /api/admin/students/verified
Query params: ?branch=CSE&year=2024 (optional)
Response: Array of verified students
```

#### 2. Get All Students (Verified + Unverified)

```
GET /api/admin/students/all
Response: {
  students: [...],
  stats: {
    total: 150,
    verified: 140,
    unverified: 10
  }
}
```

#### 3. Promote Student to Member/Post Holder

```
POST /api/admin/students/promote
Body: {
  studentId: "user-id",
  newRole: "member" | "post_holder" | "admin"
}
Response: {
  message: "Student promoted to member successfully",
  studentId: "...",
  newRole: "member"
}
```

Requirements:

- ✅ Student must exist
- ✅ Student must have verified email
- ✅ Student must be in "student" role

#### 4. Demote User to Student

```
POST /api/admin/students/demote
Body: {
  userId: "user-id"
}
Response: {
  message: "User demoted to student successfully",
  userId: "...",
  newRole: "student"
}
```

Restrictions:

- ❌ Cannot demote admins

#### 5. Delete Unverified Student (Manual)

```
POST /api/admin/students/delete-unverified
Body: {
  studentId: "student-id"
}
Response: {
  message: "Unverified student account deleted successfully",
  studentId: "..."
}
```

Requirements:

- ✅ Account must be unverified
- ✅ Admin can only delete role "student"

### Cleanup Job Management

#### 1. Get Cleanup Statistics

```
GET /api/admin/cleanup/stats
Response: {
  stats: {
    totalUnverified: 50,
    expiredAndWillBeDeleted: 8,      // Older than 48 hours
    recentUnverified: 42,             // Less than 48 hours old
    expiryThresholdTime: "2026-03-14T...",
    nextCleanupInterval: "Every 60 minutes",
    unverifiedExpiryHours: 48
  }
}
```

#### 2. Trigger Manual Cleanup

```
POST /api/admin/cleanup/trigger
Response: {
  message: "Manual cleanup executed successfully...",
  deletedCount: 5,
  timestamp: "2026-03-16T..."
}
```

Useful for immediate cleanup instead of waiting for scheduled job.

## Business Logic Flow

### Registration Flow

```
User Registration
    ↓
NITKKR email regex check
    ↓
User created (role="student", email_verified=false)
    ↓
Verification email sent (24-hour token)
    ↓
User checks inbox → clicks link
    ↓
Email verified (email_verified=true)
    ↓
User can now login
```

### Promotion Flow

```
Verified Student
    ↓
Admin Dashboard → Student Management Tab
    ↓
Select student + click "Promote to Member"
    ↓
POST /api/admin/students/promote
    ↓
Backend checks:
  - Student exists? ✓
  - Email verified? ✓
  - Is "student" role? ✓
    ↓
Update: role="member", is_member=true
    ↓
Promotion successful
```

### Automatic Cleanup Flow

```
Server starts
    ↓
startCleanupJob() called
    ↓
performCleanup() runs immediately
    ↓
Scheduled to run every 1 hour
    ↓
Check for unverified students created > 48 hours ago
    ↓
Delete matching accounts
    ↓
Log results
```

## Configuration

### Cleanup Service Settings

File: `backend/utils/cleanupService.js`

```javascript
const CLEANUP_INTERVAL_MS = 60 * 60 * 1000; // Every hour
const UNVERIFIED_EXPIRY_HOURS = 48; // 2 days
```

To change:

- **Interval**: Modify `CLEANUP_INTERVAL_MS` (in milliseconds)
- **Expiry**: Modify `UNVERIFIED_EXPIRY_HOURS` (in hours)

## Example Workflow

### Day 1: New User Registration

```
1. User registers with nitkkr-email@google.com (tries wrong email format)
   ❌ BLOCKED: "Only @nitkkr.ac.in email addresses allowed"

2. User registers with john@nitkkr.ac.in + strong password
   ✅ Profile created:
      - role: "student"
      - email_verified: false
      - is_member: false

3. Verification email sent to john@nitkkr.ac.in
   Email includes: "Verify Email Address" button with token

4. User clicks email verification link
   ✅ Verified: email_verified = true

5. User logs in with credentials
   ✅ Login successful
   ✅ Redirected to member profile page
```

### Day 2-3: Admin Promotes Student

```
1. Admin logs in ashboard

2. Goes to "Student Management" tab

3. Sees verified students:
   - John Doe (verified ✓, role: student)

4. Clicks "Promote to Member"

5. Selects role "Member"

6. Clicks "Confirm"
   ✅ John is now Member
   ✅ Can access member features
```

### Day 3: Unverified Student Account Cleanup

```
1. User Alice registers @nitkkr.ac.in but doesn't verify email
   - created_at: 2026-03-14 10:00 AM
   - email_verified: false
   - role: "student"

2. Alice never checks verification email

3. 48 hours pass (2026-03-16 10:00 AM)

4. Cleanup job runs (scheduled every hour)
   ✅ Finds Alice's unverified account (> 48 hours old)
   ✅ Deletes her profile
   ✅ Logs: "Deleted 1 unverified student account(s)"

5. Alice can re-register if she wants
   (New registration with fresh 48-hour timer)
```

## Testing

### Test Student Promotion

```bash
# Verify a student exists with verified email
curl http://localhost:5000/api/admin/students/verified

# Promote first student to member
curl -X POST http://localhost:5000/api/admin/students/promote \
  -H "Content-Type: application/json" \
  -d '{
    "studentId": "student-uuid-here",
    "newRole": "member"
  }'
```

### Test Cleanup

```bash
# Check cleanup status
curl http://localhost:5000/api/admin/cleanup/stats

# Trigger manual cleanup
curl -X POST http://localhost:5000/api/admin/cleanup/trigger
```

## Security Notes

✅ **Only verified emails can be promoted** - Prevents automated spam accounts from elevation  
✅ **Admins have edit access only** - Can't delete verified accounts automatically  
✅ **Unverified cleanup is time-based** - Fair 48-hour window for verification  
✅ **Token hashing** - Verification tokens are SHA256 hashed before storage  
✅ **NITKKR domain restriction** - Only official institute emails allowed

## Troubleshooting

### "Cannot promote unverified student" Error

**Cause**: Student hasn't verified their email yet
**Solution**: Check that verification email was sent and clicked

### "User is not a student" Error

**Cause**: Trying to promote someone already promoted or an admin
**Solution**: Only students can be promoted

### Cleanup job not running

**Cause**: Server not started or cleanup service failed
**Solution**: Check logs for `[Cleanup Service]` messages

```bash
# Check console output for:
[Cleanup Service] Started background cleanup job
[Cleanup Service] Running cleanup job at ...
```

### Want to delay cleanup for 2 weeks instead of 2 days?

**Solution**: Change in `cleanupService.js`:

```javascript
const UNVERIFIED_EXPIRY_HOURS = 48; // Change to 336 (14 days * 24)
```

## Summary of Changes

### Files Created

1. ✅ `backend/utils/cleanupService.js` - Background cleanup job
2. ✅ `STUDENT_ROLE_MANAGEMENT.md` - This documentation

### Files Modified

1. ✅ `backend/models/authModel.js` - New role functions
2. ✅ `backend/controllers/adminController.js` - New admin endpoints
3. ✅ `backend/routes/adminRoutes.js` - New routes
4. ✅ `backend/index.js` - Initialize cleanup job on startup
5. ✅ `backend/controllers/authController.js` (Already had verification check)

### Role Changes

- ❌ **Removed**: Default role "member" for new users
- ✅ **Added**: Default role "student" for new users
- ✅ **Added**: Promotion from student to member/post_holder
- ✅ **Added**: Email verification requirement for promotion

## Next Steps

1. **Test registration** → Verify email → Try login ✓
2. **Test promotion** → Use admin endpoints to promote student ✓
3. **Test cleanup** → Wait 48+ hours or trigger manually ✓
4. **Monitor logs** → Check `[Cleanup Service]` messages ✓
