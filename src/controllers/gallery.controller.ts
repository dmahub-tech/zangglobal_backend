import { Request, Response } from "express";
import { v4 as uuidv4 } from "uuid";
import GalleryModel, { IGallery } from "../models/gallery.model";
import cloudinaryService from "../services/cloudinary.service";

export const getAllGalleryItems = async (req: Request, res: Response): Promise<void> => {
	try {
		const { category, isActive } = req.query;
		const filter: any = {};

		if (category) {
			filter.category = category;
		}

		if (isActive !== undefined) {
			filter.isActive = isActive === "true";
		}

		const galleryItems = await GalleryModel.find(filter).sort({ createdAt: -1 });

		res.status(200).json({
			success: true,
			message: "Gallery items retrieved successfully",
			data: galleryItems,
		});
	} catch (error: any) {
		console.error("Error retrieving gallery items:", error);
		res.status(500).json({
			success: false,
			message: "Failed to retrieve gallery items",
			error: error.message,
		});
	}
};

export const getGalleryItemById = async (req: Request, res: Response): Promise<void> => {
	try {
		const { id } = req.params;
		const galleryItem = await GalleryModel.findOne({ galleryId: id });

		if (!galleryItem) {
			res.status(404).json({
				success: false,
				message: "Gallery item not found",
			});
			return;
		}

		res.status(200).json({
			success: true,
			message: "Gallery item retrieved successfully",
			data: galleryItem,
		});
	} catch (error: any) {
		console.error("Error retrieving gallery item:", error);
		res.status(500).json({
			success: false,
			message: "Failed to retrieve gallery item",
			error: error.message,
		});
	}
};

export const createGalleryItem = async (req: Request, res: Response): Promise<void> => {
	try {
		const { title, description, category, imageUrl } = req.body;

		if (!title || !imageUrl) {
			res.status(400).json({
				success: false,
				message: "Title and image URL are required",
			});
			return;
		}

		const galleryId = uuidv4();

		const newGalleryItem = new GalleryModel({
			galleryId,
			title,
			description,
			imageUrl,
			category: category || "general",
			isActive: true,
		});

		const savedGalleryItem = await newGalleryItem.save();

		res.status(201).json({
			success: true,
			message: "Gallery item created successfully",
			data: savedGalleryItem,
		});
	} catch (error: any) {
		console.error("Error creating gallery item:", error);
		res.status(500).json({
			success: false,
			message: "Failed to create gallery item",
			error: error.message,
		});
	}
};

export const updateGalleryItem = async (req: Request, res: Response): Promise<void> => {
	try {
		const { id } = req.params;
		const { title, description, category, imageUrl, isActive } = req.body;

		const galleryItem = await GalleryModel.findOne({ galleryId: id });

		if (!galleryItem) {
			res.status(404).json({
				success: false,
				message: "Gallery item not found",
			});
			return;
		}

		if (title) galleryItem.title = title;
		if (description !== undefined) galleryItem.description = description;
		if (category) galleryItem.category = category;
		if (imageUrl) galleryItem.imageUrl = imageUrl;
		if (isActive !== undefined) galleryItem.isActive = isActive;

		const updatedGalleryItem = await galleryItem.save();

		res.status(200).json({
			success: true,
			message: "Gallery item updated successfully",
			data: updatedGalleryItem,
		});
	} catch (error: any) {
		console.error("Error updating gallery item:", error);
		res.status(500).json({
			success: false,
			message: "Failed to update gallery item",
			error: error.message,
		});
	}
};

export const deleteGalleryItem = async (req: Request, res: Response): Promise<void> => {
	try {
		const { id } = req.params;

		const galleryItem = await GalleryModel.findOne({ galleryId: id });

		if (!galleryItem) {
			res.status(404).json({
				success: false,
				message: "Gallery item not found",
			});
			return;
		}

		// Optional: Delete image from Cloudinary if needed
		// You can extract the public_id from the imageUrl and delete it
		// const publicId = extractPublicIdFromUrl(galleryItem.imageUrl);
		// await cloudinary.uploader.destroy(publicId);

		await GalleryModel.deleteOne({ galleryId: id });

		res.status(200).json({
			success: true,
			message: "Gallery item deleted successfully",
		});
	} catch (error: any) {
		console.error("Error deleting gallery item:", error);
		res.status(500).json({
			success: false,
			message: "Failed to delete gallery item",
			error: error.message,
		});
	}
};

export const uploadGalleryImage = async (req: Request, res: Response): Promise<void> => {
	try {
		if (!req.files || !req.files.image) {
			res.status(400).json({
				success: false,
				message: "No image file provided",
			});
			return;
		}

		const file = req.files.image as any;

		const result = await cloudinaryService.uploadImage(file.tempFilePath, {
			folder: "gallery",
			resource_type: "image",
		});

		res.status(200).json({
			success: true,
			message: "Image uploaded successfully",
			data: {
				imageUrl: result.secure_url,
				publicId: result.public_id,
			},
		});
	} catch (error: any) {
		console.error("Error uploading image:", error);
		res.status(500).json({
			success: false,
			message: "Failed to upload image",
			error: error.message,
		});
	}
};

export const getGalleryCategories = async (req: Request, res: Response): Promise<void> => {
	try {
		const categories = await GalleryModel.distinct("category");

		res.status(200).json({
			success: true,
			message: "Gallery categories retrieved successfully",
			data: categories,
		});
	} catch (error: any) {
		console.error("Error retrieving gallery categories:", error);
		res.status(500).json({
			success: false,
			message: "Failed to retrieve gallery categories",
			error: error.message,
		});
	}
};