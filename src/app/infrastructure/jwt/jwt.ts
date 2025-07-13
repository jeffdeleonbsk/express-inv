import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "your_jwt_secret";
const JWT_EXPIRES_IN =  "10h";

export interface IJwtPayload {
  userId: string;
  username: string;
}

export function signJwt(payload: IJwtPayload): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
}

export function verifyJwt(token: string): IJwtPayload | null {
  try {
    return jwt.verify(token, JWT_SECRET) as IJwtPayload;
  } catch (err) {
    return null;
  }
}
