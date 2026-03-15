// Newsletter Schema
export const newsletterSchema = {
  _id: String, // UUID
  title: String,
  file_url: String, // PDF URL or base64
  file_name: String,
  uploaded_by: String, // admin id
  uploaded_at: Date,
  updated_at: Date,
};
