// import { asyncHandler } from "../utils/async.handler.js";
// import jwt from "jsonwebtoken";
// import { User } from "../models/user.model.js";
// import { ApiError } from "../utils/ApiError.js";

// export const VerifyJwt = asyncHandler(async (req, res, next) => {
//     try {
//         // Get access token from cookie or Authorization header
//         const token =
//             req.cookies?.accessToken ||
//             req.header("Authorization")?.replace("Bearer ", "");

//         // Check whether token exists
//         if (!token) {
//             throw new ApiError(401, "Access token is required");
//         }

//         // Verify token
//         const decodedToken = jwt.verify(
//             token,
//             process.env.ACCESS_TOKEN_SECRET
//         );

//         // Find user from token's _id
//         const user = await User.findById(decodedToken._id)
//             .select("-password -refreshToken");

//         // Check user
//         if (!user) {
//             throw new ApiError(401, "Invalid access token");
//         }

//         // Attach user to request
//         req.user = user;

//         // Continue to controller
//         next();

//     } catch (error) {
//         throw new ApiError(
//             401,
//             error?.message || "Invalid access token"
//         );
//     }
// });

import { asyncHandler } from "../utils/async.handler.js";
import jwt from "jsonwebtoken";
import { User } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";

export const VerifyJwt = asyncHandler(async (req, res, next) => {
    try {
        const cookieToken = req.cookies?.accessToken;
        const headerToken = req.header("Authorization");

        console.log("COOKIE TOKEN:", cookieToken);
        console.log("COOKIE TOKEN TYPE:", typeof cookieToken);

        console.log("AUTH HEADER:", headerToken);
        console.log("AUTH HEADER TYPE:", typeof headerToken);

        const token =
            cookieToken ||
            headerToken?.replace("Bearer ", "");

        console.log("FINAL TOKEN:", token);
        console.log("FINAL TOKEN TYPE:", typeof token);

        if (!token || typeof token !== "string") {
            throw new ApiError(401, "Access token is missing or invalid");
        }

        const decodedToken = jwt.verify(
            token,
            process.env.ACCESS_TOKEN_SECRET
        );

        console.log("DECODED TOKEN:", decodedToken);

        const user = await User.findById(decodedToken._id)
            .select("-password -refreshToken");

        if (!user) {
            throw new ApiError(401, "Invalid access token");
        }

        req.user = user;

        next();

    } catch (error) {
        console.log("JWT ERROR:", error);

        throw new ApiError(
            401,
            error?.message || "Invalid access token"
        );
    }
});