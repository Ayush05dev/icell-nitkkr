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
  createdBy
) {
  const db = getDB();
  const events = db.collection("events");

  const event = {
    _id: uuidv4(),
    name,
    description,
    date: new Date(date),
    time,
    location,
    image,
    category,
    capacity,
    attendees: 0,
    status: "upcoming",
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

  const result = await events.updateOne(
    { _id: eventId },
    {
      $set: {
        ...updates,
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
