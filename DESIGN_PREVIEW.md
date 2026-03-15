# 🎨 Visual Design Preview & Layout Guide

## User Profile Page Layout

```
┌─────────────────────────────────────────────────────────────────────┐
│ Profile                                                               │
│ Your account & activity overview                                    │
└─────────────────────────────────────────────────────────────────────┘

┌──────────────────────────┬────────────────────────────────────────────┐
│                          │                                            │
│  Profile Card            │  Account Information Section               │
│  ┌────────────────────┐  │  ┌──────────────────────────────────────┐│
│  │       [Avatar]     │  │  │ Full Name: John Doe                  ││
│  │    John Doe        │  │  │ ───────────────────────────────────  ││
│  │   ID: 1234abcd     │  │  │ Email: john@example.com              ││
│  │                    │  │  │ Phone: +91 XXXXXXXX                  ││
│  │  • john@example    │  │  │ ───────────────────────────────────  ││
│  │  • CSE             │  │  │ Role: Post Holder (Secretary)        ││
│  │  • Year 3          │  │  │ ───────────────────────────────────  ││
│  │  • Roll: 21CS123   │  │  │ Academic: CSE | Year 3 | 21CS123    ││
│  │                    │  │  │                                      ││
│  │  🟢 Active Member  │  │  └──────────────────────────────────────┘│
│  │  Joined: Mar 2024  │  │                                            │
│  └────────────────────┘  │  Certificates Section                     │
│                          │  ┌──────────────────────────────────────┐│
│  Attendance Card         │  │ [Award] Available Certificates    (2) ││
│  ┌────────────────────┐  │  │ ───────────────────────────────────  ││
│  │ 📅 Event Attendance│  │  │ ✓ Python Fundamentals               ││
│  │                    │  │  │   Tech Workshop 2025 • Mar 10, 2025 ││
│  │ Attendance: 78% ▓▓│  │  │                                      ││
│  │                    │  │  │ ⏳ Web Development Bootcamp         ││
│  │ Events: 15         │  │  │   Web Dev Conference • Mar 15, 2025 ││
│  │ Attended: 12       │  │  │                                      ││
│  │ Rate: 80%          │  │  │ No more certificates yet...          ││
│  │                    │  │  │ Keep attending events!              ││
│  └────────────────────┘  │  └──────────────────────────────────────┘│
│                          │                                            │
│                          │  [Logout Button]                          │
└──────────────────────────┴────────────────────────────────────────────┘
```

### Color Scheme:

- **Primary BG**: #0d0d0d (very dark)
- **Card BG**: #111111 (dark)
- **Border**: #1f1f1f (subtle)
- **Text**: White / #555 (muted)
- **Accent**: #a855f7 (purple)

---

## Admin Sidebar Navigation

```
┌─────────────────────┐
│ iCell Admin         │
│ Management System   │
├─────────────────────┤
│ Dashboard       [>] │ ← Active (highlighted)
│ Profile             │
│ Students            │
│ Events              │
│ Attendance          │
│ Blogs               │
│ Teams               │
│ Newsletters         │
│ Gallery             │
│ Certificates        │
├─────────────────────┤
│ [Logout]            │
└─────────────────────┘
```

### Desktop (> 1024px):

- Sidebar always visible (256px width)
- Fixed left position
- Navigation items with icons

### Mobile (< 768px):

- Hamburger menu (top-left)
- Slide-out sidebar with backdrop
- Auto-close on navigation

---

## Admin Dashboard Layout

```
┌──────────────────────────────────────────────────────────────────┐
│ [≡] Dashboard                               [← Sidebar]          │
│ Welcome to the admin control center                              │
│ Monday, March 15, 2026                                           │
└──────────────────────────────────────────────────────────────────┘

┌─────────────┬──────────────┬──────────────┐
│ 👥 Students │ 📅 Events    │ 📝 Blogs     │
│ 248         │ 24           │ 156          │
│ +12 this mo │ +3 upcoming  │ +8 pending   │
└─────────────┴──────────────┴──────────────┘

┌─────────────┬──────────────┬──────────────┐
│ 🏅 Certs    │ 📧 Newslet   │ 📊 Attend    │
│ 342         │ 12           │ 78%          │
│ +94 this mo │ Last: 2d ago │ +5% improve  │
└─────────────┴──────────────┴──────────────┘

┌────────────────────────────────┬──────────────────────┐
│ Recent Activities              │ Quick Actions        │
│ ───────────────────────────────│ ──────────────────── │
│ • 📅 WebDev Workshop opened    │ [View Students]      │
│   2h ago                       │ [Create Event]       │
│                               │ [Review Blogs]       │
│ • 📝 Blog approved             │ [Mark Attendance]    │
│   4h ago                       │                      │
│                               │ System Status        │
│ • 👥 5 new members             │ ──────────────────── │
│   6h ago                       │ API: Online 🟢       │
│                               │ DB: Connected 🟢     │
│ • 🎓 Certificates sent         │                      │
│   1d ago                       │                      │
└────────────────────────────────┴──────────────────────┘

Alerts: ⚠️ 8 blog posts pending approval
```

---

## Admin Profile Page

