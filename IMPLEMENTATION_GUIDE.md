# ICELL Website - Implementation Guide

## Complete Feature Implementation (Mar 15, 2026)

---

## 📋 Overview

This document outlines all the features implemented for the ICELL website, including:

- User Profile Pages
- Team Management Pages
- Student Management System (Admin)
- Attendance Tracking System
- Role-Based Access Control (Admin, Post Holder, Member)

---

## 🗄️ Database Schema - Supabase Setup

### 1. **Profiles Table** (Existing - Extended)

```sql
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  role TEXT DEFAULT 'member' CHECK (role IN ('admin', 'post_holder', 'member')),
  is_member BOOLEAN DEFAULT false,
  branch TEXT,
  year TEXT CHECK (year IN ('1st', '2nd', '3rd', '4th')),
  roll_number TEXT UNIQUE,
  post_position TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes
CREATE INDEX profiles_role_idx ON profiles(role);
CREATE INDEX profiles_branch_idx ON profiles(branch);
CREATE INDEX profiles_year_idx ON profiles(year);
CREATE INDEX profiles_is_member_idx ON profiles(is_member);
```

### 2. **Attendance Table** (New)

```sql
CREATE TABLE attendance (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  session TEXT DEFAULT '1',
  status TEXT NOT NULL CHECK (status IN ('present', 'absent', 'leave')),
  marked_by TEXT DEFAULT 'admin',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(student_id, date, session)
);

-- Indexes
CREATE INDEX attendance_student_id_idx ON attendance(student_id);
CREATE INDEX attendance_date_idx ON attendance(date);
CREATE INDEX attendance_status_idx ON attendance(status);
```

### 3. **Team Table** (Existing - Extended)

Add these columns to the existing team table:

```sql
ALTER TABLE team ADD COLUMN IF NOT EXISTS team_head TEXT;
ALTER TABLE team ADD COLUMN IF NOT EXISTS what_we_do TEXT;
ALTER TABLE team ADD COLUMN IF NOT EXISTS description TEXT;
ALTER TABLE team ADD COLUMN IF NOT EXISTS member_count INTEGER;
```

---

## 🔐 Authentication & Authorization

### User Roles

1. **Admin**: Full access to all management features

   - Can manage students (add, delete, promote)
   - Can mark attendance
   - Can manage teams
   - Can approve blogs, newsletters, events

2. **Post Holder**: Limited admin access

   - Can mark attendance for students
   - Can view students
   - Post position displayed in profile

3. **Member**: Regular user access
   - Can view own profile
   - Can view teams and post holders
   - Can write blogs

---

## 🎯 Backend Implementation

### New Routes

#### Student Routes (`/api/students`)

- `GET /api/students` - Get all students (filter by branch/year)
- `GET /api/students/:id` - Get single student
- `POST /api/students` - Add new student (admin only)
- `DELETE /api/students/:id` - Delete student (admin only)
- `PUT /api/students/:id/promote` - Promote to post holder (admin only)
- `PUT /api/students/:id/demote` - Demote from post holder (admin only)
- `GET /api/students/post-holders` - Get all post holders (public)

#### Attendance Routes (`/api/attendance`)

- `POST /api/attendance/mark` - Mark single attendance (admin/post holder)
- `GET /api/attendance/student/:id` - Get student attendance (student/admin)
- `GET /api/attendance/student/:id/summary` - Get attendance summary
- `POST /api/attendance/bulk-mark` - Bulk mark attendance (admin/post holder)
- `GET /api/attendance/report/range` - Get attendance report (admin/post holder)

### Middleware

1. **verifyUser** - Verifies JWT token and loads user profile
2. **isAdmin** - Checks if user role is 'admin'
3. **isAdminOrPostHolder** - Checks if user is admin or post_holder

---

## 🎨 Frontend Implementation

### New Pages

#### 1. **ProfilePage** (`/profile`)

- Display user profile information
- Show role, branch, year, roll number
- Logout functionality
- Protected route (requires authentication)

**Features:**

- Avatar with gradient
- Role-based information display
- Account creation date
- Member status

#### 2. **TeamPage** (`/team`)

- Display all teams in the organization
- Show team head information
- Display what each team does
- List post holders
- Public accessible page

**Features:**

- Team selection interface
- Team details display
- Team lead information
- Post holder listing
- Call-to-action for joining

#### 3. **AdminStudents** (`/admin/students`)

- Complete student management dashboard
- Search, filter by branch/year
- Add new students
- Delete students
- Promote to post holder
- Demote from post holder

**Features:**

- Advanced search
- Multi-filter support
- Bulk actions ready
- Role display and management
- Student statistics

#### 4. **AdminAttendance** (`/admin/attendance`)

- Mark attendance for students
- Filter by date, branch, year
- Quick mark all/clear all actions
- Attendance statistics
- Bulk attendance marking

**Features:**

- Date-based attendance
- Dynamic filtering
- Real-time statistics
- Status tracking (Present/Absent/Leave)
- Attendance history

### Navigation Updates

**Navbar** - Updated to include:

- Link to `/team` in main navigation
- Profile page link in user menu
- Admin links only for admin users

**AdminDashboard** - Added admin navigation bar with links to:

- Blogs
- Students
- Attendance
- Teams
- Events
- Newsletters
- Gallery

---

## 📊 Data Models

### Student Model (`studentModel.js`)

```javascript
-getAllStudents() -
  getStudentsByBranch(branch) -
  getStudentsByYear(year) -
  getStudentsByBranchAndYear(branch, year) -
  getStudentById(studentId) -
  addStudent(studentData) -
  deleteStudent(studentId) -
  promoteToPostHolder(studentId, position) -
  demoteFromPostHolder(studentId) -
  getAllPostHolders() -
  getPostHoldersByPosition(position);
```

