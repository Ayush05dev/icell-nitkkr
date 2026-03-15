# Supabase Database Setup

## How to Run SQL Queries

### Step 1: Open Supabase SQL Editor

1. Go to [supabase.com](https://supabase.com) and log in to your project
2. Click on **SQL Editor** in the left sidebar
3. Click **New Query** button

### Step 2: Copy & Paste SQL

1. Copy the SQL code from the sections below
2. Paste it into the SQL Editor
3. Click the **Run** button (or press `Ctrl+Enter`)

### Step 3: Verify Results

- Look for success message at the bottom
- If there are errors, review the error message and fix any issues

---

## Event Attendance Table

Run the following SQL in the Supabase SQL Editor:

```sql
-- Create event_attendance table
CREATE TABLE IF NOT EXISTS event_attendance (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id UUID NOT NULL REFERENCES events(id) ON DELETE CASCADE,
  student_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  status TEXT NOT NULL DEFAULT 'absent' CHECK (status IN ('present', 'absent', 'leave')),
  marked_at TIMESTAMP DEFAULT now(),
  marked_by UUID REFERENCES profiles(id) ON DELETE SET NULL,
  created_at TIMESTAMP DEFAULT now(),
  updated_at TIMESTAMP DEFAULT now(),
  UNIQUE(event_id, student_id)
);

-- Create index for faster queries
CREATE INDEX idx_event_attendance_event_id ON event_attendance(event_id);
CREATE INDEX idx_event_attendance_student_id ON event_attendance(student_id);
CREATE INDEX idx_event_attendance_event_student ON event_attendance(event_id, student_id);
```

### Expected Output

```
CREATE TABLE
CREATE INDEX
CREATE INDEX
CREATE INDEX
```

---

## Row Level Security (RLS) Policies

Run each query separately for clarity. Copy and paste each one:

### Query 1: Enable RLS

```sql
ALTER TABLE event_attendance ENABLE ROW LEVEL SECURITY;
```

### Query 2: Admins can view all attendance

```sql
CREATE POLICY "Admins can view all attendance"
  ON event_attendance FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );
```

### Query 3: Students can view their own attendance

```sql
CREATE POLICY "Students can view their own attendance"
  ON event_attendance FOR SELECT
  USING (student_id = auth.uid());
```

### Query 4: Admins can mark attendance

```sql
CREATE POLICY "Admins can mark attendance"
  ON event_attendance FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );
```

### Query 5: Admins can update attendance

```sql
CREATE POLICY "Admins can update attendance"
  ON event_attendance FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );
```

### Query 6: Admins can delete attendance

```sql
CREATE POLICY "Admins can delete attendance"
  ON event_attendance FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );
```

---

## Backend API Endpoints

The following endpoints are now available:

### Mark Attendance

**POST** `/api/event-attendance/:eventId/:studentId`

- Body: `{ status: "present" | "absent" | "leave" }`
- Auth: Admin only

Example:

```bash
curl -X POST http://localhost:5000/api/event-attendance/event-id-123/student-id-456 \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{ "status": "present" }'
```

### Get Event Attendance

**GET** `/api/event-attendance/:eventId`

- Returns: All students' attendance for the event
- Auth: Admin only

### Get Student Attendance History

**GET** `/api/event-attendance/student/:studentId`

- Returns: All attendance records for a student across all events
- Auth: Authenticated (any logged-in user)

### Get Student Attendance Statistics

**GET** `/api/event-attendance/student/:studentId/stats`

- Returns: `{ present, absent, leave, total, percentage }`
- Auth: Authenticated (any logged-in user)

---

## Frontend Admin Pages

All admin pages now have consistent sidebar integration:

- ✅ AdminDashboard
- ✅ AdminAttendance
- ✅ AdminBlogs
- ✅ AdminStudents
- ✅ AdminEvents
- ✅ AdminGallery
- ✅ AdminNewsletters
- ✅ AdminTeams

---

## Troubleshooting

### Error: "relation 'event_attendance' already exists"

- The table was already created. Skip to RLS policies setup.

### Error: "profiles" table not found

- Make sure the `profiles` table exists and has an `id` and `role` column.

### Error: "events" table not found

- Make sure the `events` table exists and has an `id` column.

### Policies not working?

- Verify RLS is enabled: `ALTER TABLE event_attendance ENABLE ROW LEVEL SECURITY;`
- Check that user profiles have correct `role` field (admin/member)
- Test with browser developer tools to see API response errors
