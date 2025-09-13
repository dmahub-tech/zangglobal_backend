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
exports.UploadController = void 0;
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const cloudinary_service_1 = require("../services/cloudinary.service");
class UploadController {
    constructor() {
        this.cloudinaryService = new cloudinary_service_1.CloudinaryService();
        this.uploadImage = this.uploadImage.bind(this);
        this.uploadMultipleImages = this.uploadMultipleImages.bind(this);
    }
    uploadImage(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (!req.files || !req.files.files) {
                    res.status(400).json({
                        success: false,
                        message: "No image file provided",
                    });
                    return;
                }
                const file = req.files.files;
                // Validate file type
                if (!file.mimetype.startsWith("image/")) {
                    res.status(400).json({
                        success: false,
                        message: "Only image files are allowed",
                    });
                    return;
                }
                const uploadPath = path_1.default.join(__dirname, "..", "uploads", `${Date.now()}-${file.name}`);
                // Move the file to uploads directory
                yield file.mv(uploadPath);
                // Upload the image to Cloudinary
                const uploadResult = yield this.cloudinaryService.uploadImage(uploadPath);
                // Delete the file from the server after uploading
                fs_1.default.unlinkSync(uploadPath);
                res.status(200).json({
                    success: true,
                    message: "Image uploaded successfully",
                    imageUrl: uploadResult.secure_url,
                });
            }
            catch (error) {
                console.error("Upload error:", error);
                res.status(500).json({
                    success: false,
                    message: "Error uploading image",
                    error: error.message,
                });
            }
        });
    }
    uploadMultipleImages(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (!req.files || !req.files.files) {
                    res.status(400).json({
                        success: false,
                        message: "No images provided",
                    });
                    return;
                }
                let files = [];
                // Handle both single file and array of files
                if (Array.isArray(req.files.files)) {
                    files = req.files.files;
                }
                else {
                    files = [req.files.files];
                }
                // Validate files
                for (const file of files) {
                    if (!file.mimetype.startsWith("image/")) {
                        res.status(400).json({
                            success: false,
                            message: `File ${file.name} is not an image`,
                        });
                        return;
                    }
                }
                // Process each file
                const uploadPaths = [];
                for (const file of files) {
                    const uploadPath = path_1.default.join(__dirname, "..", "uploads", `${Date.now()}-${file.name}`);
                    yield file.mv(uploadPath);
                    uploadPaths.push(uploadPath);
                }
                // Upload all images to Cloudinary
                const uploadResults = yield Promise.all(uploadPaths.map((path) => this.cloudinaryService.uploadImage(path)));
                // Clean up files
                uploadPaths.forEach((path) => fs_1.default.unlinkSync(path));
                res.status(200).json({
                    success: true,
                    message: "Images uploaded successfully",
                    imageUrls: uploadResults.map((result) => result.secure_url),
                });
            }
            catch (error) {
                console.error("Upload error:", error);
                res.status(500).json({
                    success: false,
                    message: "Error uploading images",
                    error: error.message,
                });
            }
        });
    }
}
exports.UploadController = UploadController;
