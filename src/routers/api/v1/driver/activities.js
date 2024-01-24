import express from "express";
import { getActivities, updateActivities } from "../../../../controllers/driverActivities.controller.js";
import { validate } from "../../../../utils/validations";
import validationData from "../../../../utils/validationData";

const apiRouter = express.Router();

apiRouter.get("/get", getActivities);
apiRouter.patch(
 "/update",
 validate(validationData.updateActivity),
 updateActivities
);

export default apiRouter;
