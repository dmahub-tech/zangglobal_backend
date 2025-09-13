// controllers/AttendantController.ts
import { Request, Response } from "express";
import Attendant from "../models/attendance.model";

class AttendantController {
  // Get all attendants
  public async getAllAttendants(req: Request, res: Response): Promise<void> {
    try {
      const attendants = await Attendant.find().sort({ createdAt: -1 });
      res.json(attendants);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  }

  // Create a new attendant
  public async createAttendant(req: Request, res: Response): Promise<void> {
    try {
      const data = req.body?.formData;
      const attendant = new Attendant(data);
      console.log('Creating attendant with data:', data);
      const savedAttendant = await attendant.save();
      res.status(201).json(savedAttendant);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  }

  // Get a single attendant
  public async getAttendant(req: Request, res: Response): Promise<void> {
    try {
      const attendant = await Attendant.findById(req.params.id);
      if (!attendant) {
        res.status(404).json({ message: "Attendant not found" });
        return;
      }
      res.json(attendant);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  }

  // Update an attendant
  public async updateAttendant(req: Request, res: Response): Promise<void> {
    try {
      const attendant = await Attendant.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true, runValidators: true }
      );
      if (!attendant) {
        res.status(404).json({ message: "Attendant not found" });
        return;
      }
      res.json(attendant);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  }

  // Delete an attendant
  public async deleteAttendant(req: Request, res: Response): Promise<void> {
    try {
      const attendant = await Attendant.findByIdAndDelete(req.params.id);
      if (!attendant) {
        res.status(404).json({ message: "Attendant not found" });
        return;
      }
      res.json({ message: "Attendant deleted successfully" });
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  }
}

export default new AttendantController();
