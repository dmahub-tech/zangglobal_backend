"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const complaint_controller_1 = require("../controllers/complaint.controller");
const router = express_1.default.Router();
const complaintController = new complaint_controller_1.ComplaintController();
router.post("/post-complaints", complaintController.postComplaint);
// Get all complaints route
router.get("/get-complaints", complaintController.getAllComplaints);
// Update complaint status route
router.put("/update-complaint-status", complaintController.updateComplaintStatus);
exports.default = router;
