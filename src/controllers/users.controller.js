import db from "../database/models";
import checkForeignData from "../services/checkForeignData";
import AppError from "../utils/appError";
import catchAsync from "../utils/catchAsync";
import { fileUpload } from "../utils/multer";
import { successResponse } from "../utils/responseHandlers";
import statusCode from "../utils/statusCodes";
import message from "../utils/customMessages";
import bcryptjs from "bcryptjs";
import { generateToken } from "../utils/authentication";
import { Op } from "sequelize";

const { hash } = bcryptjs;
const {
  userAlreadyExist,
  userAccountBlocked,
  emailAlreadyExist,
  phoneNumberAlreadyExist,
  oldPasswordWrong
} = message;
const { users, drivers, settings,user_types,driver_activities } = db;
const { created, ok, badRequest } = statusCode;


export const getUser = catchAsync(async (req, res, next) => {
  return successResponse(res, ok, req.currentUser);
});

export const getAllUser = catchAsync(async (req, res, next) => {
  let paramQuerySQL = {};

  const queryObj = { ...req.query };
  const excludedFields = ["sort", "page", "size", "active"];
  excludedFields.forEach((field) => delete queryObj[field]);
  let { page, size, sort } = req.query;
  if (size) paramQuerySQL.limit = +size;
  paramQuerySQL.offset = page ? page * paramQuerySQL.limit : 0;

  let query = [];
  for (let [key, value] of Object.entries(queryObj)) {
    const parsedObject = JSON.parse(value);
    const operator = Object.keys(parsedObject)[0];
    const stringValue = Object.values(parsedObject)[0];
    query.push({ [key]: { [Op[operator]]: operator == "like" ? `%${stringValue}%`: stringValue } });
  }
  if (sort !== "" && typeof sort !== "undefined") {
    let query;
    if (sort.charAt(0) !== "-") {
      query = [[sort, "ASC"]];
    } else {
      query = [[sort.replace("-", ""), "DESC"]];
    }

    paramQuerySQL.order = query;
  }

  paramQuerySQL.attributes = {
    exclude: [
      "password",
      "passwordChangedAt",
      "passwordResetToken",
      "passwordResetExpires",
      "verificationToken",
    ],
  };

  paramQuerySQL.where =  query.length > 0 ?{
    [Op.or]: query,
    active:true
  } : {
    active:true
  };

  paramQuerySQL.include = [
    {
      model: user_types,
      as: "userType",
      attributes: { exclude: ["createdAt", "updatedAt", "active"] },
    },
  ];
  const data = await users.findAndCountAll(paramQuerySQL);
  const { count: totalItems, rows: results } = data;
    const currentPage = page ? +page : 0;
    const totalPages = size ? Math.ceil(totalItems / paramQuerySQL.limit) : 1;


  return successResponse(res, ok, { totalItems, results, totalPages, currentPage });
});



export const createUser = catchAsync(async (req, res, next) => {
  let {
    fullName,
    phoneNumber,
    password,
    emergencyNumber,
    gender,
    profileImage,
    userType,
    email
  } = req.body;

  let user;

  const userExist = await users.findOne({
    where: {
      phoneNumber: `${phoneNumber}`
    },
  });
  if (email) {
    const emailExist = await checkForeignData({
      where: {
        users: { email },
      },
    });
    if (emailExist.status)
      return next(new AppError(emailAlreadyExist, badRequest));
  }



  if (!userExist) {
    if (req.file) profileImage = await fileUpload(req.file.path, "profiles", next);
    password = await hash(password, 12);
    user = await users.create({
      userTypeId: userType,
      fullName,
      phoneNumber,
      password,
      emergencyNumber,
      gender,
      profileImage,
      momoPay: phoneNumber,
      email
    });

  } else {

    if (!userExist.active) {
      return next(new AppError(userAccountBlocked, badRequest));
    }

    return next(new AppError(userAlreadyExist, badRequest));
  }
  const tokens = await generateToken(user.id, user.userTypeId);

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

  user.password = undefined;
  user.verificationToken = undefined;

  const data = {
    tokens,
    user,
  };
  return successResponse(res, created, data);
});

export const updateUser = catchAsync(async (req, res, next) => {
  const { id } = req.currentUser;
  let {
    fullName,
    email,
    phoneNumber,
    profileImage,
    newPassword,
    oldPassword,
    gender,
    emergencyNumber,
    description,
    momoPay,
    location
  } = req.body;

  if (email) {
    const emailExist = await checkForeignData({
      where: {
        users: { email },
      },
    });
    if (emailExist.status && emailExist.content.id != id)
    return next(new AppError(emailAlreadyExist, badRequest));
}


if (phoneNumber) {
  const phoneNumberExist = await checkForeignData({
    where: {
      users: { phoneNumber },
    },
  });
    if (phoneNumberExist.status && phoneNumberExist.content.id != id)
      return next(new AppError(phoneNumberAlreadyExist, badRequest));
  }

  if (newPassword) {
    const currentUser = await users.findByPk(id)
    if (await bcryptjs.compare(oldPassword, currentUser.dataValues.password)) {

      newPassword = await hash(newPassword, 12);
    } else {
      return next(new AppError(oldPasswordWrong, badRequest));
    }
  }


  if (req.file) profileImage = await fileUpload(req.file.path, "profiles", next);

  let user = await users.update(
    {
      fullName,
      email,
      phoneNumber,
      profileImage,
      password: newPassword,
      gender,
      emergencyNumber,
      momoPay,
      location,
      description,
      isVerified: phoneNumber ? false : true
    },
    {
      where: { id },
      returning: true,
      plain: true,

    },
  );


  return successResponse(res, ok, user);
});
