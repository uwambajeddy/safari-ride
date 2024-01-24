import express from "express";
import {  findAllData, findData } from "../../../../middlewares/contentChecker";
import { verifyDriver } from "../../../../controllers/authentication.controller";
import { getData } from "../../../../services/getContent.service";

const router = express.Router();

router.patch(
  "/verify/:id",
  findData("users"),
  verifyDriver
);
router.get("/", findAllData("drivers"), getData);
export default router;
