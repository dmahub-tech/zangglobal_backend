// routes/attendantRoutes.ts
import { Router } from "express";
import AttendantController from "../controllers/attendant.controller";

const attendanceRoutes = Router();

attendanceRoutes.get("/", AttendantController.getAllAttendants.bind(AttendantController));
attendanceRoutes.post("/", AttendantController.createAttendant.bind(AttendantController));
attendanceRoutes.get("/:id", AttendantController.getAttendant.bind(AttendantController));
attendanceRoutes.put(
  "/:id",
  AttendantController.updateAttendant.bind(AttendantController)
);
attendanceRoutes.delete(
  "/:id",
  AttendantController.deleteAttendant.bind(AttendantController)
);

export default attendanceRoutes;
