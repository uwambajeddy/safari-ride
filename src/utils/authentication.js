import jwt from "jsonwebtoken";
import { setToken } from "../config/redis.config";

export const generateToken = async (id, userType) => {
  async function GenerateRefreshToken() {
    const refreshToken = jwt.sign(
      { sub: id, userType },
      process.env.JWT_REFRESH_SECRET,
      {}
    );

    await setToken(id.toString(), JSON.stringify({ refreshToken }));

    return refreshToken;
  }

  const accessToken = jwt.sign(
    { sub: id, userType },
    process.env.JWT_ACCESS_SECRET,
    {
      expiresIn: process.env.JWT_ACCESS_TIME,
    }
  );
  const refreshToken = await GenerateRefreshToken();

  return { accessToken, refreshToken };
};

export const generateAccessToken = async (id, userType) => {
  const accessToken = jwt.sign(
    { sub: id, userType },
    process.env.JWT_ACCESS_SECRET,
    {
      expiresIn: process.env.JWT_ACCESS_TIME,
    }
  );

  return accessToken;
};
