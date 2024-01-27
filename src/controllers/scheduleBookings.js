import catchAsync from "../utils/catchAsync";
import statusCode from "../utils/statusCodes";
import db from "../database/models";
import messages from "../utils/customMessages";
import AppError from "../utils/appError";
import { createNotification } from "../utils/notification";
import { successResponse } from "../utils/responseHandlers";
import { findAllData } from "../middlewares/contentChecker";

const { actionRequired } = messages;
const { ok, badRequest } = statusCode;
const { client_schedules, driver_schedules, vehicle_types, vehicles,drivers, users } = db;

export const driverBookingAction = catchAsync(async (req, res, next) => {
 const { id } = req.params;
 const { action } = req.query;

 //TODO: not allow all drivers
 if (action == undefined || action != "true" && action != "false") return next(new AppError(actionRequired, badRequest));
 let getbooking= await client_schedules.update(
  {
   status: action,
  },
  {
   where: { id },
   returning: true,
      plain: true,

  },);
 if (getbooking[1].dataValues.clientId) {
  action == "true" ?
  await createNotification("Request approved ✅", "Your ride request at has been approved!!", getbooking[1].clientId, 99995)
  : await createNotification("Request Rejected ❌", "Your ride request has been rejected. You can find another scheduled trip!!", getbooking[1].clientId, 99995)
 }
 return successResponse(res, ok, getbooking); 

});

export const cancelRide = catchAsync(async (req, res, next) => {
 const userId = req.currentUser.id;
 const { id } = req.params;

 let booking = await client_schedules.update(
  {
   active: false,
  },
  {
   where: { id, clientId: userId },
   returning: true,
   plain: true,

  },)

 return successResponse(res, ok, booking);

});

export const getBooks = catchAsync(async (req, res, next) => {

 let where = {
  where: {
   client_schedules: { clientId: req.currentUser.id }, include: [
    {
     model: driver_schedules,
     as: "schedule",
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
        exclude: ["createdAt", "updatedAt", "active", "identity", "userId"
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
     attributes: {
      exclude: ["createdAt", "updatedAt", "active"
      ]
     },
    }
   ],
  }
 }


 return findAllData(where)(req, res, next);
});
export const rideBooking = catchAsync(async (req, res, next) => {
 const userId = req.currentUser.id;
 const { id } = req.params;

 let booking = await client_schedules.create(
  {
   clientId: userId,
   driverScheduleId: id,
  })

 return successResponse(res, ok, booking);

});