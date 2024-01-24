import AppError from "../utils/appError";
import statusCode from "../utils/statusCodes";
const { MethodNotAllowed } = statusCode;

export default (req, res, next) => {
  const allowedMethods = [
    "OPTIONS",
    "HEAD",
    "CONNECT",
    "GET",
    "POST",
    "PUT",
    "DELETE",
    "PATCH",
  ];

  if (!allowedMethods.includes(req.method)) {
    return next(new AppError(`${req.method} not allowed.`, MethodNotAllowed));
  }

  next();
};
