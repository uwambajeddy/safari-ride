import catchAsync from "../utils/catchAsync";
import { findAllData } from "../middlewares/contentChecker";


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