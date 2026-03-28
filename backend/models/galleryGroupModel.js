import { getDB } from "../config/mongodb.js";
import { v4 as uuidv4 } from "uuid";

// Create a new gallery group with multiple images
export async function createGalleryGroup(
  groupName,
  images, // Array of { imageUrl, cloudinaryPublicId, caption }
  uploadedBy
) {
  const db = getDB();
  const galleryGroups = db.collection("gallery_groups");

  const group = {
    _id: uuidv4(),
    group_name: groupName,
    thumbnail_image: images[0]?.imageUrl || "", // First image as thumbnail
    images: images.map((img, idx) => ({
      _id: uuidv4(),
      image_url: img.imageUrl,
      cloudinary_public_id: img.cloudinaryPublicId,
      caption: img.caption || "",
      position: idx,
    })),
    total_images: images.length,
    uploaded_by: uploadedBy,
    created_at: new Date(),
    updated_at: new Date(),
  };

  await galleryGroups.insertOne(group);
  return group;
}

// Get all gallery groups
export async function getAllGalleryGroups() {
  try {
    const db = getDB();
    const galleryGroups = db.collection("gallery_groups");
    const groups = await galleryGroups
      .find({})
      .sort({ created_at: -1 })
      .toArray();
    return { groups, error: null };
  } catch (error) {
    return { groups: null, error };
  }
}

// Get single gallery group by ID
export async function getGalleryGroupById(groupId) {
  try {
    const db = getDB();
    const galleryGroups = db.collection("gallery_groups");
    const group = await galleryGroups.findOne({ _id: groupId });
    return { group, error: null };
  } catch (error) {
    return { group: null, error };
  }
}

// Update gallery group (name, images, etc.)
export async function updateGalleryGroup(groupId, updates) {
  try {
    const db = getDB();
    const galleryGroups = db.collection("gallery_groups");

    const result = await galleryGroups.updateOne(
      { _id: groupId },
      {
        $set: {
          ...updates,
          updated_at: new Date(),
        },
      }
    );

    return { success: result.modifiedCount > 0, error: null };
  } catch (error) {
    return { success: false, error };
  }
}

// Delete gallery group (removes all images references)
export async function deleteGalleryGroup(groupId) {
  try {
    const db = getDB();
    const galleryGroups = db.collection("gallery_groups");
    const result = await galleryGroups.deleteOne({ _id: groupId });
    return { success: result.deletedCount > 0, error: null };
  } catch (error) {
    return { success: false, error };
  }
}

// Add image to existing group
export async function addImageToGroup(
  groupId,
  imageUrl,
  cloudinaryPublicId,
  caption
) {
  try {
    const db = getDB();
    const galleryGroups = db.collection("gallery_groups");

    // Get current group to determine next position
    const group = await galleryGroups.findOne({ _id: groupId });
    if (!group) {
      return { success: false, error: "Group not found" };
    }

    const nextPosition = group.images.length;

    const result = await galleryGroups.updateOne(
      { _id: groupId },
      {
        $push: {
          images: {
            _id: uuidv4(),
            image_url: imageUrl,
            cloudinary_public_id: cloudinaryPublicId,
            caption: caption || "",
            position: nextPosition,
          },
        },
        $set: {
          total_images: group.images.length + 1,
          updated_at: new Date(),
        },
      }
    );

    return { success: result.modifiedCount > 0, error: null };
  } catch (error) {
    return { success: false, error };
  }
}

// Delete image from group
export async function deleteImageFromGroup(groupId, imageId) {
  try {
    const db = getDB();
    const galleryGroups = db.collection("gallery_groups");

    // Get current group
    const group = await galleryGroups.findOne({ _id: groupId });
    if (!group) {
      return { success: false, error: "Group not found" };
    }

    // If this is the thumbnail image, set new thumbnail
    const imageBeingDeleted = group.images.find((img) => img._id === imageId);
    let updateObj = {
      $pull: { images: { _id: imageId } },
      $set: {
        total_images: group.images.length - 1,
        updated_at: new Date(),
      },
    };

    // If deleting thumbnail, set first remaining image as thumbnail
    if (
      imageBeingDeleted?.image_url === group.thumbnail_image &&
      group.images.length > 1
    ) {
      const newThumbnail = group.images.find((img) => img._id !== imageId);
      updateObj.$set.thumbnail_image = newThumbnail.image_url;
    }

    const result = await galleryGroups.updateOne({ _id: groupId }, updateObj);

    return { success: result.modifiedCount > 0, error: null };
  } catch (error) {
    return { success: false, error };
  }
}

// Set thumbnail for group
export async function setGroupThumbnail(groupId, imageId) {
  try {
    const db = getDB();
    const galleryGroups = db.collection("gallery_groups");

    // Get group and find the image URL
    const group = await galleryGroups.findOne({ _id: groupId });
    if (!group) {
      return { success: false, error: "Group not found" };
    }

    const image = group.images.find((img) => img._id === imageId);
    if (!image) {
      return { success: false, error: "Image not found in group" };
    }

    const result = await galleryGroups.updateOne(
      { _id: groupId },
      {
        $set: {
          thumbnail_image: image.image_url,
          updated_at: new Date(),
        },
      }
    );

    return { success: result.modifiedCount > 0, error: null };
  } catch (error) {
    return { success: false, error };
  }
}
