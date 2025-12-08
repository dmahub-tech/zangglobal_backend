"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const volunteer_controller_1 = __importDefault(require("../controllers/volunteer.controller"));
const volunteerRoutes = (0, express_1.Router)();
// GET all volunteers
volunteerRoutes.get("/", volunteer_controller_1.default.getAllVolunteers);
// POST create a new volunteer
volunteerRoutes.post("/", volunteer_controller_1.default.createVolunteer);
// GET a single volunteer
volunteerRoutes.get("/:id", volunteer_controller_1.default.getVolunteer);
// PUT update a volunteer
volunteerRoutes.put("/:id", volunteer_controller_1.default.updateVolunteer);
// DELETE a volunteer
volunteerRoutes.delete("/:id", volunteer_controller_1.default.deleteVolunteer);
exports.default = volunteerRoutes;
