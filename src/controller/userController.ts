import { Response, Request } from "express";
import { z } from "zod";
import {
  createUserService,
  deleteUserService,
  getAllUsersService,
  getUserByIdService,
  updateUserService,
} from "../services/userServices";
import { userData } from "../interface/user.type";

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
    const newUser = await createUserService(username, email, password);
    handleResponse(res, 201, "User created successfully", newUser);
  } catch (error) {
    console.log("createUser: ", error);
    handleResponse(res, 500, "Internal server error");
  }
};

export const getAllUsers = async (req: Request, res: Response) => {
  try {
    const users = await getAllUsersService();
    handleResponse(res, 200, "Users fetched successfully", users);
  } catch (error) {
    console.log("getAllUsers: ", error);
    handleResponse(res, 500, "Internal server error");
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
