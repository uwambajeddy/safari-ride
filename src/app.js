import express from "express";
import globalErrorHandler from "./controllers/error.controller";
import allRoutes from "./routers";
import AppError from "./utils/appError";
import messages from "./utils/customMessages";
import statusCode from "./utils/statusCodes";
import middlewares from "./middlewares";

const { endpointNotFound } = messages;
const { notFound } = statusCode;

const app = express();

middlewares(app);

app.use(allRoutes);

app.use((req, res, next) => {
  next(new AppError(endpointNotFound, notFound));
});

app.use(globalErrorHandler);

export default app;
