import { getDB } from "../config/mongodb.js";
import { v4 as uuidv4 } from "uuid";

// Create blog
export async function createBlog(
  title,
  description,
  content,
  author,
  authorId,
  category,
  image
) {
  const db = getDB();
  const blogs = db.collection("blogs");

  const blog = {
    _id: uuidv4(),
    title,
    description,
    content,
    author,
    author_id: authorId,
    category,
    image,
    status: "pending",
    created_at: new Date(),
    updated_at: new Date(),
  };

  await blogs.insertOne(blog);
  return blog;
}

// Get all blogs
export async function getAllBlogs() {
  const db = getDB();
  const blogs = db.collection("blogs");
  return await blogs.find({}).sort({ created_at: -1 }).toArray();
}

// Get blog by ID
export async function getBlogById(id) {
  const db = getDB();
  const blogs = db.collection("blogs");
  return await blogs.findOne({ _id: id });
}

// Get blogs by status
export async function getBlogsByStatus(status) {
  const db = getDB();
  const blogs = db.collection("blogs");
  return await blogs.find({ status }).sort({ created_at: -1 }).toArray();
}

// Update blog status
export async function updateBlogStatus(blogId, status) {
  const db = getDB();
  const blogs = db.collection("blogs");

  const result = await blogs.updateOne(
    { _id: blogId },
    {
      $set: {
        status,
        updated_at: new Date(),
      },
    }
  );

  return result.modifiedCount > 0;
}

// Delete blog
export async function deleteBlog(blogId) {
  const db = getDB();
  const blogs = db.collection("blogs");

  const result = await blogs.deleteOne({ _id: blogId });
  return result.deletedCount > 0;
}

// Get blogs by author
export async function getBlogsByAuthor(authorId) {
  const db = getDB();
  const blogs = db.collection("blogs");
  return await blogs
    .find({ author_id: authorId })
    .sort({ created_at: -1 })
    .toArray();
}
