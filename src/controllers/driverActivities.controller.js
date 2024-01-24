import db from "../database/models";
import catchAsync from "../utils/catchAsync";
import { successResponse } from "../utils/responseHandlers";
import statusCode from "../utils/statusCodes";

const { driver_activities } = db;
const { ok } = statusCode;

export const updateActivities = catchAsync(async (req, res) => {
  const { ride,delivery } = req.body;
  const driverId = req.currentUser.id;
  const results = await driver_activities.update(
    { ride,delivery},
    {
      where: { driverId },
      returning: true,
      plain: true,
    }
  );
  return successResponse(res, ok, results);

});


export const getActivities = catchAsync(async (req, res) => {
 const results = await driver_activities.findOne({ where: {driverId: req.currentUser.id,active:true  }})

  return successResponse(res, ok, results.dataValues);
});
