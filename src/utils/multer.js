import AppError from "./appError.js";
import cloudinary from "../config/cloudinary.config";
import customMessages from "../utils/customMessages";
import statusCode from "../utils/statusCodes.js";
import multer from "multer";

const { invalidImage } = customMessages;
const storage = multer.diskStorage({});
const {badRequest}=statusCode

const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image")) {
    cb(null, true);
  } else {
    cb(new AppError(invalidImage, 400), false);
  }
};

export const uploads = multer({ storage, fileFilter });

export const fileUpload = async (filePath,folder, next) => {
  let imageUrl = "";
  await cloudinary.v2.uploader.upload(
    filePath,
    {
      folder
    },
    async function (err, image) {
      if (err) {
        return next(new AppError(err.message,badRequest));
      }
      imageUrl = image.secure_url;
    }
  );
  return imageUrl;
};
export const renameFile = async (oldName,newName) => {
  await cloudinary.v2.uploader.rename(
    oldName,newName).then(
    async function (results) {
      return results;
    }
  );
};