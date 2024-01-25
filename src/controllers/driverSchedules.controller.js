import db from "../database/models";
import catchAsync from "../utils/catchAsync";
import { successResponse } from "../utils/responseHandlers";
import statusCode from "../utils/statusCodes";
import message from "../utils/customMessages";
import AppError from "../utils/appError";
import { temporaryDeleteForeignData } from "../services/deleteContent.service";
import { findAllData, findData } from "../middlewares/contentChecker";
import checkForeignData from "../services/checkForeignData";

const { driver_schedules,drivers,users,vehicles,vehicle_types,client_schedules } = db;
const { ok, created,forbidden,badRequest} = statusCode;
const {
  notPermitted,noVehicle
} = message;

export const createSchedules = catchAsync(async (req, res,next) => {
  const driverId = req.currentUser.driverInfo.id;
  const { from, to, date, ride, delivery, description, weight, sits, fareAmount } = req.body;
  
  const userCar = await checkForeignData({
    where: {
     vehicles: {driverId},
    },
   });
   
   if (!userCar.status) return next(new AppError(noVehicle, forbidden));
  
  const schedule = await driver_schedules.create({driverId, from,to,date,ride,delivery,description,weight,sits,fareAmount,vehicleId:userCar.content.id });

  return successResponse(res, created, schedule);
});

export const updateSchedules = catchAsync(async (req, res,next) => {
  const {id} = req.currentUser.driverInfo;
  let { from,to,date,ride,delivery,description,weight,sits,fareAmount} = req.body;
  
  const userOwner = await checkForeignData({
    where: {
     driver_schedules: { id: req.params.id, driverId: id},
    },
   });
   
   if (!userOwner.status) return next(new AppError(notPermitted, badRequest));

  const schedule = await driver_schedules.update(
    { from,to,date,ride,delivery,description,weight,sits,fareAmount},
    {
      where: { id:req.params.id},
      returning: true,
      plain: true,
    }
  );

  return successResponse(res, ok, schedule);
});


export const getSchedules = catchAsync(async (req, res, next) => {

  let where = {
    where: { driver_schedules: { driverId: req.currentUser.driverInfo.id }, include: [
      {
        model: client_schedules,
        as: "client_schedules",
        include: [
          {
            model: users,
            as: "client",
            attributes: {
              exclude: [
                "userTypeId",
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
          exclude: ["createdAt", "updatedAt", "active"
          ]
        },
      },
      {
        model: vehicles,
        as: "vehicle",
        include: [{
          model: vehicle_types,
          as: "vehicleType"
        },]
      },
    ], }
  }
  
  
  return findAllData(where)(req, res, next);
});
export const getAllSchedules = catchAsync(async (req, res, next) => {

  let where = {
    where: {
      driver_schedules: { active: true },
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
                  "userTypeId",
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
          model: vehicles,
          as: "vehicle",
          include: [{
            model: vehicle_types,
            as: "vehicleType"
          },]
        },
      ],
    }
  }
  
  
  return findAllData(where)(req, res, next);
});

export const getSchedule = catchAsync(async (req, res, next) => {
  let where = {
    where: { driver_schedules: { driverId: req.currentUser.driverInfo.id } }
  }
  
  return findData(where)(req, res, next);
});


export const deleteSchedules = catchAsync(async (req, res, next) => {
 const userOwner = await checkForeignData({
  where: {
   driver_schedules: { id: req.params.id, driverId: req.currentUser.driverInfo.id },
  },
 });
 
 if (!userOwner.status) return next(new AppError(notPermitted, forbidden));

  const where = {
    driver_schedules: { id: req.params.id},
  };

  return temporaryDeleteForeignData(where)(req, res, next);
});