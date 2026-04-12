import {
  fetchAllPhotos,
  fetchPhotosByEvent,
  insertPhoto,
  deletePhoto,
  fetchEventTags,
} from "../models/galleryModel.js";
import cloudinary from "cloudinary";

// Configure Cloudinary
cloudinary.v2.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// GET /api/gallery - fetch all photos
export const getAllPhotos = async (req, res) => {
  try {
    const { data, error } = await fetchAllPhotos();
    if (error) return res.status(500).json({ error: error.message });
    res.json(data || []);
  } catch (err) {
    console.error("Error fetching photos:", err);
    res.status(500).json({ error: "Server error" });
  }
};

// GET /api/gallery/tags - fetch unique event tags
export const getEventTags = async (req, res) => {
  try {
    const { data, error } = await fetchEventTags();
    if (error) return res.status(500).json({ error: error.message });
    res.json(data || []);
  } catch (err) {
    console.error("Error fetching tags:", err);
    res.status(500).json({ error: "Server error" });
  }
};

// GET /api/gallery/:event - fetch photos by event
export const getPhotosByEvent = async (req, res) => {
  try {
    const { event } = req.params;
    if (!event) {
      return res.status(400).json({ error: "Event parameter required" });
    }
    const { data, error } = await fetchPhotosByEvent(event);
    if (error) return res.status(500).json({ error: error.message });
    res.json(data || []);
  } catch (err) {
    console.error("Error fetching photos by event:", err);
    res.status(500).json({ error: "Server error" });
  }
};

// POST /api/gallery - admin only, upload photo with Cloudinary
export const uploadPhoto = async (req, res) => {
  try {
    const { title, event, cloudinary_url, cloudinary_public_id } = req.body;

    // Validation
    if (!title) {
      return res.status(400).json({ error: "Title is required" });
    }
    if (!cloudinary_url) {
      return res.status(400).json({ error: "Image URL is required" });
    }
    if (!cloudinary_public_id) {
      return res
        .status(400)
        .json({ error: "Cloudinary public ID is required" });
    }

    // Verify URL is from Cloudinary (security check)
    if (!cloudinary_url.includes("cloudinary.com")) {
      return res.status(400).json({ error: "Invalid image source" });
    }

    const userId = req.user?.userId;
    if (!userId) {
      return res.status(401).json({ error: "User not authenticated" });
    }

    // Insert into database
    const photo = await insertPhoto(
      title,
      event || "Other",
      cloudinary_url,
      cloudinary_public_id,
      userId
    );

    if (!photo) {
      return res.status(500).json({ error: "Failed to save photo" });
    }

    res.status(201).json({
      message: "Photo uploaded successfully",
      photo: {
        _id: photo._id,
        title: photo.title,
        event: photo.event,
        imageUrl: photo.imageUrl,
        uploaded_at: photo.uploaded_at,
      },
    });
  } catch (err) {
    console.error("Upload error:", err);
    res.status(500).json({ error: "Server error during upload" });
  }
};

// DELETE /api/gallery/:id - admin only, delete photo from database and Cloudinary
export const removePhoto = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({ error: "Photo ID required" });
    }

    // Delete from database
    const { success, error } = await deletePhoto(id);

    if (!success) {
      return res.status(404).json({ error: "Photo not found" });
    }

    // Note: Cloudinary deletion is optional - the file remains on Cloudinary
    // but is unlinked from the database
    // If you want to delete from Cloudinary too, the frontend should send the public_id

    res.json({ message: "Photo deleted successfully" });
  } catch (err) {
    console.error("Delete error:", err);
    res.status(500).json({ error: "Server error during deletion" });
  }
};
