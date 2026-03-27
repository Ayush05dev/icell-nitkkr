# Frontend Role System - Test & Deployment Guide

## Summary of Frontend Changes

### Files Modified

1. **frontend/src/pages/Profile/StudentProfile.jsx** - NEW
2. **frontend/src/pages/Profile/MemberProfile.jsx** - UPDATED
3. **frontend/src/pages/auth/login.jsx** - UPDATED
4. **frontend/src/App.jsx** - UPDATED
5. **frontend/src/components/layout/Navbar.jsx** - UPDATED

### What Was Fixed

**Before (Broken):**

- Students were redirected to `/profile` and shown as "member"
- No student-specific profile page
- Navbar didn't distinguish between student and member
- One profile page for all non-admin users

**After (Fixed):**

- ✅ Students redirect to `/student-profile` with student badge
- ✅ Members redirect to `/member-profile` with member badge
- ✅ Admin/Post-holders redirect to `/admin`
- ✅ Navbar shows role badge and role-appropriate menu
- ✅ Each role has dedicated UI

## Role-Based Routing Flow

```
Login Success
    ↓
Backend returns user object with role
    ↓
login.jsx checks role:
    ├─ admin → /admin (AdminDashboard)
    ├─ post_holder → /admin (AdminDashboard)
    ├─ member → /member-profile (MemberProfile)
    ├─ student → /student-profile (StudentProfile)
    └─ unknown → / (Home)
```

## Role-Specific Pages

### Student Profile (`/student-profile`)

- **Shows:** Student role badge (blue), email verification status, member promotion info
- **Redirects:** Non-students to correct page
- **Components:** ProfileCard, AttendanceCard, AccountInfoCard, StudentInfo
- **Access:** Only students

```
When a student logs in:
1. Login → role checks
2. Sees /student-profile
3. Page shows "Student" badge
4. Can see email verification status
5. Information on how to get promoted
```

### Member Profile (`/member-profile`)

- **Shows:** Member role badge (pink), certificates, full member features
- **Redirects:** Non-members to correct page
- **Components:** ProfileCard, AttendanceCard, AccountInfoCard, CertificatesCard
- **Access:** Only members

```
When a member (promoted student) logs in:
1. Login → role checks
2. Sees /member-profile
3. Page shows "Member" badge
4. Can download certificates
5. Full member experience
```

### Admin Dashboard (`/admin`)

- **Shows:** Admin controls and statistics
- **Redirects:** Non-admins to correct page
- **Access:** Admin and Post-holder

## Navbar Updates

**User Menu (Click profile icon):**

```
┌─────────────────────┐
│ Role: student       │  ← New role indicator
├─────────────────────┤
│ Student Profile     │  ← Role-appropriate menu
├─────────────────────┤
│ Logout              │
└─────────────────────┘
```

**Menu Items by Role:**

- Student → "Student Profile" → `/student-profile`
- Member → "Member Profile" → `/member-profile`
- Admin/Post-holder → "Admin Dashboard" → `/admin/dashboard`

## Testing Scenarios

### Test 1: New Student Registration

```
1. Go to /register_new
2. Fill form with NITKKR email (e.g., user@nitkkr.ac.in)
3. Register
4. Check email for verification link
5. Click verification link
6. Try to login
   Expected: Redirected to /student-profile
   Expected: See "Student" badge
   Expected: Email shows "Verified"
```

### Test 2: Student Login Before Email Verification

```
1. Register new student
2. Try to login before clicking email verification
   Expected: Login fails or shows "Email not verified" message
   OR if allowed: /student-profile shows "Pending verification"
```

### Test 3: Admin Promotes Student to Member

```
1. Login as admin
2. Go to /admin/students
3. Find unverified student (wait 48 hours for cleanup)
4. Click "Promote to Member"
5. Original student logs out and back in
   Expected: Redirected to /member-profile
   Expected: See "Member" badge
   Expected: Different UI layout
```

### Test 4: Switch Between Member and Post-Holder

```
1. Admin promotes student to member
2. Admin changes role to post_holder (via changePromotedUserRole)
3. Post-holder logs out and back in
   Expected: Redirected to /admin
   Expected: See admin interface
4. Admin changes back to member
5. Member logs out and back in
   Expected: Redirected to /member-profile
   Expected: See member badge
```

### Test 5: Demotion to Student

