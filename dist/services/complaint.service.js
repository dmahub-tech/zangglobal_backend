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
exports.ComplaintService = void 0;
const complaint_model_1 = require("../models/complaint.model");
class ComplaintService {
    findAll() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield complaint_model_1.ComplaintModel.find();
        });
    }
    findByComplaintNumber(complaintNumber) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield complaint_model_1.ComplaintModel.findOne({ complaintNumber });
        });
    }
    create(complaintData) {
        return __awaiter(this, void 0, void 0, function* () {
            const complaint = new complaint_model_1.ComplaintModel(complaintData);
            return yield complaint.save();
        });
    }
    updateStatus(complaintNumber, status) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield complaint_model_1.ComplaintModel.findOneAndUpdate({ complaintNumber }, { $set: { status } }, { new: true });
        });
    }
}
exports.ComplaintService = ComplaintService;
