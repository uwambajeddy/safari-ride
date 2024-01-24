import express from "express";
import notificationTypes from "./notificationTypes";
import vehicleTypes from "./vehicleTypes";
import drivers from "./drivers";
import {
  restrictedUsers,
} from "../../../../middlewares/authentication";
import systemUserTypes from "../../../../utils/systemUserTypes";

const { admin } = systemUserTypes;
const apiRouter = express.Router();

apiRouter.use("/vehicles", vehicleTypes);
apiRouter.use(restrictedUsers([admin]));
apiRouter.use("/notifications", notificationTypes);
apiRouter.use("/drivers", drivers);

export default apiRouter;
