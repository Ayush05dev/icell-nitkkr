import {
  fetchAllNewsletters,
  fetchNewsletterById,
  insertNewsletter,
  updateNewsletter,
  deleteNewsletter,
  incrementDownloads,
} from "../models/newsletterModel.js";

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
    const { title, file_url, file_size } = req.body;

    if (!title || !file_url) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const newsletterData = {
      title,
      file_url,
      file_size: file_size || null,
      downloads: 0,
      uploaded_by: req.user.id,
      created_at: new Date().toISOString(),
    };

    const { data, error } = await insertNewsletter(newsletterData);
    if (error) return res.status(400).json({ error: error.message });

    res.status(201).json({ message: "Newsletter created", newsletter: data });
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
};

// PATCH /api/newsletters/:id - admin only, update newsletter
export const editNewsletter = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, file_url, file_size } = req.body;

    const updates = {};
    if (title) updates.title = title;
    if (file_url) updates.file_url = file_url;
    if (file_size) updates.file_size = file_size;

    const { data, error } = await updateNewsletter(id, updates);
    if (error) return res.status(400).json({ error: error.message });

    res.json({ message: "Newsletter updated", newsletter: data });
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
