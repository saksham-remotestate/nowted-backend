import * as express from "express";
import { User } from "../utils/user.interface";
declare global {
  namespace Express {
    interface Request {
      user: User;
    }
  }
}
