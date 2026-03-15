import {
  fetchAllPhotos,
  fetchPhotosByEvent,
  insertPhoto,
  deletePhoto,
  fetchEventTags,
} from "../models/galleryModel.js";

// GET /api/gallery - fetch all photos
export const getAllPhotos = async (req, res) => {
  try {
    const { data, error } = await fetchAllPhotos();
    if (error) return res.status(500).json({ error: error.message });
    res.json(data || []);
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
};

// GET /api/gallery/tags - fetch unique event tags
export const getEventTags = async (req, res) => {
  try {
    const { data, error } = await fetchEventTags();
    if (error) return res.status(500).json({ error: error.message });
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
};

// GET /api/gallery/:event - fetch photos by event
export const getPhotosByEvent = async (req, res) => {
  try {
    const { event } = req.params;
    const { data, error } = await fetchPhotosByEvent(event);
    if (error) return res.status(500).json({ error: error.message });
    res.json(data || []);
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
};

// POST /api/gallery - admin only, upload photo
export const uploadPhoto = async (req, res) => {
  try {
    const { title, event, image_url } = req.body;

    if (!title || !image_url) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const photoData = {
      title,
      event: event || "Other",
      image_url,
      uploaded_by: req.user.id,
      created_at: new Date().toISOString(),
    };

    const { data, error } = await insertPhoto(photoData);
    if (error) return res.status(400).json({ error: error.message });

    res.status(201).json({ message: "Photo uploaded", photo: data });
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
};

// DELETE /api/gallery/:id - admin only, delete photo
export const removePhoto = async (req, res) => {
  try {
    const { id } = req.params;
    const { error } = await deletePhoto(id);
    if (error) return res.status(400).json({ error: error.message });
    res.json({ message: "Photo deleted" });
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
};
