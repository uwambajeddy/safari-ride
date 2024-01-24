import express from "express";
import { findAllData, findData } from "../../../../middlewares/contentChecker";
import { temporaryDelete } from "../../../../services/deleteContent.service";
import { getData } from "../../../../services/getContent.service";
import { validate } from "../../../../utils/validations";
import validData from "../../../../utils/validationData";
import {
  createNotificationTypes,
  updateNotificationTypes,
} from "../../../../controllers/notificationTypes.controller";

const router = express.Router();

router.get("/types/", findAllData("notification_types"), getData);
router.get("/types/:id", findData("notification_types"), getData);
router.post(
  "/types/",
  validate(validData.notificationTypes),
  createNotificationTypes
);
router.patch(
  "/types/:id",
  validate(validData.notificationTypes),
  findData("notification_types"),
  updateNotificationTypes
);
router.delete("/types/:id", findData("notification_types"), temporaryDelete);

export default router;
