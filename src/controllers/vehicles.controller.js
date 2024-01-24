import db from "../database/models";
import catchAsync from "../utils/catchAsync";
import { successResponse } from "../utils/responseHandlers";
import statusCode from "../utils/statusCodes";
import message from "../utils/customMessages";
import AppError from "../utils/appError";
import { temporaryDeleteForeignData } from "../services/deleteContent.service";
import { findAllData, findData } from "../middlewares/contentChecker";
import checkForeignData from "../services/checkForeignData";

const { vehicles,vehicle_types,drivers,users } = db;
const { ok, created ,badRequest,forbidden,notFound} = statusCode;
const {
  vehicleExistMessage,
  notPermitted,
  vehicleTypeNotFound
} = message;

export const createVehicles = catchAsync(async (req, res,next) => {
  const driverId = req.currentUser.driverInfo.id;
  const { plateNumber, vehicleTypeId } = req.body;
  
  const vehicleExist = await vehicles.findOne({
    where: {
      driverId,active:true
    },
  });
  if (vehicleExist) {
    return next(new AppError(vehicleExistMessage, badRequest));
  }

  const vehicle = await vehicles.create({ plateNumber,vehicleTypeId,isAvailable:true,driverId});

  return successResponse(res, created, vehicle);
});

export const updateVehicles = catchAsync(async (req, res,next) => {
  const {id} = req.currentUser.driverInfo;
  let { plateNumber, vehicleTypeId } = req.body;
  
  const userOwner = await checkForeignData({
    where: {
     vehicles: { id: req.params.id, driverId: id},
    },
   });
   
   if (!userOwner.status) return next(new AppError(notPermitted, forbidden));
  
   const vehicleTypeValidation = await vehicle_types.findOne({where:{id:vehicleTypeId}})
   if (!vehicleTypeValidation) return next(new AppError(vehicleTypeNotFound, notFound));

  const vehicle = await vehicles.update(
    { plateNumber,vehicleTypeId},
    {
      where: { id:req.params.id},
      returning: true,
      plain: true,
    }
  );

  return successResponse(res, ok, vehicle);
});


export const getVehicles = catchAsync(async (req, res, next) => {

  let where = {
    where: { vehicles: { driverId: req.currentUser.driverInfo.id } }
  }
  
  
  return findAllData(where)(req, res, next);
});
export const getVehicle = catchAsync(async (req, res, next) => {
  let where = {
    where: { vehicles: { driverId: req.currentUser.driverInfo.id } }
  }
  
  return findData(where)(req, res, next);
});


export const deleteVehicles = catchAsync(async (req, res, next) => {
 const userOwner = await checkForeignData({
  where: {
   vehicles: { id: req.params.id, driverId: req.currentUser.driverInfo.id },
  },
 });
 
 if (!userOwner.status) return next(new AppError(notPermitted, forbidden));

  const where = {
    vehicles: { id: req.params.id},
  };

  return temporaryDeleteForeignData(where)(req, res, next);
});


export const getAllVehicles = catchAsync(async (req, res, next) => {

  let where = {
    where: {
      vehicles: { active: true },
      include: [
        {
          model: drivers,
          as: "driver",
          include: [
            {
              model: users,
              as: "user",
              attributes: {
                exclude: [
                  "passwordChangedAt",
                  "passwordResetToken",
                  "passwordResetExpires",
                  "verificationToken",
                  "updatedAt",
                  "password",
                  "createdAt",
                  "active"
                ],
              },
            },
          ],
          attributes: {
            exclude: ["createdAt", "updatedAt", "active", "identity","userId"
            ]
          },
        },
        {
          model: vehicle_types,
          as: "vehicleType"
        },
      ],
    }
  }
  
  
  return findAllData(where)(req, res, next);
});