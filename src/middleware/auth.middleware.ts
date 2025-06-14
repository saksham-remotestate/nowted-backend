import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

export const authMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // const token = req.headers["authorization"]?.split(" ")[1];
  // const token = req.cookies.token;

  const token = req.headers.cookie
    ? req.headers.cookie.split(" ")[1].split("=")[1]
    : null;

  if (!token) {
    console.log("token missing");
    res.status(401).json({
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
        res.status(403).json({
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
