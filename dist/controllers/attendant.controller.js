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
const attendance_model_1 = __importDefault(require("../models/attendance.model"));
class AttendantController {
    // Get all attendants
    getAllAttendants(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const attendants = yield attendance_model_1.default.find().sort({ createdAt: -1 });
                res.json(attendants);
            }
            catch (error) {
                res.status(500).json({ message: error.message });
            }
        });
    }
    // Create a new attendant
    createAttendant(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            try {
                const data = (_a = req.body) === null || _a === void 0 ? void 0 : _a.formData;
                const attendant = new attendance_model_1.default(data);
                console.log('Creating attendant with data:', data);
                const savedAttendant = yield attendant.save();
                res.status(201).json(savedAttendant);
            }
            catch (error) {
                res.status(400).json({ message: error.message });
            }
        });
    }
    // Get a single attendant
    getAttendant(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const attendant = yield attendance_model_1.default.findById(req.params.id);
                if (!attendant) {
                    res.status(404).json({ message: "Attendant not found" });
                    return;
                }
                res.json(attendant);
            }
            catch (error) {
                res.status(500).json({ message: error.message });
            }
        });
    }
    // Update an attendant
    updateAttendant(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const attendant = yield attendance_model_1.default.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
                if (!attendant) {
                    res.status(404).json({ message: "Attendant not found" });
                    return;
                }
                res.json(attendant);
            }
            catch (error) {
                res.status(400).json({ message: error.message });
            }
        });
    }
    // Delete an attendant
    deleteAttendant(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const attendant = yield attendance_model_1.default.findByIdAndDelete(req.params.id);
                if (!attendant) {
                    res.status(404).json({ message: "Attendant not found" });
                    return;
                }
                res.json({ message: "Attendant deleted successfully" });
            }
            catch (error) {
                res.status(500).json({ message: error.message });
            }
        });
    }
}
exports.default = new AttendantController();
