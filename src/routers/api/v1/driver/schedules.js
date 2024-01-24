import express from "express";
import { findData } from "../../../../middlewares/contentChecker";
import { getData } from "../../../../services/getContent.service";
import { validate } from "../../../../utils/validations";
import validData from "../../../../utils/validationData";
import {
  createSchedules,
  deleteSchedules,
  getSchedule,
  getSchedules,
  updateSchedules,
} from "../../../../controllers/driverSchedules.controller.js";

const router = express.Router();

router.get("/get/", getSchedules, getData);
router.get("/get/:id", getSchedule, getData);
router.post(
  "/add/",
  validate(validData.createSchedule),
  createSchedules
);
router.patch(
  "/update/:id",
  validate(validData.updateSchedule),
  findData("driver_schedules"),
  updateSchedules
);
router.delete("/delete/:id", findData("driver_schedules"), deleteSchedules);

export default router;
