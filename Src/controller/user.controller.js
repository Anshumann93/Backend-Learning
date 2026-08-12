import { asyncHandler } from "../utils/async.handler.js";
import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/user.model.js";
import { uploadOnCloudinary } from "../utils/Cloudinary.js";
import { ApiResponse } from "../utils/ApiResponse.js";

const userRegister = asyncHandler(async (req, res) => {

    // 1. Get user details from frontend
    const { fullName, email, userName, password } = req.body;

    console.log("BODY:", req.body);
    console.log("FILES:", req.files);

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
        req.files?.coverImg?.[0]?.path;

    if (!avtarLocalPath) {
        throw new ApiError(400, "Avatar file is required");
    }

    // 5. Upload avatar to Cloudinary
    const avtar = await uploadOnCloudinary(avtarLocalPath);

    if (!avtar) {
        throw new ApiError(400, "Avatar upload failed");
    }

    // 6. Upload cover image if provided
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

    const userCreated = await User.findById(User._id).select(
        "-password -refreshToken"
    )
    if(!userCreated){
        throw new ApiError("500","something went wrong while making the user")
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

export { userRegister };