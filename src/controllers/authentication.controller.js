import catchAsync from "../utils/catchAsync";
import { deleteResponse, successResponse } from "../utils/responseHandlers";
import { generateToken } from "../utils/authentication";
import statusCode from "../utils/statusCodes";
import db from "../database/models";
import messages from "../utils/customMessages";
import { deleteToken, setToken } from "../config/redis.config";
import AppError from "../utils/appError";
import { smsVerificationCode } from "../utils/sms";
import textflow from "textflow.js"
import bcryptjs from "bcryptjs";
import { verifyDocument } from "../utils/validations";
import { fileUpload, renameFile } from "../utils/multer";
import checkForeignData from "../services/checkForeignData";
import twilio from 'twilio';
import { createNotification } from "../utils/notification";

const { logoutMessage, userDontExist,alreadyVerified,fullDocsRequired, userAccountBlocked, phoneNumberRequired, noVerficationToken, verificationSMSSent,suspiciousDoc,serverErrorMessage,actionRequired } = messages;
const { ok, badRequest,serverError, } = statusCode;
const { users,drivers } = db;
const { hash } = bcryptjs;
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const client = twilio(accountSid, authToken);
const serviceId='VAe30e4ec193961a98a1bb32530c65816d'

export const userLogin = catchAsync(async (req, res, next) => {
  const { foundUser, userType } = req;

  const tokens = await generateToken(foundUser.id, userType);
  const data = {
    tokens,
    user: foundUser,
  };
  res.cookie("accessToken", tokens.accessToken, {
    maxAge: 900000,
    httpOnly: true,
    domain: process.env.COOKIE_DOMAIN,
    path: "/",
    sameSite: "strict",
    secure: false,
  });

  res.cookie("refreshToken", tokens.refreshToken, {
    maxAge: 3.154e10,
    httpOnly: true,
    domain: process.env.COOKIE_DOMAIN,
    path: "/",
    sameSite: "strict",
    secure: false,
  });
  successResponse(res, ok, data);
});

export const getAccessToken = catchAsync(async (req, res, next) => {
  const { foundUser, userType } = req;
  const tokens = await generateToken(foundUser, userType);

  res.cookie("accessToken", tokens.accessToken, {
    maxAge: 900000,
    httpOnly: true,
    domain: process.env.COOKIE_DOMAIN,
    path: "/",
    sameSite: "strict",
    secure: false,
  });

  res.cookie("refreshToken", tokens.refreshToken, {
    maxAge: 3.154e10,
    httpOnly: true,
    domain: process.env.COOKIE_DOMAIN,
    path: "/",
    sameSite: "strict",
    secure: false,
  });
  successResponse(res, ok, tokens);
});

export const userLogout = catchAsync(async (req, res, next) => {
  const { id } = req.currentUser;
  const decoded = req.decodedAccessToken;

  await deleteToken(id.toString());

  await setToken(`BL_${id.toString()}`, JSON.stringify({ decoded }));

  return deleteResponse(res, logoutMessage);
});

export const verifyPhone = catchAsync(async (req, res, next) => {
  const { code, phoneNumber } = req.query;
  
  if (!code) {
    return next(new AppError(noVerficationToken, badRequest));
  }
  if (!phoneNumber) {
    return next(new AppError(phoneNumberRequired, badRequest));
  }

  let result = await textflow.verifyCode(phoneNumber, code);

  if (!result.valid)
    return next(new AppError(result.message, badRequest));

  // const result =await client.verify.v2.services(serviceId)
  //     .verificationChecks
  //     .create({to: `+${phoneNumber}`, code})
      
  // console.log(result)
  
  const user = await users.update(
    { isVerified: true },
    {
      where: {
        phoneNumber,
        active: true
      }
    }
  );

  return successResponse(res, ok, user);

});


export const sendVerficationToken = catchAsync(async (req, res, next) => {
  const { phoneNumber } = req.query;



  if (!phoneNumber) {
    return next(new AppError(phoneNumberRequired, badRequest));
  }

  const isVerified = await checkForeignData({
    where: {
      users: { phoneNumber,isVerified:true },
    },
  });
  //TODO:use different
  // if (isVerified.status) return next(new AppError(alreadyVerified, badRequest));

  const userExist = await users.findOne({
    where: {
      phoneNumber: `${phoneNumber}`
    },
  });

  if (!userExist) {
    return next(new AppError(userDontExist, badRequest));
  }

  if (!userExist.active) {
    return next(new AppError(userAccountBlocked, badRequest));
  }

  const result = await smsVerificationCode(phoneNumber);
  console.log(result)
  if (!result.ok) {
    return next(new AppError(result.message, badRequest));
  }

  return successResponse(res, ok, { message: verificationSMSSent });


});

