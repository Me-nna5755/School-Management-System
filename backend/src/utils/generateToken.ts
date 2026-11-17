
import type { Response } from "express";
import jwt from "jsonwebtoken";

export const generateToken = (userId: string, res: Response): string => {

    const token = jwt.sign(
        { userId },
        process.env.JWT_SECRET as string,
        {
            algorithm: "HS512"
        }
    );

    res.cookie("jwt", token, {
        httpOnly: true,
        sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
        secure: process.env.NODE_ENV === "production",
        maxAge: 30 * 24 * 60 * 60 * 1000,
        path: "/"
    });

    return token;
};
