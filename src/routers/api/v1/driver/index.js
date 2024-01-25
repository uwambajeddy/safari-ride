import express from "express";
import vehicles from "./vehicles";
import schedules from "./schedules.js";
import {
  isDriverVerified,
  restrictedUsers,
} from "../../../../middlewares/authentication";
import systemUserTypes from "../../../../utils/systemUserTypes";
import { uploadDriverDocs } from "../../../../controllers/authentication.controller";
import { uploads } from "../../../../utils/multer";

const { driver } = systemUserTypes;
const apiRouter = express.Router();

apiRouter.use(restrictedUsers([driver]));
apiRouter.post("/verify-driver", uploads.fields([{ name: 'faceImage', maxCount: 1 }, { name: 'identityCard', maxCount: 1 }, { name: 'driverLicence', maxCount: 1 }]), uploadDriverDocs);

apiRouter.use( isDriverVerified);
apiRouter.use("/vehicles", vehicles);
apiRouter.use("/schedules", schedules);

export default apiRouter;
