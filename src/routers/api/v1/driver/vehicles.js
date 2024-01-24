import express from "express";
import { findData } from "../../../../middlewares/contentChecker";
import { getData } from "../../../../services/getContent.service";
import { validate } from "../../../../utils/validations";
import validData from "../../../../utils/validationData";
import {
  createVehicles,
  deleteVehicles,
  getVehicle,
  getVehicles,
  updateVehicles,
} from "../../../../controllers/vehicles.controller";

const router = express.Router();

router.get("/get/", getVehicles, getData);
router.get("/get/:id", getVehicle, getData);
router.post(
  "/add/",
  validate(validData.createVehicle),
  createVehicles
);
router.patch(
  "/update/:id",
  validate(validData.updateVehicle),
  findData("vehicles"),
  updateVehicles
);
router.delete("/delete/:id", findData("vehicles"), deleteVehicles);

export default router;
