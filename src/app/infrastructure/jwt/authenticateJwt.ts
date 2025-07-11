import { NextFunction, Request, Response } from "express";
import { Result } from "../../../modules/common/result";
import { verifyJwt } from "./jwt";

export function authenticateJwt(req: Request, res: Response, next: NextFunction): void {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(" ")[1];
  if (!token) {
    res.status(401).json( Result.appFailed("No token provided", "You must provide a valid JWT token in the Authorization header"));
    return;
  }
  const payload = verifyJwt(token);
  if (!payload) {
    res.status(403).json(Result.appFailed("Invalid token", "The provided JWT token is invalid or expired"));
    return;
  }
  // @ts-ignore
  req.user = payload;
  next();
}
