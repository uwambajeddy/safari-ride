import express from "express";
import { uploads } from "../../../utils/multer";
import { validate } from "../../../utils/validations";
import validData from "../../../utils/validationData";
import { updateUser,getUser } from "../../../controllers/users.controller";

const router = express.Router();

router.get("/get",getUser)
router.patch(
  "/update",
  uploads.single("profileImage"),
  validate(validData.updateUser),
  updateUser
  );

export default router;
