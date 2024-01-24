import statusCode from "../utils/statusCodes";
import messages from "../utils/customMessages";
import AppError from "../utils/appError";
import catchAsync from "../utils/catchAsync";
import db from "../database/models";
import { promisify } from "util";
import { verify } from "jsonwebtoken";
import { getToken } from "../config/redis.config";
import bcryptjs from "bcryptjs";
import systemUserTypes from "../utils/systemUserTypes";
import { verifyJwt } from "../utils/jwt.utils";
import { get } from "lodash";
import { generateAccessToken } from "../utils/authentication";
import { userExtraInfo } from "../services/user.service";

const { users, user_types, settings } = db;
const { driver } = systemUserTypes;

const { badRequest, unAuthorized, forbidden } = statusCode;
const {
  loginPasswordAndEmailOrUsernameEmpty,
  loginPasswordEmpty,
  loginEmailOrPhoneNumberEmpty,
  loginPhoneNumberUnauthorized,
  loginEmailUnauthorized,
  driverNotVerified,
  userNotVerified,
  userNoLongerExist,
  refreshTokenMissing,
  refreshTokenMissingInStore,
  accessTokenInvalid,
  refreshTokenNotSame,
  userNotAllowed,
  notPermitted,
  userDontExist,
} = messages;

export const protect = catchAsync(async (req, res, next) => {
  const accessToken =
    get(req, "cookies.accessToken") ||
    get(req, "headers.authorization", "").replace(/^Bearer\s/, "");

  const refreshToken =
    get(req, "cookies.refreshToken") || get(req, "headers.x-refresh");

  if (accessToken) {
    const { decoded } = await verifyJwt(accessToken);

    if (decoded) {
      const tokenData = await getToken(`BL_${decoded.sub.toString()}`);

      if (tokenData === JSON.stringify({ decoded }))
        return next(new AppError(accessTokenInvalid, unAuthorized));

      const currentUser = await users.findOne({
        where: { id: decoded.sub, active: true },
        include: [
          {
            model: user_types,
            as: "userType",
            attributes: { exclude: ["createdAt", "updatedAt", "active"] },
          },
        ],
        attributes: {
          exclude: [
            "userTypeId",
            "passwordChangedAt",
            "passwordResetToken",
            "passwordResetExpires",
            "verificationToken",
            "updatedAt",
            "createdAt",
          ],
        },
      });

      if (!currentUser) {
        return next(new AppError(userNoLongerExist, unAuthorized));
      }

      let { dataValues } = currentUser;


      if (decoded.userType == driver) {
        
        const driverInfo = await userExtraInfo(driver,  decoded.sub);
        if (!driverInfo) return next(new AppError(userDontExist, unAuthorized));
        dataValues.driverInfo = driverInfo;
      }

      const userSettings = await settings.findOne({
        where: {
          userId: dataValues.id
        },
        attributes: { exclude: ["createdAt", "updatedAt", "userId","active"] },
      });

      dataValues.settings = userSettings.dataValues
      req.decodedAccessToken = decoded;
      dataValues.password = undefined;
      req.currentUser = dataValues;
      return next();
    }
  }

  if (refreshToken) {
    const decoded = await promisify(verify)(
      refreshToken,
      process.env.JWT_REFRESH_SECRET
    );

    const refreshTokenData = await getToken(decoded.sub.toString());

    if (refreshTokenData === null)
      return next(new AppError(refreshTokenMissingInStore, unAuthorized));

    if (JSON.parse(refreshTokenData).refreshToken !== refreshToken)
      return next(new AppError(refreshTokenNotSame, unAuthorized));

    const newAccessToken = await generateAccessToken(
      decoded.sub,
      decoded.userType
    );
    const decodedAccessToken = await promisify(verify)(
      newAccessToken,
      process.env.JWT_ACCESS_SECRET
    );

    if (newAccessToken) {
      res.setHeader("x-access-token", newAccessToken);

      res.cookie("accessToken", newAccessToken, {
        maxAge: 900000, // 15 mins
        httpOnly: true,
        domain: process.env.COOKIE_DOMAIN,
        path: "/",
        sameSite: "strict",
        secure: false,
      });
    }


    const currentUser = await users.findOne({
      where: { id: decoded.sub, active: true },
      include: [
        {
          model: user_types,
          as: "userType",
          attributes: { exclude: ["createdAt", "updatedAt", "active"] },
        },
      ],
      attributes: {
        exclude: [
          "userTypeId",
          "passwordChangedAt",
          "passwordResetToken",
          "passwordResetExpires",
          "verificationToken",
          "updatedAt",
          "createdAt",
        ],
      },
    });

    if (!currentUser) {
      return next(new AppError(userNoLongerExist, unAuthorized));
    }

    const { dataValues } = currentUser;

    if (decoded.userType == driver) {
        
      const driverInfo = await userExtraInfo(driver,  decoded.sub);
      if (!driverInfo) return next(new AppError(userDontExist, unAuthorized));
      dataValues.driverInfo = driverInfo;
    }

    const userSettings = await settings.findOne({
      where: {
        userId: dataValues.id
      },
      attributes: { exclude: ["createdAt", "updatedAt", "userId","active"] },
    });

    dataValues.settings = userSettings.dataValues

    req.decodedAccessToken = decodedAccessToken;
    dataValues.password = undefined;
    req.currentUser = dataValues;
    return next();
  } else {
    return next(new AppError(refreshTokenMissing, unAuthorized));
  }
});

