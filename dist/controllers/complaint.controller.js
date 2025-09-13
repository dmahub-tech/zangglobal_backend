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
Object.defineProperty(exports, "__esModule", { value: true });
exports.ComplaintController = void 0;
const complaint_service_1 = require("../services/complaint.service");
const email_service_1 = require("../services/email/email.service");
class ComplaintController {
    constructor() {
        this.complaintService = new complaint_service_1.ComplaintService();
        this.emailService = new email_service_1.EmailService();
        // Bind the methods to ensure 'this' context is preserved
        this.postComplaint = this.postComplaint.bind(this);
        this.getAllComplaints = this.getAllComplaints.bind(this);
        this.updateComplaintStatus = this.updateComplaintStatus.bind(this);
    }
    postComplaint(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { name, email, message, userType } = req.body;
                // Generate 6 digit random complaint number
                const complaintNumber = Math.floor(100000 + Math.random() * 900000).toString();
                const complaintData = {
                    complaintNumber,
                    name,
                    email,
                    message,
                    userType,
                };
                const complaint = yield this.complaintService.create(complaintData);
                // Send confirmation email
                yield this.emailService.sendComplaintConfirmationEmail(email, complaintNumber, message);
                res.status(201).json({
                    success: true,
                    message: "Complaint registered successfully",
                    complaint,
                });
            }
            catch (error) {
                res.status(500).json({
                    success: false,
                    message: "Error registering complaint",
                    error: error.message,
                });
            }
        });
    }
    getAllComplaints(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const complaints = yield this.complaintService.findAll();
                res.status(200).json({
                    success: true,
                    complaints,
                });
            }
            catch (error) {
                res.status(500).json({
                    success: false,
                    message: "Error fetching complaints",
                    error: error.message,
                });
            }
        });
    }
    updateComplaintStatus(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { complaintId, status } = req.body;
                const updatedComplaint = yield this.complaintService.updateStatus(complaintId, status);
                if (!updatedComplaint) {
                    res.status(404).json({
                        success: false,
                        message: "Complaint not found",
                    });
                    return;
                }
                res.status(200).json({
                    success: true,
                    message: "Complaint status updated successfully",
                    complaint: updatedComplaint,
                });
            }
            catch (error) {
                res.status(500).json({
                    success: false,
                    message: "Error updating complaint status",
                    error: error.message,
                });
            }
        });
    }
}
exports.ComplaintController = ComplaintController;
