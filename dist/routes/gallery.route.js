"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const authenticate_seller_middleware_1 = require("../middlewares/authenticate-seller.middleware");
const gallery_controller_1 = require("../controllers/gallery.controller");
const router = express_1.default.Router();
// Public routes
router.get("/", gallery_controller_1.getAllGalleryItems);
router.get("/categories", gallery_controller_1.getGalleryCategories);
router.get("/:id", gallery_controller_1.getGalleryItemById);
// Admin routes (protected)
router.post("/", authenticate_seller_middleware_1.authenticateSeller, gallery_controller_1.createGalleryItem);
router.put("/:id", authenticate_seller_middleware_1.authenticateSeller, gallery_controller_1.updateGalleryItem);
router.delete("/:id", authenticate_seller_middleware_1.authenticateSeller, gallery_controller_1.deleteGalleryItem);
router.post("/upload", authenticate_seller_middleware_1.authenticateSeller, gallery_controller_1.uploadGalleryImage);
exports.default = router;