export const resetPassword = catchAsync(async (req, res, next) => {
  let { code, phoneNumber, password } = req.body;

  if (!code) {
    return next(new AppError(noVerficationToken, badRequest));
  }
  if (!phoneNumber) {
    return next(new AppError(phoneNumberRequired, badRequest));
  }

  if (!password) {
    return next(new AppError(phoneNumberRequired, badRequest));
  }

  let result = await textflow.verifyCode(phoneNumber, code);

  if (!result.valid)
    return next(new AppError(result.message, badRequest));

  password = await hash(password, 12);
  const user = await users.update(
    { password },
    {
      where: {
        phoneNumber,
        active: true
      }
    }
  );

  return successResponse(res, ok, user);

});


export const verifyDriver = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const { action } = req.query;
  if(action == undefined || action != "true" && action !="false" && action !="pending" ) return  next(new AppError(actionRequired, badRequest));
   let user = await drivers.update(
      {
       isVerified:  action,
      },
      {
        where: { userId:id },
        returning: true,
        plain: true,

     },)
    
  action == "true" ?
    await createNotification("Documents approved ✅", "Your documents has been approved. Register your vehicle and start earning money!!", id, 99995)
    : action == "false" ?
      await createNotification("Documents Rejected ❌", "Your documents has been rejected. Please upload accurate documents!!", id, 99995)
      :  await createNotification("Documents pending ⚠️", "Your documents has been placed under review for further examination!!", id, 99995);
  return successResponse(res, ok, user);

});

export const uploadDriverDocs = catchAsync(async (req, res, next) => {
  const { id, driverInfo, fullName } = req.currentUser;
  
  if(driverInfo.isVerified === "true") return  next(new AppError(alreadyVerified, badRequest));
  if(!req.files['faceImage'] || !req.files['identityCard'] || ! req.files['driverLicence']) return  next(new AppError(fullDocsRequired, badRequest));

  let user;
  const localFaceImage = req.files['faceImage'][0];
  const localIdentityCard = req.files['identityCard'][0];
  //TODO: we are not going to validate the driver licence at the moment because of low resources, we'll just keep the licence image !! we verify this by ourselves
  const localDriverLicence = req.files['driverLicence'][0];

  const faceImage = await fileUpload(localFaceImage.path,"identity documents",next);
  const identityCard = await fileUpload(localIdentityCard.path,"identity documents",next);
  const driverLicence = await fileUpload(localDriverLicence.path,"identity documents",next);

  const verifyId = await verifyDocument(identityCard, faceImage);

  if (!verifyId.isValid) {
    if (verifyId.serverError) return next(new AppError(serverErrorMessage, serverError));
    return next(new AppError(verifyId.error.message, badRequest))
  };

  const { sentDocument } = verifyId

  let authentication_result = sentDocument['authentication'];
  let face_result = sentDocument['face'];


  if (face_result && authentication_result && authentication_result['score'] > 0.5 && face_result['isIdentical']) {

   user = await drivers.update(
      {
       isVerified: "pending",
        identityImage: identityCard,
        faceImage,
        driverLicenceImage: driverLicence,
        identity: sentDocument,
        availabilityStatus: "available"
      },
      {
        where: { userId:id },
        returning: true,
        plain: true,

     },)
    
    const admin = await users.findOne({where:{userTypeId:3}})
    await createNotification("Document uploaded 🚀","Your documents has been uploaded successfully and they are under review.",id,99995)
    await createNotification("Pending document verification 📄",`New driver document from ${fullName}`,admin.id,99995)
  } else {

const faceImageName = faceImage.match(/\/v\d+\/([^/.]+)\./);
const identityCardName = identityCard.match(/\/v\d+\/([^/.]+)\./);
const driverLicenceName = driverLicence.match(/\/v\d+\/([^/.]+)\./);
    await renameFile(faceImageName[1],`${id}_${faceImageName[1]}_error_${new Date}`.split(" ").slice(0,5).join(" "))
    await renameFile(identityCardName[1],`${id}_${identityCardName[1]}_error_${new Date}`.split(" ").slice(0,5).join(" "))
    await renameFile(driverLicenceName[1], `${id}_${driverLicenceName[1]}_error_${new Date}`.split(" ").slice(0, 5).join(" "))
    
    return next(new AppError(suspiciousDoc,badRequest))
  }


  return successResponse(res, ok, user);
});