# 🗺️ Router Configuration Guide

## Required Route Additions

To use the new admin pages, add these routes to your main App.jsx or routing file:

```jsx
// Import the new components
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminProfile from "./pages/admin/AdminProfile";
import AdminCertificates from "./pages/admin/AdminCertificates";

// Add to your routes (if using React Router):
const routes = [
  // ... existing routes ...

  // New Admin Routes
  {
    path: "/admin/dashboard",
    element: <AdminDashboard />,
    private: true, // Only for authenticated admin users
  },
  {
    path: "/admin/profile",
    element: <AdminProfile />,
    private: true, // Only for authenticated admin users
  },
  {
    path: "/admin/certificates",
    element: <AdminCertificates />,
    private: true, // Only for authenticated admin users
  },

  // ... rest of routes ...
];
```

## Router Setup (if using React Router v6)

```jsx
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import ProfilePage from "./pages/ProfilePage";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminProfile from "./pages/admin/AdminProfile";
import AdminCertificates from "./pages/admin/AdminCertificates";

function App() {
  return (
    <Router>
      <Routes>
        {/* User Routes */}
        <Route path="/profile" element={<ProfilePage />} />

        {/* Admin Routes */}
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path="/admin/profile" element={<AdminProfile />} />
        <Route path="/admin/certificates" element={<AdminCertificates />} />

        {/* ... other routes ... */}
      </Routes>
    </Router>
  );
}
```

## Navigation Integration

### From Navbar or Menu

```jsx
// Profile link for regular users
<Link to="/profile">My Profile</Link>

// Admin dashboard for admins
<Link to="/admin/dashboard">Admin Dashboard</Link>
```

### From Sidebar Navigation

The AdminSidebar component automatically handles navigation:

- Click any item to navigate to that section
- Active routes are highlighted
- Mobile responsive with hamburger menu

## Database Schema Requirements

### For Certificates Table (Supabase)

```sql
CREATE TABLE certificates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID NOT NULL REFERENCES profiles(id),
  title VARCHAR(255) NOT NULL,
  event VARCHAR(255) NOT NULL,
  issued_date DATE NOT NULL,
  issued_by UUID NOT NULL REFERENCES profiles(id),
  is_pending BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_certificates_student ON certificates(student_id);
CREATE INDEX idx_certificates_issued_date ON certificates(issued_date);
```

## Authentication Requirements

Both admin pages require:

1. User must be logged in (checked via `useAuth()`)
2. User role must be "admin" or "post_holder" (verified in useEffect)
3. If not authorized, user is redirected to home

## Component Dependencies

### AdminSidebar

- ✅ lucide-react icons
- ✅ react-router-dom navigation
- ✅ supabaseClient for logout

### AdminDashboard

- ✅ lucide-react icons
- ✅ AdminSidebar component
- ✅ useState for state management

### AdminProfile

- ✅ lucide-react icons
- ✅ react-router-dom navigation
- ✅ supabaseClient for data fetching
- ✅ AdminSidebar component
- ✅ useAuth context

### AdminCertificates

- ✅ lucide-react icons
- ✅ react-router-dom navigation
- ✅ supabaseClient for CRUD operations
- ✅ AdminSidebar component
- ✅ useAuth context

## Import Requirements

Make sure these dependencies are installed:

```bash
npm install lucide-react react-router-dom @supabase/supabase-js
```

## Environment Variables

Ensure these are set in your `.env.local`:

```
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_key
```

## Testing the Integration

1. **User Profile:**

   - Navigate to `/profile`
   - Verify attendance stats display
   - Check certificate section loads
   - Test responsive design on mobile

2. **Admin Dashboard:**

   - Navigate to `/admin/dashboard`
   - Check if sidebar shows all menu items
   - Verify stats cards display correctly
   - Test quick action buttons

3. **Admin Profile:**

   - Navigate to `/admin/profile`
   - Check admin-specific stats
   - Verify quick action buttons link correctly

4. **Certificates:**
   - Navigate to `/admin/certificates`
   - Test "New Certificate" button
   - Try adding a certificate (if table exists)
   - Test search and filtering

## Mobile Responsive Behavior

All components are responsive:

- **Mobile (< 768px)**: Single column, hamburger menu
- **Tablet (768px - 1024px)**: Two columns, visible sidebar
- **Desktop (> 1024px)**: Full layout, large sidebar

## Common Issues & Solutions

### Issue: Sidebar not showing

**Solution:** Ensure AdminSidebar component is imported and rendered in the admin pages

### Issue: Routes not working

**Solution:** Make sure routes are defined in your main Router component

### Issue: Icons not displaying

**Solution:** Install lucide-react: `npm install lucide-react`

### Issue: Authentication errors

**Solution:** Check that user is logged in and has correct role

## Performance Considerations

- AdminCertificates loads all certificates on mount (consider pagination for large datasets)
- AdminDashboard fetches stats on mount (consider caching)
- ProfilePage fetches attendance on mount (consider optimization)

## Future Optimization

For production, consider:

1. Implementing pagination in certificates table
2. Adding caching for frequently accessed data
3. Lazy loading for admin sidebar menu items
4. Memoization of admin components
5. Virtual scrolling for large data tables
