"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const upload_controller_1 = require("../controllers/upload.controller");
const router = (0, express_1.Router)();
const uploadController = new upload_controller_1.UploadController();
// Single file upload route - no additional middleware
router.post("/doc-upload", uploadController.uploadImage);
// Multiple files upload route - no additional middleware
router.post("/docs-upload", uploadController.uploadMultipleImages);
exports.default = router;
