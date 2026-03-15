# ICELL Website - Quick Reference

## New Features & Endpoints

---

## 🌐 Frontend Routes

### User Pages

| Route      | Component   | Access        | Description                            |
| ---------- | ----------- | ------------- | -------------------------------------- |
| `/profile` | ProfilePage | Authenticated | User profile page with personal info   |
| `/team`    | TeamPage    | Public        | Teams page with team heads and members |

### Admin Pages

| Route               | Component       | Access           | Description                            |
| ------------------- | --------------- | ---------------- | -------------------------------------- |
| `/admin/students`   | AdminStudents   | Admin Only       | Manage students (add, delete, promote) |
| `/admin/attendance` | AdminAttendance | Admin/PostHolder | Mark attendance, generate reports      |

---

## 🔌 Backend API Endpoints

### Students (`/api/students`)

| Method | Endpoint                     | Auth | Role   | Description                             |
| ------ | ---------------------------- | ---- | ------ | --------------------------------------- |
| GET    | `/api/students`              | ✅   | All    | Get all students (filter: branch, year) |
| GET    | `/api/students/:id`          | ✅   | All    | Get single student                      |
| POST   | `/api/students`              | ✅   | Admin  | Add new student                         |
| DELETE | `/api/students/:id`          | ✅   | Admin  | Delete student                          |
| PUT    | `/api/students/:id/promote`  | ✅   | Admin  | Promote to post holder                  |
| PUT    | `/api/students/:id/demote`   | ✅   | Admin  | Demote from post holder                 |
| GET    | `/api/students/post-holders` | ❌   | Public | Get all post holders                    |

### Attendance (`/api/attendance`)

| Method | Endpoint                              | Auth | Role             | Description                           |
| ------ | ------------------------------------- | ---- | ---------------- | ------------------------------------- |
| POST   | `/api/attendance/mark`                | ✅   | Admin/PostHolder | Mark single attendance                |
| GET    | `/api/attendance/student/:id`         | ✅   | User/Admin       | Get student attendance (30d default)  |
| GET    | `/api/attendance/student/:id/summary` | ✅   | User/Admin       | Get attendance percentage             |
| POST   | `/api/attendance/bulk-mark`           | ✅   | Admin/PostHolder | Mark attendance for multiple students |
| GET    | `/api/attendance/report/range`        | ✅   | Admin/PostHolder | Generate attendance report            |

---

## 📊 Database Tables

### profiles (Extended)

```
- id (UUID, Primary Key)
- name (Text)
- email (Text)
- role (Text: admin, post_holder, member)
- is_member (Boolean)
- branch (Text: CSE, ECE, ME, CIVIL, EEE, BT)
- year (Text: 1st, 2nd, 3rd, 4th)
- roll_number (Text, Unique)
- post_position (Text)
- created_at (Timestamp)
```

### attendance (New)

```
- id (UUID, Primary Key)
- student_id (UUID, Foreign Key → profiles)
- date (Date)
- session (Text)
- status (Text: present, absent, leave)
- marked_by (Text)
- created_at (Timestamp)
- updated_at (Timestamp)
- UNIQUE(student_id, date, session)
```

### team (Extended)

```
- id (already exists)
- name (already exists)
- team_head (Text, NEW)
- what_we_do (Text, NEW)
- description (Text, NEW)
- member_count (Integer, NEW)
- created_at (already exists)
```

---

## 🧩 Component Structure

### ProfilePage.jsx

```javascript
{
  - useAuth() for user data
  - Fetches profile from Supabase
  - Displays user information
  - Logout button
  - Protected route
}
```

### TeamPage.jsx

```javascript
{
  - Displays team list
  - Shows selected team details
  - Lists team head
  - Shows post holders from database
  - Public accessible
}
```

### AdminStudents.jsx

```javascript
{
  - Filters: Branch, Year, Search
  - Add new student (form modal)
  - Delete student (confirmation)
  - Promote to post holder (dropdown)
  - Demote from post holder
  - Table of all students
  - Admin only route
}
```

### AdminAttendance.jsx

```javascript
{
  - Date picker
  - Filters: Branch, Year, Search
  - Quick actions (Mark all, Clear all)
  - Statistics dashboard
  - Attendance marking UI
  - Bulk save functionality
  - Admin/PostHolder only route
}
```

---

## 🔐 Authorization Levels

### Public Access (No Auth Required)

- `/team`
- `/api/students/post-holders`

### Authenticated Users (Any Role)

- `/profile`
- `/api/students` (GET)

