import express from "express";
import {
  readNotification,
  readNotifications,
  getNotification,
  getNotifications,
} from "../../../controllers/notifications.controller";
import { getData } from "../../../services/getContent.service";
import { findData } from "../../../middlewares/contentChecker";

const router = express.Router();

router.get("/", getNotifications, getData);
router.get("/:id", getNotification, getData);
router.patch("/read/",readNotifications);
router.patch("/read/:id", findData("notifications"),readNotification);
export default router;
