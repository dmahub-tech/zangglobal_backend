"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// models/Volunteer.js
const mongoose = require("mongoose");
const volunteerSchema = new mongoose.Schema({
    fullName: {
        type: String,
        required: true,
        trim: true,
    },
    email: {
        type: String,
        required: true,
        trim: true,
        lowercase: true,
    },
    phone: {
        type: String,
        trim: true,
    },
    whatsapp: {
        type: String,
        required: true,
        trim: true,
    },
    residence: {
        type: String,
        required: true,
        trim: true,
    },
    ageRange: {
        type: String,
        required: true,
        enum: ["18–25", "26–35", "36+"],
    },
    occupation: {
        type: String,
        trim: true,
        default: "",
    },
    roles: [
        {
            type: String,
            trim: true,
        },
    ],
    motivation: {
        type: String,
        trim: true,
    },
    experience: {
        type: String,
        enum: ["yes", "no", ""],
    },
    experienceDetails: {
        type: String,
        trim: true,
    },
    availability: {
        type: String,
        required: true,
        enum: [
            "Full-day on October 26th",
            "Partial-day on October 26th",
            "Available before and during the event",
        ],
    },
    shirtSize: {
        type: String,
        enum: ["S", "M", "L", "XL", "XXL", ""],
    },
    emergencyContact: {
        type: String,
        required: true,
        trim: true,
    },
    status: {
        type: String,
        enum: ["pending", "approved", "rejected"],
        default: "pending",
    },
}, {
    timestamps: true,
});
// Index for better search performance
volunteerSchema.index({ email: 1 });
volunteerSchema.index({ status: 1 });
volunteerSchema.index({ fullName: "text", email: "text", residence: "text" });
const Volunteer = mongoose.model("Volunteer", volunteerSchema);
exports.default = Volunteer;
