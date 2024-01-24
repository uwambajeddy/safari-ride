import { createClient } from "redis";
import logger from "../utils/logger";

const { REDIS_URL, REDIS_PWD } = process.env;

const redisClient = createClient({
  url: REDIS_URL,
  password: REDIS_PWD,
});

redisClient.on("connect", () => {
  logger.info("Redis client connected...");
});

redisClient.on("ready", () => {
  logger.success("Redis client connected and ready to use...");
});

redisClient.on("error", (err) => {
  logger.error("Redis Error 💥: " + err);
});

redisClient.on("end", (err) => {
  logger.warn("Redis client end...");
});

(async () => {
  await redisClient.connect();
})();

export const setToken = async (key, value) => await redisClient.set(key, value);
export const deleteToken = async (key) => await redisClient.del(key);
export const getToken = async (key) => await redisClient.get(key);

export default redisClient;
