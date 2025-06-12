import { Response, Request } from "express";
import { z } from "zod";
import {
  createUserService,
  deleteUserService,
  getAllUsersService,
  getUserByEmailService,
  getUserByIdService,
  updateUserService,
} from "../services/userServices";
import { userData } from "../interface/user.type";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const handleResponse = (
  res: Response,
  status: number,
  message: string | any,
  users?: userData | userData[] | null
) => {
  res.status(status).json({
    status,
    message,
    users,
  });
};

const userSchema = z.object({
  username: z
    .string({ required_error: "username is required" })
    .trim()
    .min(3, "username should be at least 3 characters long"),
  email: z
    .string({ required_error: "email is required" })
    .trim()
    .email("invalid email"),
  password: z
    .string({ required_error: "password is required" })
    .trim()
    .min(8, "password should be at least 8 characters long"),
});

export const createUser = async (req: Request, res: Response) => {
  const { username, email, password } = req.body;
  const validate = userSchema.safeParse(req.body);
  if (!validate.success) {
    return handleResponse(res, 400, validate.error);
  }
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    if (!hashedPassword) {
      console.log("unable to generate hashed password");
      return handleResponse(res, 500, "Internal server error");
    }
    const newUser = await createUserService(username, email, hashedPassword);
    handleResponse(res, 201, "User created successfully", newUser);
  } catch (error) {
    console.log("createUser: ", error);
    handleResponse(res, 500, "Internal server error");
  }
};

export const getAllUsers = async (_req: Request, res: Response) => {
  try {
    console.log("Gello");
    const users = await getAllUsersService();
    console.log(users);
    return handleResponse(res, 200, "Users fetched successfully", users);
  } catch (error) {
    console.log("getAllUsers: ", error);
    return handleResponse(res, 500, "Internal server error");
  }
};

export const getUserById = async (req: Request, res: Response) => {
  try {
    const user = await getUserByIdService(req.params.id);
    if (!user) return handleResponse(res, 400, "User not found", []);
    handleResponse(res, 200, "User fetched successfully", user);
  } catch (error) {
    console.log("getUserById: ", error);
    handleResponse(res, 500, "Internal server error");
  }
};

export const updateUser = async (req: Request, res: Response) => {
  const { username, email } = req.body;
  const validate = userSchema.omit({ password: true }).safeParse(req.body);
  if (!validate.success) {
    return handleResponse(res, 400, validate.error);
  }
  try {
    const user = await updateUserService(req.params.id, username, email);
    if (!user) return handleResponse(res, 400, "User not found", []);
    handleResponse(res, 200, "User updated successfully", user);
  } catch (error) {
    console.log("updateUser: ", error);
    handleResponse(res, 500, "Internal server error");
  }
};

export const deleteUser = async (req: Request, res: Response) => {
  try {
    const user = await deleteUserService(req.params.id);
    if (!user) return handleResponse(res, 400, "User not found", []);
    handleResponse(res, 200, "User deleted successfully", user);
  } catch (error) {
    console.log("deleteUser: ", error);
    handleResponse(res, 500, "Internal server error");
  }
};

export const loginUser = async (req: Request, res: Response) => {
  try {
    const validate = userSchema.omit({ username: true }).safeParse(req.body);
    if (!validate.success) {
      return handleResponse(res, 400, validate.error);
    }
    const user = await getUserByEmailService(validate.data.email);
    if (!user) {
      console.log("user does not exist");
      return handleResponse(res, 400, "Invalid credentials");
    }
    const isValidPassword = await bcrypt.compare(
      validate.data.password,
      user.password
    );

    if (!isValidPassword) {
      console.log("invalid password");
      return handleResponse(res, 400, "Invalid credentials");
    }
    const token = jwt.sign(
      { id: user.id },
      process.env.ACCESS_TOKEN_SECRET ?? "ACCESS_TOKEN_SECRET",
      {
        expiresIn: "30s",
      }
    );

    if (!token) {
      console.log("unable to generate token");
      return handleResponse(res, 400, "Something went wrong");
    }

    const refreshToken = jwt.sign(
      { id: user.id },
      process.env.REFRESH_TOKEN_SECRET ?? "REFRESH_TOKEN_SECRET"
    );

    if (!refreshToken) {
      console.log("unable to generate refresh token");
      return handleResponse(res, 400, "Something went wrong");
    }

    res.cookie("token", token, { httpOnly: true });
    res.cookie("refresh_token", refreshToken, { httpOnly: true });

    delete user.password;

    return handleResponse(res, 200, "User logged in successfully", user);
  } catch (error) {
    console.log("loginUser: ", error);
    return handleResponse(res, 500, "Internal server error");
  }
};

export const logoutUser = async (req: Request, res: Response) => {
  res.clearCookie("token");
  res.clearCookie("refresh_token");
  handleResponse(res, 200, "User logged out successfully")
};

export const getRefreshToken = async (req: Request, res: Response) => {
  try {
    // const refreshToken = req.cookies.refresh_token;
    const refreshToken = req.headers.cookie
      ? req.headers.cookie.split(" ")[0].split("=")[1]
      : null;
    console.log("refresh token: ",refreshToken)
    if (!refreshToken) {
      console.log("refresh token is null");
      handleResponse(res, 401, "Refresh token is missing");
      return;
    }
    jwt.verify(
      refreshToken,
      process.env.REFRESH_TOKEN_SECRET ?? "REFRESH_TOKEN_SECRET",
      (
        error: jwt.VerifyErrors | null,
        _user: string | jwt.JwtPayload | undefined
      ) => {
        if (error) {
          console.log(error.message);
          handleResponse(res, 403, error.message);
        }
        const token = jwt.sign(
          { id: req.user.id },
          process.env.ACCESS_TOKEN_SECRET ?? "ACCESS_TOKEN_SECRET",
          {
            expiresIn: "1d",
          }
        );
        if (!token) {
          console.log("unable to generate token");
          return handleResponse(res, 400, "Something went wrong");
        }
        res.cookie("token", token, { httpOnly: true });
      }
    );
  } catch (error) {
    handleResponse(res, 401, "Unauthenticated user");
  }
};
