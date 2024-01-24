import express from "express";
import { getData } from "../../../services/getContent.service";
import { getAllUser } from "../../../controllers/users.controller";
import { getAllSchedules } from "../../../controllers/driverSchedules.controller";
import { getAllVehicles } from "../../../controllers/vehicles.controller";
import { getAllCountries } from "../../../controllers/countries.controller";

const router = express.Router();

router.get("/users", getAllUser);
router.get("/driver-schedules", getAllSchedules, getData);
router.get("/vehicles", getAllVehicles, getData);
router.get("/countries", getAllCountries, getData);
export default router;
