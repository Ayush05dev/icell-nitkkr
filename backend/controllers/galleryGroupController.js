import * as galleryGroupModel from "../models/galleryGroupModel.js";
import cloudinary from "cloudinary";

// Configure Cloudinary
cloudinary.v2.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// ── Gallery Group Operations ────────────────────────────────────────────────

// GET /api/gallery-groups - get all groups
export async function getAllGalleryGroups(req, res) {
  try {
    const { groups, error } = await galleryGroupModel.getAllGalleryGroups();
    if (error) {
      return res.status(500).json({ error: "Failed to fetch gallery groups" });
    }
    res.json(groups || []);
  } catch (err) {
    console.error("Error fetching gallery groups:", err);
    res.status(500).json({ error: "Server error" });
  }
}

// GET /api/gallery-groups/:groupId - get single group with all images
export async function getGalleryGroup(req, res) {
  try {
    const { groupId } = req.params;

    if (!groupId) {
      return res.status(400).json({ error: "Group ID required" });
    }

    const { group, error } = await galleryGroupModel.getGalleryGroupById(
      groupId
    );
    if (error) {
      return res.status(500).json({ error: "Failed to fetch group" });
    }

    if (!group) {
      return res.status(404).json({ error: "Group not found" });
    }

    res.json(group);
  } catch (err) {
    console.error("Error fetching gallery group:", err);
    res.status(500).json({ error: "Server error" });
  }
}

// POST /api/gallery-groups - create new group with multiple images (admin only)
export async function createGalleryGroup(req, res) {
  try {
    const { group_name, images } = req.body;

    // Validation
    if (!group_name || !group_name.trim()) {
      return res.status(400).json({ error: "Group name is required" });
    }

    if (!Array.isArray(images) || images.length === 0) {
      return res.status(400).json({ error: "At least one image is required" });
    }

    if (images.length > 20) {
      return res.status(400).json({ error: "Maximum 20 images per group" });
    }

    // Validate all images
    for (const img of images) {
      if (!img.imageUrl) {
        return res
          .status(400)
          .json({ error: "Image URL is required for all images" });
      }
      if (!img.cloudinaryPublicId) {
        return res
          .status(400)
          .json({ error: "Cloudinary Public ID is required for all images" });
      }
      if (!img.imageUrl.includes("cloudinary.com")) {
        return res
          .status(400)
          .json({ error: "All images must be from Cloudinary" });
      }
    }

    const userId = req.user?.userId;
    if (!userId) {
      return res.status(401).json({ error: "User not authenticated" });
    }

    // Create group
    const group = await galleryGroupModel.createGalleryGroup(
      group_name.trim(),
      images,
      userId
    );

    if (!group) {
      return res.status(500).json({ error: "Failed to create gallery group" });
    }

    res.status(201).json({
      message: "Gallery group created successfully",
      group: {
        _id: group._id,
        group_name: group.group_name,
        thumbnail_image: group.thumbnail_image,
        total_images: group.total_images,
        created_at: group.created_at,
      },
    });
  } catch (err) {
    console.error("Error creating gallery group:", err);
    res.status(500).json({ error: "Server error during group creation" });
  }
}

// PATCH /api/gallery-groups/:groupId - update group (admin only)
export async function updateGalleryGroup(req, res) {
  try {
    const { groupId } = req.params;
    const updates = req.body;

    if (!groupId) {
      return res.status(400).json({ error: "Group ID required" });
    }

    // Verify group exists
    const { group: existingGroup } =
      await galleryGroupModel.getGalleryGroupById(groupId);
    if (!existingGroup) {
      return res.status(404).json({ error: "Group not found" });
    }

    // Only allow updating group_name and certain fields
    const allowedUpdates = ["group_name"];
    const filteredUpdates = {};

    for (const key of allowedUpdates) {
      if (key in updates) {
        filteredUpdates[key] = updates[key];
      }
    }

    const { success, error } = await galleryGroupModel.updateGalleryGroup(
      groupId,
      filteredUpdates
    );

    if (error || !success) {
      return res.status(500).json({ error: "Failed to update group" });
    }

    res.json({ message: "Gallery group updated successfully" });
  } catch (err) {
    console.error("Error updating gallery group:", err);
    res.status(500).json({ error: "Server error" });
  }
}