```
┌──────────────────────────────────────────────────────────────────┐
│ [≡] Admin Profile                                                │
│ Your admin account & management overview                         │
└──────────────────────────────────────────────────────────────────┘

┌──────────────────┬─────────────────────────────────────────────┐
│                  │                                             │
│  Admin Profile   │  Admin Information                          │
│  ┌────────────┐  │  ┌───────────────────────────────────────┐ │
│  │   [Shield] │  │  │ Full Name: Admin User                │ │
│  │ Admin User │  │  │ Email: admin@icell.com             │ │
│  │Admin Badge │  │  │ ───────────────────────────────────  │ │
│  │            │  │  │ Role: Administrator                 │ │
│  │ 🟢 Active  │  │  │ Permission: Full Access             │ │
│  │            │  │  └───────────────────────────────────────┘ │
│  └────────────┘  │                                             │
│                  │  Management Overview                        │
│  Quick Actions   │  ┌────────────┬─────────────────────────┐  │
│  ──────────────  │  │ 📅 Events  │ 👥 Students            │  │
│  → Manage        │  │ 24         │ 248                    │  │
│    Students      │  └────────────┴─────────────────────────┘  │
│                  │  ┌────────────┬─────────────────────────┐  │
│  → Manage Events │  │ 📝 Blogs   │ 📧 Newsletters         │  │
│                  │  │ 156        │ 12                     │  │
│  → View          │  └────────────┴─────────────────────────┘  │
│    Attendance    │                                             │
│                  │  [Logout Button]                            │
└──────────────────┴─────────────────────────────────────────────┘
```

---

## Admin Certificates Page

```
┌──────────────────────────────────────────────────────────────────┐
│ [≡] Certificates                                                 │
│ Manage student certificates & awards                             │
│                         [+ New Certificate]                      │
└──────────────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────────────┐
│ [Search...]                           [Filter]                  │
└──────────────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────────────┐
│ Title              │ Student  │ Event          │ Date          │
├──────────────────────────────────────────────────────────────────┤
│ Python Fund...     │ John Doe │ Tech Workshop  │ Mar 10, 2025  │
│                    │ 21CS123  │                │               │
├──────────────────────────────────────────────────────────────────┤
│ Web Det Bootcamp   │ Jane Sm  │ Web Dev Conf   │ Mar 15, 2025  │
│                    │ 21CS456  │                │               │
├──────────────────────────────────────────────────────────────────┤
│ AI Fundamentals    │ Bob Lee  │ AI Workshop    │ Mar 12, 2025  │
│                    │ 21CS789  │                │               │
└──────────────────────────────────────────────────────────────────┘

[Modal: Add New Certificate]
┌────────────────────────────────┐
│ Add New Certificate            │
├────────────────────────────────┤
│ Student ID: [________]         │
│ Certificate Title: [________]  │
│ Event: [________]              │
│ Date: [________]               │
├────────────────────────────────┤
│ [Cancel]   [Add Certificate]   │
└────────────────────────────────┘
```

---

## Color Scheme Reference

### Primary Colors:

```
🟣 Purple:   #a855f7 - Dashboard, Blogs, Settings
🟢 Green:    #10b981 - Students, Success, Attendance
🔵 Blue:     #0ea5e9 - Events, Attendance, Calendar
🟡 Amber:    #f59e0b - Certificates, Warnings
🔴 Red:      #ef4444 - Logout, Danger
🟦 Indigo:   #6366f1 - Events, Calendar
🟥 Cyan:     #06b6d4 - Gallery, Info
```

### Background Colors:

```
Primary BG:   #0d0d0d - Page background
Card BG:      #111111 - Card containers
Border:       #1f1f1f - Subtle borders
Hover:        #161616 - Hover states
Text:         #ffffff - Primary text
Muted Text:   #555555 - Secondary text
Subtle Text:  #444444 - Tertiary text
```

---

## Responsive Breakpoints

| Breakpoint | Width          | Layout                     |
| ---------- | -------------- | -------------------------- |
| Mobile     | < 768px        | 1 column, hamburger menu   |
| Tablet     | 768px - 1024px | 2 columns, visible sidebar |
| Desktop    | > 1024px       | 3 columns, full layout     |

---

## Typography

**Font Family:** Space Grotesk (modern, professional)

### Sizes:

- **3xl (30px):** Page headers
- **2xl (24px):** Section headers
- **lg (18px):** Card titles
- **base (16px):** Body text
- **sm (14px):** Labels, small text
- **xs (12px):** Badges, metadata

### Weights:

- **900/Bold:** Major headings
- **600/Semibold:** Card titles, important labels
- **500/Medium:** Buttons, important text
- **400/Regular:** Body text

---

## Components Styling

### Cards

```css
Background: #111111
Border: 1px solid #1f1f1f
Border Radius: 8-12px
Padding: 20-24px
Hover: Subtle border opacity change
```

### Buttons

```css
Padding: 8-12px vertical, 16-24px horizontal
Border Radius: 6-8px
Font Weight: 500
Transition: All 200ms
On Hover: Background color brightens
```

### Input Fields

```css
Background: #0d0d0d
Border: 1px solid #1f1f1f
Border Radius: 6px
Padding: 8-12px
Color: White
Focus: Border color becomes accent color
```

### Badges/Status

```css
Padding: 4-6px horizontal, 2px vertical
Border Radius: 12px
Font Size: 11-12px
Background: Color + 15% opacity
Color: Solid color
```

---

## Animation & Transitions

All interactive elements use:

- **Transition Duration:** 200-300ms
- **Easing:** ease-in-out (smooth)
- **Effects:**
  - Scale hover: +5%
  - Border opacity on hover
  - Background color transitions
  - Smooth slide-in for sidebars

---

## Accessibility Features

✅ Color contrasts meet WCAG AA standards
✅ Focus states clearly visible
✅ Keyboard navigation supported
✅ Icons with title attributes
✅ Semantic HTML structure
✅ ARIA labels where needed
