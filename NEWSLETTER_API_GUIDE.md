# Newsletter System API Guide

## Google Drive Link Based Implementation

### Overview

The newsletter system has been updated to accept Google Drive links instead of file uploads. This simplifies both frontend and backend, eliminates storage concerns, and leverages Google Drive's hosting capabilities.

---

## API Endpoints

### 1. **GET /api/newsletters** (Public)

Fetch all newsletters.

**Method:** GET  
**Auth Required:** No  
**Parameters:** None

**Response (200):**

```json
[
  {
    "_id": "uuid-12345",
    "title": "Monthly Newsletter - March 2026",
    "file_url": "https://drive.google.com/file/d/1abc/view",
    "downloads": 5,
    "uploaded_by": "admin-user-id",
    "created_at": "2026-03-26T10:30:00.000Z",
    "updated_at": "2026-03-26T10:30:00.000Z"
  }
]
```

---

### 2. **GET /api/newsletters/:id** (Public)

Fetch a single newsletter by ID.

**Method:** GET  
**Auth Required:** No  
**Parameters:**

- `id` (path) - Newsletter UUID

**Response (200):**

```json
{
  "_id": "uuid-12345",
  "title": "Monthly Newsletter - March 2026",
  "file_url": "https://drive.google.com/file/d/1abc/view",
  "downloads": 5,
  "uploaded_by": "admin-user-id",
  "created_at": "2026-03-26T10:30:00.000Z",
  "updated_at": "2026-03-26T10:30:00.000Z"
}
```

**Error (404):**

```json
{ "error": "Newsletter not found" }
```

---

### 3. **POST /api/newsletters** (Admin Only)

Create a new newsletter with a Google Drive link.

**Method:** POST  
**Auth Required:** Yes (Admin)  
**Headers:**

```
Authorization: Bearer <token>
Content-Type: application/json
```

**Request Body:**

```json
{
  "title": "Monthly Newsletter - March 2026",
  "link": "https://drive.google.com/file/d/1abc/view"
}
```

**Validation Rules:**

- `title`: Required, will be trimmed
- `link`: Required, must contain either `drive.google.com` or `docs.google.com`
- Both fields are trimmed before storage

**Response (201):**

```json
{
  "message": "Newsletter created successfully",
  "newsletter": {
    "_id": "uuid-12345",
    "title": "Monthly Newsletter - March 2026",
    "file_url": "https://drive.google.com/file/d/1abc/view",
    "downloads": 0,
    "uploaded_by": "admin-user-id",
    "created_at": "2026-03-26T10:30:00.000Z"
  }
}
```

**Errors:**

- **400** - Missing required fields:

```json
{ "error": "Missing required fields: title and link" }
```

- **400** - Invalid Google Drive link:

```json
{
  "error": "Invalid Google Drive link. Link must contain drive.google.com or docs.google.com"
}
```

- **401** - Not authenticated
- **403** - Not an admin

---

### 4. **PATCH /api/newsletters/:id** (Admin Only)

Update an existing newsletter.

**Method:** PATCH  
**Auth Required:** Yes (Admin)  
**Headers:**

```
Authorization: Bearer <token>
Content-Type: application/json
```

**Parameters:**

- `id` (path) - Newsletter UUID

**Request Body (at least one field required):**

```json
{
  "title": "Updated Newsletter Title",
  "link": "https://drive.google.com/file/d/newid/view"
}
```

**Update Rules:**

- Either `title` or `link` (or both) must be provided
- `title` and `link` are trimmed before storage
- Google Drive link validation applied if provided
- `updated_at` timestamp automatically set

**Response (200):**

```json
{
  "message": "Newsletter updated successfully",
  "newsletter": {
    "_id": "uuid-12345",
    "title": "Updated Newsletter Title",
    "file_url": "https://drive.google.com/file/d/newid/view",
    "downloads": 5,
    "uploaded_by": "admin-user-id",
    "created_at": "2026-03-26T10:30:00.000Z",
    "updated_at": "2026-03-26T11:45:00.000Z"
  }
}
```

**Errors:**

- **400** - No update fields provided:

```json
{ "error": "At least one field (title or link) is required" }
```

- **400** - Invalid Google Drive link:

```json
{
  "error": "Invalid Google Drive link. Link must contain drive.google.com or docs.google.com"
}
```

- **404** - Newsletter not found:

```json
{ "error": "Newsletter not found" }
```

- **401** - Not authenticated
- **403** - Not an admin

---

### 5. **DELETE /api/newsletters/:id** (Admin Only)

Delete a newsletter.

**Method:** DELETE  
**Auth Required:** Yes (Admin)  
**Headers:**

```
Authorization: Bearer <token>
```

**Parameters:**

- `id` (path) - Newsletter UUID

**Response (200):**

```json
{ "message": "Newsletter deleted" }
```

**Errors:**

- **404** - Newsletter not found:

```json
{ "error": "Newsletter not found or already deleted" }
```

- **401** - Not authenticated
- **403** - Not an admin

---

### 6. **POST /api/newsletters/:id/download** (Public)

Increment the download count for a newsletter (optional tracking).

**Method:** POST  
**Auth Required:** No  
**Parameters:**

- `id` (path) - Newsletter UUID

**Response (200):**

```json
{
  "message": "Download counted",
  "newsletter": {
    "_id": "uuid-12345",
    "title": "Monthly Newsletter - March 2026",
    "file_url": "https://drive.google.com/file/d/1abc/view",
    "downloads": 6,
    "uploaded_by": "admin-user-id",
    "created_at": "2026-03-26T10:30:00.000Z",
    "updated_at": "2026-03-26T10:30:00.000Z"
  }
}
```

