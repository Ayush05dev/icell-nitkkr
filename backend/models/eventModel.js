import { getDB } from "../config/mongodb.js";
import { v4 as uuidv4 } from "uuid";

// Create event
export async function createEvent(
  name,
  description,
  date,
  time,
  location,
  image,
  category,
  capacity,
  createdBy,
  years = [], // Array of academic years ['1st', '2nd', etc.]
  format = "", // e.g., "Online", "Offline", "Hybrid"
  rounds = "", // e.g., "3", "2"
  prizePool = "", // e.g., "₹50,000", "₹1,00,000"
  registrationLink = "", // URL for registration
  longDescription = "" // Detailed description for modal
) {
  const db = getDB();
  const events = db.collection("events");

  const event = {
    _id: uuidv4(),
    name,
    description, // Short description shown on card
    long_description: longDescription, // Detailed description for modal
    date: new Date(date),
    time,
    location,
    image,
    category,
    capacity,
    format, // "Online", "Offline", "Hybrid"
    rounds,
    prize_pool: prizePool,
    registration_link: registrationLink,
    attendees: 0,
    status: "upcoming", // "upcoming", "ongoing", "completed", "past"
    years: Array.isArray(years) && years.length > 0 ? years : [], // Store selected years
    created_by: createdBy,
    created_at: new Date(),
    updated_at: new Date(),
  };

  await events.insertOne(event);
  return event;
}

// Get all events
export async function getAllEvents() {
  const db = getDB();
  const events = db.collection("events");
  return await events.find({}).sort({ date: 1 }).toArray();
}

// Get event by ID
export async function getEventById(id) {
  const db = getDB();
  const events = db.collection("events");
  return await events.findOne({ _id: id });
}

// Update event
export async function updateEvent(eventId, updates) {
  const db = getDB();
  const events = db.collection("events");

  // Map camelCase from frontend to snake_case for database
  const mappedUpdates = {
    ...updates,
    // Field name mappings from frontend camelCase to database snake_case
    ...(updates.longDescription && {
      long_description: updates.longDescription,
    }),
    ...(updates.prizePool && { prize_pool: updates.prizePool }),
    ...(updates.registrationLink && {
      registration_link: updates.registrationLink,
    }),
  };

  // Remove the camelCase versions so they don't get stored
  delete mappedUpdates.longDescription;
  delete mappedUpdates.prizePool;
  delete mappedUpdates.registrationLink;

  const result = await events.updateOne(
    { _id: eventId },
    {
      $set: {
        ...mappedUpdates,
        updated_at: new Date(),
      },
    }
  );

  return result.modifiedCount > 0;
}

// Delete event
export async function deleteEvent(eventId) {
  const db = getDB();
  const events = db.collection("events");

  const result = await events.deleteOne({ _id: eventId });
  return result.deletedCount > 0;
}

// Get upcoming events
export async function getUpcomingEvents() {
  const db = getDB();
  const events = db.collection("events");
  return await events.find({ status: "upcoming" }).sort({ date: 1 }).toArray();
}
