"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getGalleryCategories = exports.uploadGalleryImage = exports.deleteGalleryItem = exports.updateGalleryItem = exports.createGalleryItem = exports.getGalleryItemById = exports.getAllGalleryItems = void 0;
const uuid_1 = require("uuid");
const gallery_model_1 = __importDefault(require("../models/gallery.model"));
const cloudinary_service_1 = __importDefault(require("../services/cloudinary.service"));
const getAllGalleryItems = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { category, isActive } = req.query;
        const filter = {};
        if (category) {
            filter.category = category;
        }
        if (isActive !== undefined) {
            filter.isActive = isActive === "true";
        }
        const galleryItems = yield gallery_model_1.default.find(filter).sort({ createdAt: -1 });
        res.status(200).json({
            success: true,
            message: "Gallery items retrieved successfully",
            data: galleryItems,
        });
    }
    catch (error) {
        console.error("Error retrieving gallery items:", error);
        res.status(500).json({
            success: false,
            message: "Failed to retrieve gallery items",
            error: error.message,
        });
    }
});
exports.getAllGalleryItems = getAllGalleryItems;
const getGalleryItemById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const galleryItem = yield gallery_model_1.default.findOne({ galleryId: id });
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
    }
    catch (error) {
        console.error("Error retrieving gallery item:", error);
        res.status(500).json({
            success: false,
            message: "Failed to retrieve gallery item",
            error: error.message,
        });
    }
});
exports.getGalleryItemById = getGalleryItemById;
const createGalleryItem = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { title, description, category, imageUrl } = req.body;
        if (!title || !imageUrl) {
            res.status(400).json({
                success: false,
                message: "Title and image URL are required",
            });
            return;
        }
        const galleryId = (0, uuid_1.v4)();
        const newGalleryItem = new gallery_model_1.default({
            galleryId,
            title,
            description,
            imageUrl,
            category: category || "general",
            isActive: true,
        });
        const savedGalleryItem = yield newGalleryItem.save();
        res.status(201).json({
            success: true,
            message: "Gallery item created successfully",
            data: savedGalleryItem,
        });
    }
    catch (error) {
        console.error("Error creating gallery item:", error);
        res.status(500).json({
            success: false,
            message: "Failed to create gallery item",
            error: error.message,
        });
    }
});
exports.createGalleryItem = createGalleryItem;
const updateGalleryItem = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const { title, description, category, imageUrl, isActive } = req.body;
        const galleryItem = yield gallery_model_1.default.findOne({ galleryId: id });
        if (!galleryItem) {
            res.status(404).json({
                success: false,
                message: "Gallery item not found",
            });
            return;
        }
        if (title)
            galleryItem.title = title;
        if (description !== undefined)
            galleryItem.description = description;
        if (category)
            galleryItem.category = category;
        if (imageUrl)
            galleryItem.imageUrl = imageUrl;
        if (isActive !== undefined)
            galleryItem.isActive = isActive;
        const updatedGalleryItem = yield galleryItem.save();
        res.status(200).json({
            success: true,
            message: "Gallery item updated successfully",
            data: updatedGalleryItem,
        });
    }
    catch (error) {
        console.error("Error updating gallery item:", error);
        res.status(500).json({
            success: false,
            message: "Failed to update gallery item",
            error: error.message,
        });
    }
});
exports.updateGalleryItem = updateGalleryItem;
const deleteGalleryItem = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const galleryItem = yield gallery_model_1.default.findOne({ galleryId: id });
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
        yield gallery_model_1.default.deleteOne({ galleryId: id });
        res.status(200).json({
            success: true,
            message: "Gallery item deleted successfully",
        });
    }
    catch (error) {
        console.error("Error deleting gallery item:", error);
        res.status(500).json({
            success: false,
            message: "Failed to delete gallery item",
            error: error.message,
        });
    }
});
exports.deleteGalleryItem = deleteGalleryItem;
const uploadGalleryImage = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (!req.files || !req.files.image) {
            res.status(400).json({
                success: false,
                message: "No image file provided",
            });
            return;
        }
        const file = req.files.image;
        const result = yield cloudinary_service_1.default.uploadImage(file.tempFilePath, {
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
    }
    catch (error) {
        console.error("Error uploading image:", error);
        res.status(500).json({
            success: false,
            message: "Failed to upload image",
            error: error.message,
        });
    }
});
exports.uploadGalleryImage = uploadGalleryImage;
const getGalleryCategories = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const categories = yield gallery_model_1.default.distinct("category");
        res.status(200).json({
            success: true,
            message: "Gallery categories retrieved successfully",
            data: categories,
        });
    }
    catch (error) {
        console.error("Error retrieving gallery categories:", error);
        res.status(500).json({
            success: false,
            message: "Failed to retrieve gallery categories",
            error: error.message,
        });
    }
});
exports.getGalleryCategories = getGalleryCategories;
