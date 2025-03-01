import jwt from "jsonwebtoken";

import { User } from "../db/models/Users";

type DecodedToken = {
    email: string;
    userId: string;
}

export const authMiddleware = async (req, res, next) => {
    const authHeader = req.headers.authorization;
    const secret = process.env.JWT_SECRET || "theGodOfCricket";
    if (authHeader) {
        // token =  "Bearer token";
        const token = authHeader.split(' ')[1];;
        const decodedToken = jwt.verify(token, secret) as DecodedToken;
        const user = await User.findOne({ _id: decodedToken.userId }).select("+ _id, + email");

        if (user) {
            req.user = user;
            next();
        } else {
            res.status(403).send({
                message: "You are not authorised."
            })
        }

    } else {
        res.state(403).send({
            message: "You are not authorised."
        })
    }
}