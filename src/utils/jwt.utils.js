import jwt from "jsonwebtoken";
import { promisify } from "util";
import { verify } from "jsonwebtoken";

export function signJwt(object, options) {
  return jwt.sign(object, privateKey, {
    ...(options && options),
    algorithm: "RS256",
  });
}

export async function verifyJwt(token) {
  try {
    const decoded = await promisify(verify)(
      token,
      process.env.JWT_ACCESS_SECRET
    );
    return {
      valid: true,
      expired: false,
      decoded,
    };
  } catch (e) {
    return {
      valid: false,
      expired: e.message === "jwt expired",
      decoded: null,
    };
  }
}
