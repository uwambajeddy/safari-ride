import db from "../database/models";
import catchAsync from "../utils/catchAsync";
import { successResponse } from "../utils/responseHandlers";
import statusCode from "../utils/statusCodes";

const { notification_types } = db;
const { ok, created } = statusCode;

export const createNotificationTypes = catchAsync(async (req, res) => {
  const { name } = req.body;
  const notificationType = await notification_types.create({ name });

  return successResponse(res, created, notificationType);
});

export const updateNotificationTypes = catchAsync(async (req, res) => {
  const id = req.params.id;
  let { name } = req.body;

  const notificationType = await notification_types.update(
    {
      name,
    },
    {
      where: { id },
      returning: true,
      plain: true,
    }
  );

  return successResponse(res, ok, notificationType);
});
