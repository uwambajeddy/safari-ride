import statusCode from "./statusCodes";

const { ok } = statusCode;

export const successResponse = (res, code, data) =>
  res.status(code).json({
    status: "success",
    data,
  });

export const deleteResponse = (res, message) =>
  res.status(ok).json({
    status: "success",
    message,
  });
