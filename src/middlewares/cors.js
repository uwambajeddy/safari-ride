import cors from "cors";

const urls = {
  prod: "https://gobi-api-production.up.railway.app",
  prod: "https://gobi-dashboard.vercel.app",
  dev: `http://localhost:${process.env.PORT}`,
  app: "http://localhost:5000",
  website: "https://www.gobi.rw",
  dashboard_1: "http://localhost:3000",
  dashboard_2: "http://localhost:3001",
  dashboard_3: "http://localhost:3002",
  dashboard_4: "http://localhost:3003",
  dashboard_5: "http://localhost:3004",
};
const urlsAllowedToAccess =
  Object.entries(urls || {}).map(([key, value]) => value) || [];

export const configuration = {
  credentials: true,
  origin: function (origin, callback) {
    if (!origin || urlsAllowedToAccess.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error(`${origin} not permitted by CORS policy.`));
    }
  },
};

export default (req, res, next) => {
  return cors(configuration)(req, res, next);
};
