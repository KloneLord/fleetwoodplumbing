import express from "express";
import {
    createSchedule,
    getSchedules,
    getScheduleById,
    updateSchedule,
    deleteSchedule
} from "../controllers/schedule_controller.js";

const router = express.Router();

router.post("/schedules", createSchedule);
router.get("/schedules", getSchedules);
router.get("/schedules/:id", getScheduleById);
router.put("/schedules/:id", updateSchedule);
router.delete("/schedules/:id", deleteSchedule);

export default router;