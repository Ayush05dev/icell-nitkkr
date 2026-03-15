import { getDB } from "../config/mongodb.js";
import { v4 as uuidv4 } from "uuid";

// Fetch all newsletters
export async function fetchAllNewsletters() {
  try {
    const db = getDB();
    const newsletters = db.collection("newsletters");
    const data = await newsletters.find({}).sort({ created_at: -1 }).toArray();
    return { data, error: null };
  } catch (error) {
    return { data: null, error };
  }
}

// Fetch a single newsletter by ID
export async function fetchNewsletterById(id) {
  try {
    const db = getDB();
    const newsletters = db.collection("newsletters");
    const data = await newsletters.findOne({ _id: id });

    if (!data) return { data: null, error: new Error("Newsletter not found") };
    return { data, error: null };
  } catch (error) {
    return { data: null, error };
  }
}

// Create a new newsletter
export async function insertNewsletter(newsletterData) {
  try {
    const db = getDB();
    const newsletters = db.collection("newsletters");

    const newNewsletter = {
      _id: uuidv4(),
      ...newsletterData,
      created_at: newsletterData.created_at || new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    await newsletters.insertOne(newNewsletter);
    return { data: newNewsletter, error: null };
  } catch (error) {
    return { data: null, error };
  }
}

// Update an existing newsletter
export async function updateNewsletter(id, updates) {
  try {
    const db = getDB();
    const newsletters = db.collection("newsletters");

    const updateDoc = {
      $set: {
        ...updates,
        updated_at: new Date().toISOString(),
      },
    };

    // findOneAndUpdate with returnDocument: "after" returns the updated document
    const result = await newsletters.findOneAndUpdate({ _id: id }, updateDoc, {
      returnDocument: "after",
    });

    if (!result)
      return { data: null, error: new Error("Newsletter not found") };
    return { data: result, error: null };
  } catch (error) {
    return { data: null, error };
  }
}

// Delete a newsletter
export async function deleteNewsletter(id) {
  try {
    const db = getDB();
    const newsletters = db.collection("newsletters");

    const result = await newsletters.deleteOne({ _id: id });

    if (result.deletedCount === 0) {
      return { error: new Error("Newsletter not found or already deleted") };
    }
    return { error: null };
  } catch (error) {
    return { error };
  }
}

// Increment download count
export async function incrementDownloads(id) {
  try {
    const db = getDB();
    const newsletters = db.collection("newsletters");

    const result = await newsletters.findOneAndUpdate(
      { _id: id },
      { $inc: { downloads: 1 } },
      { returnDocument: "after" }
    );

    if (!result)
      return { data: null, error: new Error("Newsletter not found") };
    return { data: result, error: null };
  } catch (error) {
    return { data: null, error };
  }
}
