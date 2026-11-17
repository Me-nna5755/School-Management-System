import type { NextFunction, Request, Response } from "express";
import type { IUser, userRoles } from "../models/user.Schema";
import jwt from "jsonwebtoken";
import User from "../models/user.Schema";

export interface AuthRequest extends Request {
  user?: IUser;
}

export const protect = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  const token = req.cookies?.jwt;

  if (!token) {
    res.status(401).json({
      status: "error",
      message: "Not authorized, no token",
    });
    return;
  }

  try {
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET as string
    ) as {
      userId?: string;
      id?: string;
    };

    const userId = decoded.userId ?? decoded.id;

    if (!userId) {
      res.status(401).json({
        status: "error",
        message: "Not authorized, invalid token",
      });
      return;
    }

    const foundUser = await User.findById(userId).select("+password");

    if (!foundUser) {
      res.status(401).json({
        status: "error",
        message: "Not authorized, user not found",
      });
      return;
    }

    req.user = foundUser;
    next();
  } catch (error) {
    console.error("Authentication Error:", error);

    res.status(401).json({
      status: "error",
      message: "Not authorized, token failed",
    });
  }
};

export const authorize = (roles: userRoles[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      res.status(401).json({
        status: "error",
        message: "Not authorized, no user",
      });
      return;
    }

    if (!roles.includes(req.user.role)) {
      res.status(403).json({
        status: "error",
        message: "Forbidden, insufficient permissions",
      });
      return;
    }

    next();
  };
};