### Attendance Model (`attendanceModel.js`)

```javascript
-markAttendance(studentId, session, status) -
  getStudentAttendance(studentId, startDate, endDate) -
  getAttendanceByDate(date, branch, year) -
  getAttendanceSummary(studentId) -
  bulkMarkAttendance(attendanceData) -
  getAttendanceReport(startDate, endDate, branch, year);
```

---

## 🔄 API Request Examples

### Add Student

```bash
POST /api/students
Content-Type: application/json
Authorization: Bearer <token>

{
  "name": "John Doe",
  "email": "john@college.edu",
  "password": "securePassword123",
  "branch": "CSE",
  "year": "2nd",
  "roll_number": "2021CS001"
}
```

### Mark Attendance

```bash
POST /api/attendance/mark
Content-Type: application/json
Authorization: Bearer <token>

{
  "studentId": "uuid-here",
  "session": "1",
  "status": "present"
}
```

### Promote Student

```bash
PUT /api/students/:studentId/promote
Content-Type: application/json
Authorization: Bearer <token>

{
  "position": "President"
}
```

### Get Attendance Report

```bash
GET /api/attendance/report/range?startDate=2026-03-01&endDate=2026-03-31&branch=CSE
Authorization: Bearer <token>
```

---

## 🚀 Setup Instructions

### 1. Database Setup (Supabase)

1. Create the new tables using the SQL provided above
2. Set up Row Level Security (RLS) policies:
   - Users can view/update their own profile
   - Admins can view/update all profiles
   - Attendance is readable by admin and post holders

### 2. Backend Configuration

1. Ensure `.env` file in backend has:

   ```
   PORT=5000
   SUPABASE_URL=your-supabase-url
   SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
   ```

2. Install dependencies: `npm install`

3. Run: `npm run dev`

### 3. Frontend Configuration

1. Ensure `.env.local` in frontend (if needed):

   ```
   VITE_SUPABASE_URL=your-supabase-url
   VITE_SUPABASE_ANON_KEY=your-anon-key
   ```

2. Install dependencies: `npm install`

3. Run: `npm run dev`

---

## 📁 File Structure

### Backend

```
backend/
├── models/
│   ├── authModel.js (updated)
│   ├── studentModel.js (new)
│   └── attendanceModel.js (new)
├── controllers/
│   ├── authController.js (updated)
│   ├── studentController.js (new)
│   └── attendanceController.js (new)
├── routes/
│   ├── authRoutes.js
│   ├── studentRoutes.js (new)
│   └── attendanceRoutes.js (new)
├── middleware/
│   ├── authMiddleware.js
│   └── adminMiddleware.js
└── index.js (updated with new routes)
```

### Frontend

```
frontend/src/
├── pages/
│   ├── ProfilePage.jsx (new)
│   ├── TeamPage.jsx (new)
│   └── admin/
│       ├── AdminStudents.jsx (new)
│       ├── AdminAttendance.jsx (new)
│       └── AdminDashboard.jsx (updated)
├── components/
│   └── layout/
│       └── Navbar.jsx (updated)
└── App.jsx (updated with new routes)
```

---

## 🔑 Key Features Implementation

### 1. Role-Based Access Control

- Middleware checks user role before allowing access
- Post holders have limited admin capabilities
- Members have read-only access to most resources

### 2. Student Management

- Add students with branch, year, roll number
- Search and filter students
- Promote/demote students to/from post holders
- Delete students from the system

### 3. Attendance System

- Mark attendance by date
- Filter by branch and year
- Bulk attendance marking
- Generate attendance reports
- Attendance summary per student

### 4. Team Management

- Display team information
- Show team head
- List team members (post holders)
- Display what each team does

### 5. User Profiles

- Personal profile page for each user
- Display role and position
- Show member status
- Account creation date

---

## 🧪 Testing Checklist

- [ ] Create admin user
- [ ] Create post holder user
- [ ] Create member user
- [ ] Add student via admin panel
- [ ] Delete student
- [ ] Promote student to post holder
- [ ] Mark attendance
- [ ] Generate attendance report
- [ ] View user profile
- [ ] View team page
- [ ] Test all role-based access controls
- [ ] Verify database constraints

---

## 🔒 Security Considerations

1. **Authentication**: JWT tokens verified via Supabase
2. **Authorization**: Role-based access control on all endpoints
3. **Data Validation**: Input validation on all requests
4. **SQL Injection**: Parameterized queries via Supabase client
5. **CORS**: Configured for localhost and production URLs

---

## 📋 Constants Used

### Branches

- CSE (Computer Science)
- ECE (Electronics & Communication)
- ME (Mechanical Engineering)
- CIVIL (Civil Engineering)
- EEE (Electrical Engineering)
- BT (Biotechnology)

### Years

- 1st Year
- 2nd Year
- 3rd Year
- 4th Year

### Positions

- President
- Vice President
- Secretary
- Treasurer
- Event Lead
- Design Lead
- Tech Lead
- Member

### Attendance Status

- present
- absent
- leave

### User Roles

- admin
- post_holder
- member

---

## 📞 Support

For issues or questions:

1. Check error logs in browser console
2. Verify Supabase connection
3. Check API endpoints in backend logs
4. Verify JWT token is valid
5. Check user role in database

---

## ✅ Implementation Status

✅ Backend Models & Controllers
✅ Backend Routes
✅ Frontend Pages
✅ Navigation Updates
✅ Authentication & Authorization
✅ Attendance Tracking
✅ Student Management
✅ Team Management
✅ User Profiles
✅ Admin Dashboard

**All features fully implemented and ready for database setup and testing.**
