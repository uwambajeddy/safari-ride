import db from "../database/models";
import AppError from "../utils/appError";
import catchAsync from "../utils/catchAsync";
import messages from "../utils/customMessages";
import statusCode from "../utils/statusCodes";
import { Op } from "sequelize";

const { notFound } = statusCode;
const { noContent } = messages;

export const findData = (database) => {
  let databaseInUse = database.where
    ? db[Object.entries(database.where)[0][0]]
    : db[database];
  let paramQuerySQL = {};

  return catchAsync(async (req, res, next) => {
    const id = req.params.id;

    if (database.where?.include) paramQuerySQL.include = database.where.include;

    if (database.where) {
      paramQuerySQL.where = {
        id,
        ...Object.entries(database.where)[0][1],
        active: true,
      };
    } else {
          paramQuerySQL.where = { id, active: true };
    }

    const content = await databaseInUse.findOne(paramQuerySQL);

    if (!content) {
      return next(new AppError(noContent, notFound));
    }
    req.foundData = content;
    req.databaseTable = databaseInUse;
    return next();
  });
};

export const findAllData = (database) => {
  let databaseInUse = database.where
    ? db[Object.entries(database.where)[0][0]]
    : db[database];

  return catchAsync(async (req, res, next) => {
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

    if (database.where?.include) paramQuerySQL.include = database.where.include;
    if (database.where) {
      paramQuerySQL.where =
        query.length > 0
          ? {
              ...Object.entries(database.where)[0][1],
              active: true,
              [Op.or]: query,
            }
          : {
              ...Object.entries(database.where)[0][1],
              active: true,
            };
    } else {
          paramQuerySQL.where =
            query.length > 0
              ? {
                  active: true,
                  [Op.or]: query,
                }
              : {
                  active: true,
                };
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
    const data = await databaseInUse.findAndCountAll(paramQuerySQL);

    const { count: totalItems, rows: results } = data;
    const currentPage = page ? +page : 0;
    const totalPages = size ? Math.ceil(totalItems / paramQuerySQL.limit) : 1;

    req.foundData = { totalItems, results, totalPages, currentPage };
    req.databaseTable = databaseInUse;
    return next();
  });
};