**Error (404):**

```json
{ "error": "Newsletter not found" }
```

---

## Important Notes

### Google Drive URL Validation

- The system validates that links contain either `drive.google.com` or `docs.google.com`
- Links must be valid Google Drive sharing URLs
- Recommended format: `https://drive.google.com/file/d/{FILE_ID}/view`
- Example valid links:
  - ✅ `https://drive.google.com/file/d/1abc123xyz/view`
  - ✅ `https://docs.google.com/document/d/1abc123xyz/edit`
  - ✅ `https://drive.google.com/open?id=1abc123xyz`
  - ❌ `https://example.com/file.pdf` (rejected)
  - ❌ `http://drive.example.com/file` (rejected)

### Download Tracking

- The `downloads` field tracks how many times the `/download` endpoint was called
- This is optional; you don't need to call it for users to access the newsletter
- Useful for analytics and tracking engagement
- Incremented only via the dedicated POST endpoint

### Data Storage

**Database Fields:**

- `_id`: UUID (automatically generated)
- `title`: Newsletter title (trimmed)
- `file_url`: Google Drive link (trimmed, stored as-is)
- `downloads`: Count of download endpoint calls (starts at 0)
- `uploaded_by`: Admin user ID
- `created_at`: ISO timestamp (auto-set on creation)
- `updated_at`: ISO timestamp (auto-set on creation and update)

---

## Frontend Implementation Guide

### Display Newsletter List (Public)

```javascript
// Fetch all newsletters
const response = await fetch("/api/newsletters");
const newsletters = await response.json();

// For each newsletter, display:
// - Title
// - Link (file_url) - clickable to open in Google Drive
// - Download count
```

### Admin: Create Newsletter

```javascript
const response = await fetch("/api/newsletters", {
  method: "POST",
  headers: {
    Authorization: `Bearer ${adminToken}`,
    "Content-Type": "application/json",
  },
  body: JSON.stringify({
    title: "March Newsletter",
    link: "https://drive.google.com/file/d/1abc/view",
  }),
});

if (response.ok) {
  const data = await response.json();
  console.log("Newsletter created:", data.newsletter);
} else {
  const error = await response.json();
  console.error("Error:", error.error);
}
```

### Admin: Update Newsletter

```javascript
const response = await fetch(`/api/newsletters/${newsletterId}`, {
  method: "PATCH",
  headers: {
    Authorization: `Bearer ${adminToken}`,
    "Content-Type": "application/json",
  },
  body: JSON.stringify({
    title: "Updated Title", // optional
    link: "https://drive.google.com/file/d/new/view", // optional
  }),
});
```

### Admin: Delete Newsletter

```javascript
const response = await fetch(`/api/newsletters/${newsletterId}`, {
  method: "DELETE",
  headers: {
    Authorization: `Bearer ${adminToken}`,
  },
});
```

### Track Download (Optional)

```javascript
// Call this when user clicks the download/open link
await fetch(`/api/newsletters/${newsletterId}/download`, {
  method: "POST",
});

// User is then redirected to Google Drive link
// window.open(fileUrl, '_blank');
```

---

## Migration from Old System

If you have existing newsletters with old data:

1. Extract any stored file URLs and replace with Google Drive links
2. Update the `file_url` field via PATCH endpoint:
   ```javascript
   // For each old newsletter:
   PATCH /api/newsletters/{id}
   Body: { "link": "https://drive.google.com/file/d/{newId}/view" }
   ```
3. Remove any deprecated fields like `file_size`, `file_name`, `uploaded_at`

---

## Error Handling Summary

| Error                       | Status | Cause                                                        | Solution                       |
| --------------------------- | ------ | ------------------------------------------------------------ | ------------------------------ |
| Missing required fields     | 400    | `title` or `link` not provided                               | Include both in request        |
| Invalid Google Drive link   | 400    | Link doesn't contain `drive.google.com` or `docs.google.com` | Provide valid Google Drive URL |
| Newsletter not found        | 404    | Invalid newsletter ID                                        | Verify ID exists               |
| Not authenticated           | 401    | Missing or invalid Authorization header                      | Include valid bearer token     |
| Not an admin                | 403    | User is not an admin                                         | Use admin account              |
| At least one field required | 400    | PATCH with no fields                                         | Include `title` and/or `link`  |

---

## Example Workflow

### Creating and Publishing a Newsletter

**Step 1: Upload PDF to Google Drive**

- Create/upload newsletter PDF to Google Drive
- Right-click → Share → Set permissions (Anyone with link)
- Copy the sharing link

**Step 2: Create Newsletter via API**

```bash
curl -X POST http://localhost:5000/api/newsletters \
  -H "Authorization: Bearer admin_token" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "March 2026 Newsletter",
    "link": "https://drive.google.com/file/d/1abc123xyz/view"
  }'
```

**Step 3: Display on Website**

- Fetch newsletters via GET /api/newsletters
- Show newsletter title and link in UI
- Users click link to view/download from Google Drive

**Step 4: Track Engagement (Optional)**

- When user clicks link, POST to /api/newsletters/{id}/download
- Analytics dashboard can show download counts

---

## Testing Checklist

- [ ] Test creating newsletter with valid Google Drive link
- [ ] Test validation rejects non-Google Drive links
- [ ] Test updating newsletter title only
- [ ] Test updating newsletter link only
- [ ] Test updating both title and link
- [ ] Test deleting newsletter
- [ ] Test fetching all newsletters (should show all)
- [ ] Test fetching single newsletter
- [ ] Test download tracking endpoint
- [ ] Test all error cases and status codes
- [ ] Verify admin-only endpoints require valid token
- [ ] Verify public endpoints work without token
