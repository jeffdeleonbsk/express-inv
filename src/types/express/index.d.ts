import "express";
import { JwtPayload } from "../../common/jwt";

declare module "express-serve-static-core" {
  interface Request {
    user?: JwtPayload;
  }
}
