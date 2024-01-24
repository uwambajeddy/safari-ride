import Joi from "joi";
import AppError from "./appError";
import catchAsync from "./catchAsync";
import statusCode from "./statusCodes";
import IDAnalyzer from "idanalyzer";
import logger from "./logger";

let CoreAPI = new IDAnalyzer.CoreAPI(`${process.env.IDANALYZER_KEY}`, "US");

CoreAPI.enableAuthentication(true, 2);
CoreAPI.restrictCountry("RW");
CoreAPI.enableAuthentication(true, 'quick');
CoreAPI.setBiometricThreshold(0.6);

const { badRequest } = statusCode;

async function validator(schema, data) {
  const validator = await schema.validate(data, {
    abortEarly: false,
  });
  const { error } = validator;

  if (error) {
    const { details } = error;
    const messages = details
      .map((err) => err.message.replace(/['"]/g, ""))
      .join(", ");

    return messages;
  }
  return true;
}

export const validate = (fields) => {
  return catchAsync(async (req, res, next) => {
    let isValid = true;

    // Create an array to store promises
    const validationPromises = [];

    for (let [key, value] of Object.entries(fields)) {
      value.map((action) => {
        let schemaData = {};
        action = action.split(",");
        schemaData[key] = action[1]
          ? Joi[action[0]]()[action[1]](
            action[2]
              ? Number(action[2]) == "NaN"
                ? action[2]
                : Number(action[2])
              : action[2]
          )
          : Joi[action[0]]();
        const schema = Joi.object(schemaData);

        // Push the validation promise to the array
        validationPromises.push(
          validator(
            schema,
            {
              [key]:
                key === "driverLicence" ||
                key === "faceImage" ||
                key === "identityCard" ||
                key === "packageImage" ||
                key === "profileImage" ||
                key === "packageImage" ? req.body[key] || req.file : req.body[key],
            },
            next
          )
        );
      });
    }

    // Wait for all validation promises to resolve
    const results = await Promise.all(validationPromises);

    // Check the results and set isValid
    for (const result of results) {
      if (result !== true) {
        isValid = false;
        return next(new AppError(result, badRequest));
      }
    }

    if (isValid) {
      return next();
    }
  });
};

export const verifyDocument = async (document_primary, biometric_photo) => {
  try {

    const sentDocument = await CoreAPI.scan({ document_primary, biometric_photo });

    if (sentDocument.error) {
      return {
        isValid: false,
        error: sentDocument.error
      }
    }

    return {
      isValid: true,
      sentDocument

    }

  } catch (error) {
    logger.error(`verify document error❗❗: ${error}`)
    return {
      isValid: false,
      serverError: true,
      error
    }
  }
}
