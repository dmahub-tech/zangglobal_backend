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
const volunteer_models_1 = __importDefault(require("../models/volunteer.models"));
class VolunteerController {
    // Get all volunteers
    getAllVolunteers(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const volunteers = yield volunteer_models_1.default.find().sort({ createdAt: -1 });
                res.json(volunteers);
            }
            catch (error) {
                res.status(500).json({ message: error.message });
            }
        });
    }
    // Create a new volunteer
    createVolunteer(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const volunteer = new volunteer_models_1.default(req.body);
                const savedVolunteer = yield volunteer.save();
                res.status(201).json(savedVolunteer);
            }
            catch (error) {
                res.status(400).json({ message: error.message });
            }
        });
    }
    // Get a single volunteer
    getVolunteer(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const volunteer = yield volunteer_models_1.default.findById(req.params.id);
                if (!volunteer) {
                    res.status(404).json({ message: "Volunteer not found" });
                    return;
                }
                res.json(volunteer);
            }
            catch (error) {
                res.status(500).json({ message: error.message });
            }
        });
    }
    // Update a volunteer
    updateVolunteer(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const volunteer = yield volunteer_models_1.default.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
                if (!volunteer) {
                    res.status(404).json({ message: "Volunteer not found" });
                    return;
                }
                res.json(volunteer);
            }
            catch (error) {
                res.status(400).json({ message: error.message });
            }
        });
    }
    // Delete a volunteer
    deleteVolunteer(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const volunteer = yield volunteer_models_1.default.findByIdAndDelete(req.params.id);
                if (!volunteer) {
                    res.status(404).json({ message: "Volunteer not found" });
                    return;
                }
                res.json({ message: "Volunteer deleted successfully" });
            }
            catch (error) {
                res.status(500).json({ message: error.message });
            }
        });
    }
}
exports.default = new VolunteerController();
