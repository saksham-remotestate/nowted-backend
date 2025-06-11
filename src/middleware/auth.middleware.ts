import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

export const authMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const token = req.headers["authorization"]?.split(" ")[1];

  if (!token) {
    console.log("token missing");
    res.send({
      status: 401,
      message: "unauthenticated user",
    });
    return;
  }

  jwt.verify(
    token,
    process.env.ACCESS_TOKEN_SECRET ?? "ACCESS_TOKEN_SECRET",
    (err, user) => {
      if (err) {
        res.send({
          status: 403,
          error: err.message,
        });
        return;
      }

      req.user = user;
      console.log(req.user.id);
    }
  );
  next();
};
