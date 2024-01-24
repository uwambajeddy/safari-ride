import express from "express";
import { getAccessToken, userLogin, userLogout,
  sendVerficationToken,
  verifyPhone, 
  resetPassword} from "../../../controllers/authentication.controller";
import { validate } from "../../../utils/validations";
import validData from "../../../utils/validationData";
import {
  bothEmailAndPasswordExist,
  protect,
  verifyRefleshToken,
  verifyCredentials,
} from "../../../middlewares/authentication";
import { uploads } from "../../../utils/multer";
import { createUser } from "../../../controllers/users.controller";

const router = express.Router();

router.post(
  "/login",
  bothEmailAndPasswordExist,
  verifyCredentials,
  userLogin
);
router.post(
  "/signup",
  uploads.single("profileImage"),
  validate(validData.createUser),
  createUser
);
router.post("/refreshToken", verifyRefleshToken, getAccessToken);
router.post("/verify-phone", verifyPhone);
router.post("/send-verification-token", sendVerficationToken);
router.post("/request-reset-password", sendVerficationToken);
router.post("/reset-password", validate(validData.resetPassword), resetPassword);

router.use(protect)
router.get("/logout", userLogout);

export default router;
