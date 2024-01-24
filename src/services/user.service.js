import catchAsync from "../utils/catchAsync";
import systemUserTypes from "../utils/systemUserTypes";
import db from "../database/models";

const {
  drivers
} = db;

const {
  driver
} = systemUserTypes;

export const userExtraInfo = (name, userId) => {
  return new Promise(
    catchAsync(async (resolve) => {
      let gottenUser;

      switch (name) {
        case driver:
          gottenUser = await drivers.findOne({
            where: { userId },
            attributes: {
              exclude: ["updatedAt", "createdAt"],
            },
          });
          gottenUser = gottenUser ? gottenUser.dataValues : false;
          break;

        default:
          break;
      }
      return resolve(gottenUser);
    })
  );
};

export const userPermissions = (name, userId) => {
  //in the future if community and ebind has permissions will add if else for them
  if (name === schoolUser) {
    return new Promise(
      catchAsync(async (resolve) => {
        let responsePermissions = [];
        let gottenPermissions = await s_user_permissions.findAll({
          where: { userId },
        });
        if (gottenPermissions.length === 0) return resolve(responsePermissions);
        gottenPermissions = gottenPermissions.dataValues;

        gottenPermissions.forEach((permission) => {
          const database = db[permission.permissionType];

          permission.permissionType === "s_role_permissions"
            ? catchAsync(async () => {
                const permissions = await database.findAll({
                  where: {
                    schoolRolesId: permission.permissionTypeId,
                  },
                  include: [
                    {
                      model: edu_permissions,
                      as: "edu_permissions",
                    },
                  ],
                });
                permissions.map((permission) => {
                  responsePermissions.push(permission.edu_permissions.name);
                });
              })
            : catchAsync(async () => {
                const permission = await database.findOne({
                  where: { id: permission.permissionTypeId },
                });

                responsePermissions.push(permission.name);
              });
        });

        return resolve(responsePermissions);
      })
    );
  }
};
