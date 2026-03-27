// Gallery Photo Schema
export const gallerySchema = {
  _id: String, // UUID
  title: String,
  event: String, // Category/tag for filtering
  imageUrl: String, // Cloudinary URL
  cloudinary_public_id: String, // For deletion from Cloudinary
  uploaded_by: String, // admin id
  uploaded_at: Date,
  updated_at: Date,
};
