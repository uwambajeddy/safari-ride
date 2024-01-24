import db from "../database/models";
import catchAsync from "../utils/catchAsync";
import { successResponse } from "../utils/responseHandlers";
import statusCode from "../utils/statusCodes";

const { vehicle_types } = db;
const { ok, created } = statusCode;

export const createVehicleTypes = catchAsync(async (req, res) => {
  const { name,icon } = req.body;
  const vehicleType = await vehicle_types.create({ name,icon });

  return successResponse(res, created, vehicleType);
});

export const updateVehicleTypes = catchAsync(async (req, res) => {
  const id = req.params.id;
  let { name,icon } = req.body;

  const vehicleType = await vehicle_types.update(
    {
      name,icon
    },
    {
      where: { id },
      returning: true,
      plain: true,
    }
  );

  return successResponse(res, ok, vehicleType);
});
