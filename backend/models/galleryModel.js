import { getDB } from "../config/mongodb.js";
import { v4 as uuidv4 } from "uuid";

// Insert gallery photo - called by controller as insertPhoto
export async function insertPhoto(
  title,
  event,
  imageUrl,
  cloudinaryPublicId,
  uploadedBy
) {
  const db = getDB();
  const gallery = db.collection("gallery");

  const photo = {
    _id: uuidv4(),
    title,
    event,
    imageUrl,
    cloudinary_public_id: cloudinaryPublicId,
    uploaded_by: uploadedBy,
    uploaded_at: new Date(),
    updated_at: new Date(),
  };

  await gallery.insertOne(photo);
  return photo;
}

// Get all gallery photos - called by controller as fetchAllPhotos
export async function fetchAllPhotos() {
  try {
    const db = getDB();
    const gallery = db.collection("gallery");
    const data = await gallery.find({}).sort({ uploaded_at: -1 }).toArray();
    return { data, error: null };
  } catch (error) {
    return { data: null, error };
  }
}

// Get photos by event - called by controller as fetchPhotosByEvent
export async function fetchPhotosByEvent(event) {
  try {
    const db = getDB();
    const gallery = db.collection("gallery");
    const data = await gallery
      .find({ event })
      .sort({ uploaded_at: -1 })
      .toArray();
    return { data, error: null };
  } catch (error) {
    return { data: null, error };
  }
}

// Delete photo - called by controller as deletePhoto
export async function deletePhoto(photoId) {
  try {
    const db = getDB();
    const gallery = db.collection("gallery");
    const result = await gallery.deleteOne({ _id: photoId });
    return { success: result.deletedCount > 0, error: null };
  } catch (error) {
    return { success: false, error };
  }
}

// Get unique event tags - called by controller as fetchEventTags
export async function fetchEventTags() {
  try {
    const db = getDB();
    const gallery = db.collection("gallery");
    const data = await gallery.distinct("event");
    return { data, error: null };
  } catch (error) {
    return { data: null, error };
  }
}
