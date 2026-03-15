// User/Profile Schema
export const profileSchema = {
  _id: String, // UUID
  email: String, // unique, indexed
  password: String, // hashed
  name: String,
  phone: String,
  branch: String, // CSE, ECE, ME, etc.
  year: String, // 1st, 2nd, 3rd, 4th
  roll_number: String,
  role: String, // 'admin', 'member', 'post_holder'
  is_member: Boolean,
  created_at: Date,
  updated_at: Date,
};
