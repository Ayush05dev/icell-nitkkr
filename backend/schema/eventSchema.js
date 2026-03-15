// Event Schema
export const eventSchema = {
  _id: String, // UUID
  name: String,
  description: String,
  date: Date,
  time: String,
  location: String,
  image: String, // URL or base64
  category: String,
  capacity: Number,
  attendees: Number,
  status: String, // 'upcoming', 'ongoing', 'completed'
  created_by: String, // admin id
  created_at: Date,
  updated_at: Date,
};
