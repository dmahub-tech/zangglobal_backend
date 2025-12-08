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
exports.CloudinaryService = void 0;
const cloudinary_1 = __importDefault(require("cloudinary"));
const dotenv_1 = __importDefault(require("dotenv"));
// Load environment variables
dotenv_1.default.config();
class CloudinaryService {
    constructor() {
        // Initialize cloudinary
        this.cloudinaryV2 = cloudinary_1.default.v2;
        // Configure Cloudinary
        this.cloudinaryV2.config({
            cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
            api_key: process.env.CLOUDINARY_API_KEY,
            api_secret: process.env.CLOUDINARY_API_SECRET,
        });
    }
    /**
     * Upload an image to Cloudinary
     * @param filePath Path to the file to upload
     * @param options Optional upload options
     * @returns Promise with upload result
     */
    uploadImage(filePath_1) {
        return __awaiter(this, arguments, void 0, function* (filePath, options = {}) {
            const defaultOptions = Object.assign({ folder: "uploads" }, options);
            return (yield this.cloudinaryV2.uploader.upload(filePath, defaultOptions));
        });
    }
    /**
     * Delete an image from Cloudinary
     * @param publicId Public ID of the image to delete
     * @returns Promise with deletion result
     */
    deleteImage(publicId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.cloudinaryV2.uploader.destroy(publicId);
        });
    }
}
exports.CloudinaryService = CloudinaryService;
// Create and export a default instance
const cloudinaryService = new CloudinaryService();
exports.default = cloudinaryService;
