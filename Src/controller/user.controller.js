import { asyncHandler } from "../utils/async.handler.js";
import { ApiError } from "../utils/ApiError.js";
import { User} from "../models/user.model.js"
import { uploadOnCloudinary } from "../utils/Cloudinary.js";

const userRegister = asyncHandler((req,res)=>{
    // get user details from frontend
    // validation - not empty
    // check if user already exists: username, email
    // check for images, check for avatar
    // upload them to cloudinary, avatar
    // create user object - create entry in db
    // remove password and refresh token field from response
    // check for user creation
    // return res

    //1=> get user details from frontend
    const {fullName, email, username, password } = req.body
    //console.log("email: ", email);

    // 2=> validation - not empty
    if([fullName,email,username,password].some((feild)=>feild?.trim==="")){
       throw new ApiError(400,"All feilds are required.")
    }

    // 3=>  check if user already exists: username, email
    const UserExiets=await User.findOne({
        $or: [{ username }, { email }]
    })

    if(UserExiets){
      throw new ApiError(409,"User already exits")
    }

    // 4=> check for images, check for avatar
    //req.files()
    
    
  })

export {userRegister}