import express from "express";
import notifications from "./notifications";
import admin from "./admin";
import drivers from "./driver";
import bookings from "./bookings";
import userProfile from "./userProfile";
import authentication from "./authentication";
import publicRoutes from "./public";
import {isUserVerified, protect } from "../../../middlewares/authentication";


const apiRouter = express.Router();

apiRouter.use("/auth", authentication);
apiRouter.use("/public", publicRoutes);
apiRouter.use(protect)
apiRouter.use("/profile", userProfile);
apiRouter.use("/notifications", notifications);

apiRouter.use(isUserVerified)
apiRouter.use("/admin", admin);
apiRouter.use("/bookings", bookings);
apiRouter.use("/driver", drivers);

export default apiRouter;
