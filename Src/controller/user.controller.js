import { asyncHandler } from "../utils/async.handler.js";
import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/user.model.js";
import { uploadOnCloudinary } from "../utils/Cloudinary.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import mongoose from "mongoose";
import { verify } from "jsonwebtoken";
import {VerifyJwt} from "../middleware/auth.middleware.js"
    const generateAccessTokensAndRefrshToken= async(userId)=>{
       try{
        const user = await User.findById(userId)
        const accessToken = user.generateAccessToken()
        const refreshToken = user.generateRefreshToken()

        user.refreshToken = refreshToken
        await user.save({ validateBeforeSave: false })

        return {accessToken, refreshToken}
    } catch (error) {
        console.log("TOKEN GENERATION ERROR:", error)
        throw new ApiError(500,"Something went wrong while generating refresh and access token")
    }
}

const userRegister = asyncHandler(async (req, res) => {

    // 1. Get user details from frontend
    const { fullName, email, userName, password } = req.body;

    // console.log("BODY:", req.body);
    // console.log("FILES:", req.files);

    // 2. Validation
    if (
        [fullName, email, userName, password].some(
            (field) => !field?.trim()
        )
    ) {
        throw new ApiError(400, "All fields are required.");
    }

    // 3. Check if user already exists
    const userExists = await User.findOne({
        $or: [{ userName }, { email }]
    });

    if (userExists) {
        throw new ApiError(409, "User already exists");
    }

    // 4. Get image paths
const avtarLocalPath = req.files?.avtar?.[0]?.path;

const coverImageLocalPath =
    req.files?.coverImage?.[0]?.path;

console.log("AVATAR PATH:", avtarLocalPath);
console.log("COVER IMAGE PATH:", coverImageLocalPath);

if (!avtarLocalPath) {
    throw new ApiError(400, "Avatar file is required");
}

// 5. Upload avatar
const avtar = await uploadOnCloudinary(avtarLocalPath);
console.log("FILES:", req.files);
if (!avtar) {
    throw new ApiError(400, "Avatar upload failed");
}

// 6. Upload cover if provided
const coverImage = coverImageLocalPath
    ? await uploadOnCloudinary(coverImageLocalPath)
    : null;

    // 7. Create user
    const user = await User.create({
        userName: userName.toLowerCase(),
        fullName,
        email,
        avtar: avtar.url,
        coverImg: coverImage?.url || "",
        password
    });

    const userCreated = await User.findById(user._id).select(
        "-password -refreshToken"
    )
    if(!userCreated){
        throw new ApiError(500,"something went wrong while making the user")
    }


    // 8. Send response
    return res.status(201).json(
        new ApiResponse(
            201,
            userCreated,
            "User registered successfully"
        )
    );
});
 
const userLogin = asyncHandler(async(req,res)=>{

    // req.body = data
    // userbname or email
    // find data in db
    // password cheak
    // access and refresh token
    // coookies for sendinf the tokens 

    const {email,userName,password}=req.body

    if(!userName && !email){
        throw new ApiError(400,"Email or username is required.")
    }

    const user = await User.findOne({
        $or:[{userName},{email}]
    })

    if(!user){
        throw new ApiError(400,"userName or Email not exits")
    }
    
    const passwordCheak=await user.isPasswordCorrect(password)

    if(!passwordCheak){
        throw new ApiError(401,"Invalid password")
    }

    const {accessToken,refreshToken} = await generateAccessTokensAndRefrshToken(user._id)
    
    const LoggendInUser = await User.findById(user._id).select(
        "-password -refreshToken"
    )

    const options = {
        httpOnly: true,
        secure: false
    }
    
    res.status(200)
    .cookie("accessToken",accessToken,options)
    .cookie("refreshToken",refreshToken,options)
    .json(
        new ApiResponse(
            200,
            {
               accessToken,
               refreshToken,
               user: LoggendInUser
            },
            "User Logged In successfully"
        )
    )
    })
    const LoggedOut = asyncHandler(async(req,res)=>{
        await User.findByIdAndUpdate(
        req.user._id,
        {
            $unset: {
                refreshToken: 1 // this removes the field from document
            }
        },
        {
            new: true
        }
    )

    const options = {
        httpOnly: true,
        secure: false
    }

    return res
    .status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json(new ApiResponse(200, {}, "User logged Out"))
    })
   
    const RefrshAccessToken = asyncHandler(async(req,res)=>{
        
       const token= req.cookies.refreshToken || req.body.refreshToken
       if(!token){
         throw new ApiError(401,"Unauthorised refresh tokens")
       } 
    try {
            const DecodedToken = verifyJwt(token,
        process.env.REFRESH_TOKEN_SECRET
       );
       
       const user = await User.findById(DecodedToken?._id)
       
       
        const {accessToken,refreshToken} = await generateAccessTokensAndRefrshToken(user._id)
    
       const options = {
        httpOnly: true,
        secure: false
       }
    
       res.status(200)
       .cookie("accessToken",accessToken,options)
       .cookie("refreshToken",refreshToken,options)
       .json(
            new ApiResponse(
                200, 
                {accessToken, refreshToken: newRefreshToken},
                "Access token refreshed"
            )
        )
        } catch (error) {
            throw new ApiError(401, error?.message || "Invalid refresh token")
        }
       
    })

    

export { userRegister,
         userLogin,
         LoggedOut,
         RefrshAccessToken
};