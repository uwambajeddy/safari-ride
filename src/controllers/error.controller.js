import {
  handleJWTError,
  handleJWTExpiredError,
  handleSequelizeUniqueConstraintError,
  SequelizeDatabaseError,
} from "../utils/errorHandlers";
import statusCode from "../utils/statusCodes";
import messages from "../utils/customMessages";
import logger from "../utils/logger";

const { serverError } = statusCode;

const { serverErrorMessage } = messages;

export const sendErrorDev = (err, req, res) => {
  return res.status(err.statusCode).json({
    status: err.status,
    message: err.message,
    error: err,
    stack: err.stack,
  });
};

export const sendErrorProd = (err, req, res) => {
  if (err.isOperational) {
    return res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
    });
  }

  logger.error(`ERROR 💥 \n`, err);

  return res.status(serverError).json({
    status: "error",
    message: serverErrorMessage,
  });
};

export default (err, req, res, next) => {
  err.statusCode = err.statusCode || serverError;
  err.status = err.status || "error";

  if (
    process.env.NODE_ENV === "development" ||
    process.env.NODE_ENV === "test"
  ) {
    sendErrorDev(err, req, res);
  } else if (process.env.NODE_ENV === "production") {
    let error = { ...err };
    error.message = err.message;

    if (err.name === "SequelizeUniqueConstraintError")
      error = handleSequelizeUniqueConstraintError(err);
    if (err.name === "JsonWebTokenError") error = handleJWTError();
    if (err.name === "SequelizeDatabaseError") error = SequelizeDatabaseError();
    if (err.name === "TokenExpiredError") error = handleJWTExpiredError();

    sendErrorProd(error, req, res);
  }
};
