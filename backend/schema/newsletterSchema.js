// Newsletter Schema - Google Drive Link Based
export const newsletterSchema = {
  _id: String, // UUID
  title: String,
  file_url: String, // Google Drive link (drive.google.com or docs.google.com)
  downloads: Number, // Download count for tracking
  uploaded_by: String, // admin user id
  created_at: Date,
  updated_at: Date,
};
