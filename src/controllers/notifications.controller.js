import db from "../database/models";
import catchAsync from "../utils/catchAsync";
import { successResponse } from "../utils/responseHandlers";
import statusCode from "../utils/statusCodes";
import { findAllData, findData } from "../middlewares/contentChecker";

const { notifications } = db;
const { ok } = statusCode;

export const readNotification = catchAsync(async (req, res) => {
  const id = req.params.id;

  const notification = await notifications.update(
    {
      isRead: true,
    },
    {
      where: { id, userId: req.currentUser.id },
      returning: true,
      plain: true,
    }
  );

  return successResponse(res, ok, notification);
});
export const readNotifications = catchAsync(async (req, res) => {
  const userId = req.currentUser.id;
  const notification = await notifications.update(
    {
      isRead: true,
    },
    {
      where: { userId }
    }
  );

  return successResponse(res, ok, notification);
});

export const getNotification = catchAsync(async (req, res, next) => {
  const where = {
    where: { notifications: { userId: req.currentUser.id } },
  };

  return findData(where)(req, res, next);
});
export const getNotifications = catchAsync(async (req, res, next) => {
  const where = {
    where: { notifications: { userId: req.currentUser.id } },
  };

  return findAllData(where)(req, res, next);
});