### Admin Only

- `/admin/students`
- `/api/students` (POST, DELETE)
- `/api/students/:id/promote`
- `/api/students/:id/demote`

### Admin & Post Holders

- `/admin/attendance`
- `/api/attendance/*` (all endpoints)

---

## 🛠️ Development Tips

### Adding a New Student

```javascript
const response = await fetch("http://localhost:5000/api/students", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  },
  body: JSON.stringify({
    name: "John Doe",
    email: "john@college.edu",
    password: "secure123",
    branch: "CSE",
    year: "2nd",
    roll_number: "2021CS001",
  }),
});
```

### Marking Attendance

```javascript
const response = await fetch("http://localhost:5000/api/attendance/mark", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  },
  body: JSON.stringify({
    studentId: "uuid-here",
    session: "1",
    status: "present",
  }),
});
```

### Getting Students by Filter

```javascript
const response = await fetch(
  "http://localhost:5000/api/students?branch=CSE&year=2nd",
  {
    headers: { Authorization: `Bearer ${token}` },
  }
);
```

---

## 📝 Common Errors & Solutions

| Error            | Cause                    | Solution                                     |
| ---------------- | ------------------------ | -------------------------------------------- |
| 401 Unauthorized | Invalid/Missing token    | Login again, check token in LocalStorage     |
| 403 Forbidden    | Insufficient permissions | Check user role, needs admin for this action |
| 400 Bad Request  | Missing required fields  | Verify all required fields in request body   |
| 404 Not Found    | Resource doesn't exist   | Check student ID, make sure student exists   |
| CORS Error       | Frontend URL not allowed | Add to CORS allowlist in backend             |

---

## 🧪 Test Scenarios

### Scenario 1: Admin Student Management

1. Login as admin
2. Go to `/admin/students`
3. Add new student (fill form)
4. Search/filter students
5. Promote student to post holder
6. Delete student

### Scenario 2: Attendance Marking

1. Login as admin/post-holder
2. Go to `/admin/attendance`
3. Select date and filters
4. Mark attendance for multiple students
5. Save and verify

### Scenario 3: User Profile

1. Login as any user
2. Click profile in navbar
3. View personal information
4. Verify role and position displayed correctly

### Scenario 4: Team Viewing

1. Navigate to `/team` (public)
2. Select different teams
3. View team head information
4. See post holders listed
5. Read team description

---

## 🚀 Deployment Checklist

- [ ] Database tables created in Supabase
- [ ] Row Level Security policies configured
- [ ] Backend `.env` configured
- [ ] Frontend `.env.local` configured
- [ ] All routes tested locally
- [ ] All API endpoints responding
- [ ] Authorization working correctly
- [ ] CORS configured for production domain
- [ ] Frontend built: `npm run build`
- [ ] Deployed to hosting service

---

## 📞 API Testing Tools

Use Postman or similar tools to test:

1. **Student Endpoints**

   - Collection: Students
   - Pre-populate Bearer token in Authorization

2. **Attendance Endpoints**

   - Collection: Attendance
   - Test with current date

3. **Profile Endpoints**
   - Get user profile from token

---

## 🎯 Next Steps

1. ✅ Set up Supabase tables
2. ✅ Test all API endpoints
3. ✅ Test frontend routes
4. ✅ Verify role-based access
5. ✅ Set up production deployment
6. ⏳ Gather user feedback
7. ⏳ Add more features

---

## 📋 Files Modified/Created

### Backend

- ✅ `backend/models/authModel.js` (updated)
- ✅ `backend/models/studentModel.js` (created)
- ✅ `backend/models/attendanceModel.js` (created)
- ✅ `backend/controllers/authController.js` (updated)
- ✅ `backend/controllers/studentController.js` (created)
- ✅ `backend/controllers/attendanceController.js` (created)
- ✅ `backend/routes/studentRoutes.js` (created)
- ✅ `backend/routes/attendanceRoutes.js` (created)
- ✅ `backend/index.js` (updated)

### Frontend

- ✅ `frontend/src/pages/ProfilePage.jsx` (created)
- ✅ `frontend/src/pages/TeamPage.jsx` (created)
- ✅ `frontend/src/pages/admin/AdminStudents.jsx` (created)
- ✅ `frontend/src/pages/admin/AdminAttendance.jsx` (created)
- ✅ `frontend/src/pages/admin/AdminDashboard.jsx` (updated)
- ✅ `frontend/src/App.jsx` (updated)

---

**All features implemented and documented. Ready for database setup and testing!**
