import catchAsync from "../utils/catchAsync";
import { successResponse } from "../utils/responseHandlers";
import statusCode from "../utils/statusCodes";

const { ok } = statusCode;

export const getData = catchAsync(async (req, res, next) => {
  const { foundData } = req;
  return successResponse(res, ok, foundData);
});
