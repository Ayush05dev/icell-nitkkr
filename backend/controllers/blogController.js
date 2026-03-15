import * as blogModel from "../models/blogModel.js";

// GET /api/blogs — public, approved only
export async function getBlogs(req, res) {
  try {
    const blogs = await blogModel.getBlogsByStatus("approved");
    res.json(blogs);
  } catch (error) {
    console.error("Get blogs error:", error);
    res.status(500).json({ error: "Failed to get blogs" });
  }
}

// GET /api/blogs/admin — admin only, all blogs
export async function getAllBlogsAdmin(req, res) {
  try {
    const blogs = await blogModel.getAllBlogs();
    res.json(blogs);
  } catch (error) {
    console.error("Get all blogs error:", error);
    res.status(500).json({ error: "Failed to get blogs" });
  }
}

// GET /api/blogs/:id — public
export async function getBlogById(req, res) {
  try {
    const blog = await blogModel.getBlogById(req.params.id);
    if (!blog) {
      return res.status(404).json({ error: "Blog not found" });
    }
    res.json(blog);
  } catch (error) {
    console.error("Get blog by ID error:", error);
    res.status(500).json({ error: "Failed to get blog" });
  }
}

// POST /api/blogs — authenticated user submits blog (status = pending)
export async function createBlog(req, res) {
  try {
    const { title, description, content, category, image } = req.body;
    const authorId = req.user.userId;
    const authorName = req.user.email;

    if (!title || !content || !category) {
      return res
        .status(400)
        .json({ error: "Title, content, and category are required" });
    }

    const blog = await blogModel.createBlog({
      title,
      description: description || "",
      content,
      author: authorName,
      author_id: authorId,
      category,
      image: image || "",
      status: "pending",
    });

    res.status(201).json({ message: "Blog submitted for review", blog });
  } catch (error) {
    console.error("Create blog error:", error);
    res.status(500).json({ error: "Failed to create blog" });
  }
}

// PATCH /api/blogs/:id/status — admin only
export async function patchBlogStatus(req, res) {
  try {
    const { status } = req.body;

    if (!["approved", "rejected", "pending"].includes(status)) {
      return res.status(400).json({ error: "Invalid status value" });
    }

    await blogModel.updateBlogStatus(req.params.id, status);

    res.json({ message: `Blog ${status}` });
  } catch (error) {
    console.error("Update blog status error:", error);
    res.status(500).json({ error: "Failed to update blog status" });
  }
}

// DELETE /api/blogs/:id — admin or author only
export async function deleteBlog(req, res) {
  try {
    await blogModel.deleteBlog(req.params.id);
    res.json({ message: "Blog deleted successfully" });
  } catch (error) {
    console.error("Delete blog error:", error);
    res.status(500).json({ error: "Failed to delete blog" });
  }
}

// GET /api/blogs/user/:userId — get user's blogs
export async function getUserBlogs(req, res) {
  try {
    const blogs = await blogModel.getBlogsByAuthor(req.params.userId);
    res.json(blogs);
  } catch (error) {
    console.error("Get user blogs error:", error);
    res.status(500).json({ error: "Failed to get user blogs" });
  }
}
