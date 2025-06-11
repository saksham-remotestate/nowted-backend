import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

export const authMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader?.split(" ")[1];
  if (!token) {
    console.log("token missing");
    res.send({
      status: 401,
      message: "unauthenticated user",
    });
    return;
  }

  jwt.verify(token, process.env.JWT_TOKEN ?? "123", (err, user) => {
    if (err) {
      res.send({
        status: 403,
        message: "Access denied",
      });
      return;
    }
    console.log(user);
  });
  next();
};
