// Blog Schema
export const blogSchema = {
  _id: String, // UUID
  title: String,
  description: String,
  content: String,
  author: String, // email
  author_id: String, // user id
  category: String,
  image: String, // URL or base64
  status: String, // 'pending', 'approved', 'rejected'
  created_at: Date,
  updated_at: Date,
};