```
1. Admin demotes member back to student
2. Student logs out and back in
   Expected: Redirected to /student-profile
   Expected: See "Student" badge
   Expected: Message: "Not yet promoted"
```

### Test 6: Admin Login

```
1. Login as admin
   Expected: Redirected to /admin
   Expected: Navbar shows "Admin Dashboard" menu
   Expected: Access to all admin features
```

### Test 7: Navbar Role Display

```
For each role:
1. Student:
   - Navbar menu shows "Role: student"
   - Profile button says "Student Profile"
2. Member:
   - Navbar menu shows "Role: member"
   - Profile button says "Member Profile"
3. Post-holder:
   - Navbar menu shows "Role: post_holder"
   - Redirects to Admin Dashboard
4. Admin:
   - Navbar menu shows "Role: admin"
   - Admin Dashboard button shown
```

### Test 8: URL Access Restrictions

```
1. Student tries to access /member-profile
   Expected: Auto-redirect to /student-profile
2. Member tries to access /student-profile
   Expected: Auto-redirect to /member-profile
3. Non-admin tries to access /admin
   Expected: May show dashboard but limited access
```

## Deployment Checklist

### Before Deploying to Production

- [ ] Run `npm run build` in frontend folder
- [ ] Check for build errors
- [ ] Test all role redirects locally
- [ ] Verify Navbar role display
- [ ] Test promotion flow
- [ ] Test member profile loads correctly
- [ ] Test student profile loads correctly
- [ ] Confirm admin dashboard still works

### Deployment Steps

1. **Push to GitHub:**

   ```bash
   git add .
   git commit -m "Frontend: Update role system - student/member/post_holder separation"
   git push origin main
   ```

2. **Frontend Deployment (Vercel):**

   ```
   - Vercel auto-deploys on git push
   - Check deployment status at vercel.com
   - Wait for build to complete
   - Test live deployment
   ```

3. **Verify Deployment:**
   - Test student login on production
   - Test member login on production
   - Test admin promotion on production
   - Check Navbar role display

## Rollback Plan

If issues occur:

1. **Quick Rollback:**

   ```bash
   git revert HEAD
   git push origin main
   ```

2. **Manual Fixes:**
   - Check browser console for errors
   - Verify AuthContext returns role field
   - Confirm API returns correct role
   - Check route paths exist in App.jsx

## Troubleshooting

### Issue: Student redirects to /profile instead of /student-profile

**Solution:**

- Check browser console for errors
- Verify login.jsx redirect logic
- Confirm role field in localStorage
- Check network tab for login response role

### Issue: Navbar doesn't show role badge

**Solution:**

- Verify user state in AuthContext
- Check Navbar imports
- Verify Navbar gets user object with role field

### Issue: Page shows wrong role badge

**Solution:**

- Check component receive correct user.role
- Verify localStorage user object
- Confirm backend returns correct role

### Issue: Redirect loops (page keeps redirecting)

**Solution:**

- Check useEffect dependencies in profile pages
- Verify redirect conditions
- Check user role value matches expected string

## Key Code References

### Login Redirect (frontend/src/pages/auth/login.jsx)

```javascript
if (loggedInUser?.role === "admin") {
  navigate("/admin");
} else if (loggedInUser?.role === "post_holder") {
  navigate("/admin");
} else if (loggedInUser?.role === "member") {
  navigate("/member-profile");
} else if (loggedInUser?.role === "student") {
  navigate("/student-profile");
} else {
  navigate("/");
}
```

### StudentProfile Redirect (frontend/src/pages/Profile/StudentProfile.jsx)

```javascript
if (user.role !== "student") {
  if (user.role === "member") {
    navigate("/member-profile");
  } else if (user.role === "admin" || user.role === "post_holder") {
    navigate("/admin");
  }
  return;
}
```

### Routes (frontend/src/App.jsx)

```javascript
<Route path="/student-profile" element={<StudentProfile />} />
<Route path="/member-profile" element={<MemberProfile />} />
```

## Next Steps

1. Deploy frontend to Vercel
2. Test all scenarios in production
3. Monitor error logs
4. Gather user feedback on role display
5. Consider adding role-specific features:
   - Student dashboard with promotion timeline
   - Member-only certificate download
   - Post-holder approval workflows

## Support Notes

- All changes are backward compatible (old /profile still works)
- Backend role system unchanged
- No API contract changes
- All existing endpoints still work
