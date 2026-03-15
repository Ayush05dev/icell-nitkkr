import { getDB } from "../config/mongodb.js";
import { v4 as uuidv4 } from "uuid";

// Create gallery photo
export async function createPhoto(title, event, imageUrl, tags, uploadedBy) {
  const db = getDB();
  const gallery = db.collection("gallery");

  const photo = {
    _id: uuidv4(),
    title,
    event,
    imageUrl,
    tags: tags || [],
    uploaded_by: uploadedBy,
    uploaded_at: new Date(),
    updated_at: new Date(),
  };

  await gallery.insertOne(photo);
  return photo;
}

// Get all gallery photos
export async function getAllPhotos() {
  const db = getDB();
  const gallery = db.collection("gallery");
  return await gallery.find({}).sort({ uploaded_at: -1 }).toArray();
}

// Get photos by tag
export async function getPhotosByTag(tag) {
  const db = getDB();
  const gallery = db.collection("gallery");
  return await gallery.find({ tags: tag }).sort({ uploaded_at: -1 }).toArray();
}

// Delete photo
export async function deletePhoto(photoId) {
  const db = getDB();
  const gallery = db.collection("gallery");

  const result = await gallery.deleteOne({ _id: photoId });
  return result.deletedCount > 0;
}

// Get unique tags
export async function getAllTags() {
  const db = getDB();
  const gallery = db.collection("gallery");
  return await gallery.distinct("tags");
}
