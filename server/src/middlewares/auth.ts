import { NextFunction, Request, Response } from "express";
import { User } from "../entities/User";

export default async(req: Request, res: Response, next: NextFunction) => {
    try {
        // user.ts에서 할당한 user
        const user: User | undefined = res.locals.user;

        // user가 없다면
        if(!user) throw new Error("Unauthenticated");

        return next();

    } catch (error) {
        console.log(error);
        return res.status(401).json({error: "Unauthenticated"});
    }
}