export const isDriverVerified = catchAsync(async (req, res, next) => {
  const currentDriver = req.currentUser;
  if (currentDriver.driverInfo.isVerified === "true") {
    return next();
  } else {
    return next(new AppError(driverNotVerified, unAuthorized));
  }
});

export const isUserVerified = catchAsync(async (req, res, next) => {
  const currentUser = req.currentUser;
  if (currentUser.isVerified) {
    return next();
  } else {
    return next(new AppError(userNotVerified, unAuthorized));
  }
});

export const verifyRefleshToken = catchAsync(async (req, res, next) => {
  let token = req.body.token;

  if (!token) {
    return next(new AppError(refreshTokenMissing, unAuthorized));
  }

  const decodedToken = await promisify(verify)(
    token,
    process.env.JWT_REFRESH_SECRET
  );

  const refreshTokenData = await getToken(decodedToken.sub.toString());

  if (refreshTokenData === null)
    return next(new AppError(refreshTokenMissingInStore, unAuthorized));

  if (JSON.parse(refreshTokenData).refreshToken !== token)
    return next(new AppError(refreshTokenNotSame, unAuthorized));

  req.foundUser = decodedToken.sub;
  req.userType = decodedToken.userType;
  next();
});

export function restrictedPermissions(permissions) {
  return catchAsync(async (req, res, next) => {
    if (
      req.currentUser.moreInfo.role === "school_admin" &&
      !permissions.includes(req.currentUser.permissions)
    ) {
      return next(new AppError(notPermitted, forbidden));
    }
    next();
  });
}
export function restrictedUsers(users) {
  return catchAsync(async (req, res, next) => {
    if (!users.includes(req.currentUser.userType.name)) {
      return next(new AppError(userNotAllowed, forbidden));
    }
    next();
  });
}

export const bothEmailAndPasswordExist = (req, res, next) => {
  const { email, password, phoneNumber } = req.body;
  if (email || password || phoneNumber) {
    if (email || phoneNumber) {
      if (password) {
        return next();
      }
      return next(new AppError(loginPasswordEmpty, badRequest));
    }
    return next(new AppError(loginEmailOrPhoneNumberEmpty, badRequest));
  } else {
    next(new AppError(loginPasswordAndEmailOrUsernameEmpty, badRequest));
  }
};

export const verifyCredentials = catchAsync(async (req, res, next) => {
    const { email, password, phoneNumber } = req.body;

    const gottenUser = await users.findOne({
      where: phoneNumber
        ? { phoneNumber, active: true }
        : { email, active: true },
      include: [
        {
          model: user_types,
          as: "userType",
          attributes: { exclude: ["createdAt", "updatedAt", "active"] },
        },
      ],
      attributes: {
        exclude: [
          "userTypeId",
          "passwordChangedAt",
          "passwordResetToken",
          "passwordResetExpires",
          "verificationToken",
          "updatedAt",
          "createdAt",
        ],
      },
    });
    if (!gottenUser) {
    
      return next(
        new AppError(
          phoneNumber ? loginPhoneNumberUnauthorized : loginEmailUnauthorized,
          unAuthorized
          )
          );
        }
    const { dataValues } = gottenUser;
    const passwordFromDb = dataValues.password;

    if (await bcryptjs.compare(password, passwordFromDb)) {
      //TODO: we can't block to use because he/she hasn't verified account, we will use this technique when they want to do delivery
      // if (!gottenUser.isVerified) {
      //   return next(new AppError(accountNotVerified, unAuthorized));
      // }

      //TODO: same goes here for the drivers we will check their ID's when they want to do delivery
      if (dataValues.userType.id == 2) {
        
        const driverInfo = await userExtraInfo(driver, dataValues.id);
        if (!driverInfo) return next(new AppError(userDontExist, unAuthorized));
        dataValues.driverInfo = driverInfo;
      }

      const userSettings = await settings.findOne({
        where: {
          userId: dataValues.id
        },
        attributes: { exclude: ["createdAt", "updatedAt","userId", "active"] },
      });

      dataValues.password = undefined;
      dataValues.settings = userSettings.dataValues

      req.userType = dataValues.userType.name;
      req.foundUser = dataValues;

      next();
    } else {
      next(
        new AppError(
          phoneNumber ? loginPhoneNumberUnauthorized : loginEmailUnauthorized,
          unAuthorized
        )
      );
    }
  });
