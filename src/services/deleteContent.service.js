import messages from "../utils/customMessages";
import { deleteResponse } from "../utils/responseHandlers";
import catchAsync from "../utils/catchAsync";
import db from "../database/models";

const { contentDeleted } = messages;

export const temporaryDelete = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const { databaseTable } = req;

  await databaseTable.update(
    {
      active: false,
    },
    {
      where: { id },
    }
  );
  return deleteResponse(res, contentDeleted);
});

export const temporaryDeleteForeignData = (query) => {
  return catchAsync(async (req, res, next) => {
    for (let [key, value] of Object.entries(query)) {
      key = db[key];
      await key.update(
        {
          active: false,
        },
        {
          where:  value ,
        }
      );
    }

    return deleteResponse(res, contentDeleted);
  });
};
