import catchAsync from "../utils/catchAsync";
import { findAllData } from "../middlewares/contentChecker";
import db from "../database/models";

const { provinces,districts,sectors } = db;
export const getAllCountries = catchAsync(async (req, res, next) => {

  let where = {
    where: {
      countries: { active: true },
      include: [
        {
          model: provinces,
          include: [
            {
              model: districts,
              include: [
                {
                  model: sectors,
                },
              ],
            },
          ],
        },
      ],
    }
  }
  
  
  return findAllData(where)(req, res, next);
});