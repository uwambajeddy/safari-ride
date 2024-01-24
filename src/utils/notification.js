import db from "../database/models";
import io from "../server";
import logger from "./logger";

const { notifications } = db;

export const createNotification = async (
  title,
  content,
  userId,
  notificationTypeId = 99998
) => {

  try {
    await notifications.create({
      userId,
      title,
      content,
      notificationTypeId,
    });
    io.emit('newNotification', {
      title,
      content,
      userId,
      notificationTypeId, 
    });
  } catch (error) {
    console.error("Error on create notification:", error);
    throw error;
  }

};