// DELETE /api/gallery-groups/:groupId - delete entire group (admin only)
export async function deleteGalleryGroup(req, res) {
  try {
    const { groupId } = req.params;

    if (!groupId) {
      return res.status(400).json({ error: "Group ID required" });
    }

    // Get group to find all images for deletion from Cloudinary
    const { group } = await galleryGroupModel.getGalleryGroupById(groupId);
    if (!group) {
      return res.status(404).json({ error: "Group not found" });
    }

    // Delete all images from Cloudinary
    for (const image of group.images) {
      if (image.cloudinary_public_id) {
        try {
          await cloudinary.v2.uploader.destroy(image.cloudinary_public_id);
        } catch (err) {
          console.error(
            `Failed to delete Cloudinary image ${image.cloudinary_public_id}:`,
            err
          );
        }
      }
    }

    // Delete group from database
    const { success, error } = await galleryGroupModel.deleteGalleryGroup(
      groupId
    );

    if (error || !success) {
      return res.status(500).json({ error: "Failed to delete group" });
    }

    res.json({
      message: "Gallery group deleted successfully",
      groupId: groupId,
    });
  } catch (err) {
    console.error("Error deleting gallery group:", err);
    res.status(500).json({ error: "Server error" });
  }
}

// POST /api/gallery-groups/:groupId/images - add image to existing group (admin only)
export async function addImageToGroup(req, res) {
  try {
    const { groupId } = req.params;
    const { imageUrl, cloudinaryPublicId, caption } = req.body;

    if (!groupId) {
      return res.status(400).json({ error: "Group ID required" });
    }

    if (!imageUrl || !cloudinaryPublicId) {
      return res
        .status(400)
        .json({ error: "Image URL and Cloudinary Public ID required" });
    }

    if (!imageUrl.includes("cloudinary.com")) {
      return res.status(400).json({ error: "Invalid image source" });
    }

    // Get group to check image count
    const { group } = await galleryGroupModel.getGalleryGroupById(groupId);
    if (!group) {
      return res.status(404).json({ error: "Group not found" });
    }

    if (group.images.length >= 20) {
      return res
        .status(400)
        .json({ error: "Maximum 20 images per group reached" });
    }

    const { success, error } = await galleryGroupModel.addImageToGroup(
      groupId,
      imageUrl,
      cloudinaryPublicId,
      caption
    );

    if (error || !success) {
      return res.status(500).json({ error: "Failed to add image to group" });
    }

    res.json({ message: "Image added to group successfully" });
  } catch (err) {
    console.error("Error adding image to group:", err);
    res.status(500).json({ error: "Server error" });
  }
}

// DELETE /api/gallery-groups/:groupId/images/:imageId - delete image from group (admin only)
export async function deleteImageFromGroup(req, res) {
  try {
    const { groupId, imageId } = req.params;

    if (!groupId || !imageId) {
      return res.status(400).json({ error: "Group ID and Image ID required" });
    }

    // Get group and image info for Cloudinary deletion
    const { group } = await galleryGroupModel.getGalleryGroupById(groupId);
    if (!group) {
      return res.status(404).json({ error: "Group not found" });
    }

    const image = group.images.find((img) => img._id === imageId);
    if (!image) {
      return res.status(404).json({ error: "Image not found" });
    }

    // Delete from Cloudinary
    if (image.cloudinary_public_id) {
      try {
        await cloudinary.v2.uploader.destroy(image.cloudinary_public_id);
      } catch (err) {
        console.error(
          `Failed to delete Cloudinary image ${image.cloudinary_public_id}:`,
          err
        );
      }
    }

    // Delete from group
    const { success, error } = await galleryGroupModel.deleteImageFromGroup(
      groupId,
      imageId
    );

    if (error || !success) {
      return res.status(500).json({ error: "Failed to delete image" });
    }

    res.json({ message: "Image deleted from group successfully" });
  } catch (err) {
    console.error("Error deleting image from group:", err);
    res.status(500).json({ error: "Server error" });
  }
}

// PATCH /api/gallery-groups/:groupId/thumbnail/:imageId - set thumbnail (admin only)
export async function setGroupThumbnail(req, res) {
  try {
    const { groupId, imageId } = req.params;

    if (!groupId || !imageId) {
      return res.status(400).json({ error: "Group ID and Image ID required" });
    }

    const { success, error } = await galleryGroupModel.setGroupThumbnail(
      groupId,
      imageId
    );

    if (error || !success) {
      return res
        .status(500)
        .json({ error: error?.message || "Failed to set thumbnail" });
    }

    res.json({ message: "Thumbnail updated successfully" });
  } catch (err) {
    console.error("Error setting thumbnail:", err);
    res.status(500).json({ error: "Server error" });
  }
}
