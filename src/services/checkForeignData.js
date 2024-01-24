import db from "../database/models";
import messages from "../utils/customMessages";

const { noContent } = messages;

export default async (data) => {
  let content;

  for (let [key, value] of Object.entries(data)) {
    if (key === "where") {
      let whereData = value;
      for (let [key, value] of Object.entries(whereData)) {
        const dbName = key;
        key = db[key];
        content = await key.findOne({
          where: { ...value, active: true },
        });

        if (!content) {
          return {
            status: false,
            message: `${noContent} from ${dbName} where ${JSON.stringify(
              value
            )}`,
          };
        }
      }
    } else {
      const dbName = key;
      key = db[key];
      content = await key.findOne({
        where: { id: value, active: true },
      });

      if (!content) {
        return {
          status: false,
          message: `${noContent} from ${dbName} where id ${value}`,
        };
      }
    }
  }
  return { status: true, content: content.dataValues };
};
