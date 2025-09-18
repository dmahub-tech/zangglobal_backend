import express,{Router} from "express";
import volunteerController from "../controllers/volunteer.controller";

const volunteerRoutes: Router = Router();
// GET all volunteers
volunteerRoutes.get("/", volunteerController.getAllVolunteers);

// POST create a new volunteer
volunteerRoutes.post("/", volunteerController.createVolunteer);

// GET a single volunteer
volunteerRoutes.get("/:id", volunteerController.getVolunteer);

// PUT update a volunteer
volunteerRoutes.put("/:id", volunteerController.updateVolunteer);

// DELETE a volunteer
volunteerRoutes.delete("/:id", volunteerController.deleteVolunteer);
export default  volunteerRoutes;
