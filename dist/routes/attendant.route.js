"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// routes/attendantRoutes.ts
const express_1 = require("express");
const attendant_controller_1 = __importDefault(require("../controllers/attendant.controller"));
const attendanceRoutes = (0, express_1.Router)();
attendanceRoutes.get("/", attendant_controller_1.default.getAllAttendants.bind(attendant_controller_1.default));
attendanceRoutes.post("/", attendant_controller_1.default.createAttendant.bind(attendant_controller_1.default));
attendanceRoutes.get("/:id", attendant_controller_1.default.getAttendant.bind(attendant_controller_1.default));
attendanceRoutes.put("/:id", attendant_controller_1.default.updateAttendant.bind(attendant_controller_1.default));
attendanceRoutes.delete("/:id", attendant_controller_1.default.deleteAttendant.bind(attendant_controller_1.default));
exports.default = attendanceRoutes;
