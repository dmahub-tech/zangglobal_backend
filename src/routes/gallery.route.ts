import express from "express";

import { authenticateSeller } from "../middlewares/authenticate-seller.middleware";
import { createGalleryItem, deleteGalleryItem, getAllGalleryItems, getGalleryCategories, getGalleryItemById, updateGalleryItem, uploadGalleryImage } from "../controllers/gallery.controller";

const router = express.Router();

// Public routes
router.get("/", getAllGalleryItems);
router.get("/categories", getGalleryCategories);
router.get("/:id", getGalleryItemById);

// Admin routes (protected)
router.post("/", authenticateSeller, createGalleryItem);
router.put("/:id", authenticateSeller, updateGalleryItem);
router.delete("/:id", authenticateSeller, deleteGalleryItem);
router.post("/upload", authenticateSeller, uploadGalleryImage);

export default router;