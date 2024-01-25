import express from "express";
import { getData } from "../../../services/getContent.service";
import { findData } from "../../../middlewares/contentChecker";
import { cancelRide, getBooks, rideBooking } from "../../../controllers/scheduleBookings";

const router = express.Router();

router.get("/", getBooks, getData);
router.patch("/cancel/:id", findData("client_schedules"), cancelRide);
router.post("/:id", findData("driver_schedules"), rideBooking);
export default router;
