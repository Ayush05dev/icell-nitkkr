import {
  fetchAllNewsletters,
  fetchNewsletterById,
  insertNewsletter,
  updateNewsletter,
  deleteNewsletter,
  incrementDownloads,
} from "../models/newsletterModel.js";

// Validate Google Drive URL
const isValidGoogleDriveLink = (url) => {
  if (!url || typeof url !== "string") return false;
  const trimmedUrl = url.trim();
  return (
    trimmedUrl.includes("drive.google.com") ||
    trimmedUrl.includes("docs.google.com")
  );
};

// GET /api/newsletters - fetch all
export const getAllNewsletters = async (req, res) => {
  try {
    const { data, error } = await fetchAllNewsletters();
    if (error) return res.status(500).json({ error: error.message });
    res.json(data || []);
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
};

// GET /api/newsletters/:id - fetch single
export const getNewsletterById = async (req, res) => {
  try {
    const { id } = req.params;
    const { data, error } = await fetchNewsletterById(id);
    if (error) return res.status(404).json({ error: "Newsletter not found" });
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
};

// POST /api/newsletters - admin only, create newsletter
export const createNewsletter = async (req, res) => {
  try {
    const { title, link } = req.body;

    // Validate required fields
    if (!title || !link) {
      return res
        .status(400)
        .json({ error: "Missing required fields: title and link" });
    }

    // Validate Google Drive link
    if (!isValidGoogleDriveLink(link)) {
      return res.status(400).json({
        error:
          "Invalid Google Drive link. Link must contain drive.google.com or docs.google.com",
      });
    }

    const newsletterData = {
      title: title.trim(),
      file_url: link.trim(),
      downloads: 0,
      uploaded_by: req.user.userId,
      created_at: new Date().toISOString(),
    };

    const { data, error } = await insertNewsletter(newsletterData);
    if (error) return res.status(400).json({ error: error.message });

    res
      .status(201)
      .json({ message: "Newsletter created successfully", newsletter: data });
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
};

// PATCH /api/newsletters/:id - admin only, update newsletter
export const editNewsletter = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, link } = req.body;

    // Validate that at least one field is provided
    if (!title && !link) {
      return res
        .status(400)
        .json({ error: "At least one field (title or link) is required" });
    }

    const updates = {};

    if (title) {
      updates.title = title.trim();
    }

    if (link) {
      // Validate Google Drive link if provided
      if (!isValidGoogleDriveLink(link)) {
        return res.status(400).json({
          error:
            "Invalid Google Drive link. Link must contain drive.google.com or docs.google.com",
        });
      }
      updates.file_url = link.trim();
    }

    const { data, error } = await updateNewsletter(id, updates);
    if (error) return res.status(404).json({ error: error.message });

    res.json({ message: "Newsletter updated successfully", newsletter: data });
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
};

// DELETE /api/newsletters/:id - admin only, delete newsletter
export const removeNewsletter = async (req, res) => {
  try {
    const { id } = req.params;
    const { error } = await deleteNewsletter(id);
    if (error) return res.status(400).json({ error: error.message });
    res.json({ message: "Newsletter deleted" });
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
};

// POST /api/newsletters/:id/download - increment download count
export const downloadNewsletter = async (req, res) => {
  try {
    const { id } = req.params;
    const { data, error } = await incrementDownloads(id);
    if (error) return res.status(400).json({ error: error.message });
    res.json({ message: "Download counted", newsletter: data });
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
};
