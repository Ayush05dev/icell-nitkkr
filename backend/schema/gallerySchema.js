// Gallery Photo Schema
export const gallerySchema = {
  _id: String, // UUID
  title: String,
  event: String,
  imageUrl: String, // base64 or URL
  tags: [String],
  uploaded_by: String, // admin id
  uploaded_at: Date,
  updated_at: Date,
};
