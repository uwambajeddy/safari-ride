import express from "express";
import { findAllData, findData } from "../../../../middlewares/contentChecker";
import { temporaryDelete } from "../../../../services/deleteContent.service";
import { getData } from "../../../../services/getContent.service";
import { validate } from "../../../../utils/validations";
import validData from "../../../../utils/validationData";
import {
  createVehicleTypes,
  updateVehicleTypes,
} from "../../../../controllers/vehicleTypes.controller";
import { restrictedUsers } from "../../../../middlewares/authentication";
import systemUserTypes from "../../../../utils/systemUserTypes";

const { admin } = systemUserTypes;

const router = express.Router();

router.get("/types/", findAllData("vehicle_types"), getData);
router.get("/types/:id", findData("vehicle_types"), getData);
router.use(restrictedUsers([admin]));
router.post(
  "/types/",
  validate(validData.vehicleTypes),
  createVehicleTypes
);
router.patch(
  "/types/:id",
  validate(validData.vehicleTypes),
  findData("vehicle_types"),
  updateVehicleTypes
);
router.delete("/types/:id", findData("vehicle_types"), temporaryDelete);

export default router;
