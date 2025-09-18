import { Request, Response } from "express";
import Volunteer from "../models/volunteer.models";

class VolunteerController {
  // Get all volunteers
  public async getAllVolunteers(req: Request, res: Response): Promise<void> {
    try {
      const volunteers = await Volunteer.find().sort({ createdAt: -1 });
      res.json(volunteers);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  }

  // Create a new volunteer
  public async createVolunteer(req: Request, res: Response): Promise<void> {
    try {
      const volunteer = new Volunteer(req.body);
      const savedVolunteer = await volunteer.save();
      res.status(201).json(savedVolunteer);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  }

  // Get a single volunteer
  public async getVolunteer(req: Request, res: Response): Promise<void> {
    try {
      const volunteer = await Volunteer.findById(req.params.id);
      if (!volunteer) {
        res.status(404).json({ message: "Volunteer not found" });
        return;
      }
      res.json(volunteer);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  }

  // Update a volunteer
  public async updateVolunteer(req: Request, res: Response): Promise<void> {
    try {
      const volunteer = await Volunteer.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true, runValidators: true }
      );
      if (!volunteer) {
        res.status(404).json({ message: "Volunteer not found" });
        return;
      }
      res.json(volunteer);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  }

  // Delete a volunteer
  public async deleteVolunteer(req: Request, res: Response): Promise<void> {
    try {
      const volunteer = await Volunteer.findByIdAndDelete(req.params.id);
      if (!volunteer) {
        res.status(404).json({ message: "Volunteer not found" });
        return;
      }
      res.json({ message: "Volunteer deleted successfully" });
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  }
}

export default new VolunteerController();
