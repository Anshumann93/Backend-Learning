import mongoose, { Schema } from "mongoose";
import bcrypt from "bcrypt";
import JWT from "jsonwebtoken";
import dotenv from "dotenv"

const userSchema=new Schema({
    userName:{
      require:true,
      type:String,
      lowercase:true,
      trim:true,
      unique:true,
      index:true
    },
    email:{
      type:String,
      require:true,
      lowercase:true,
      trim:true,
      unique:true
    },
    fullName:{
      type:String,
      require:true,
      lowercase:true,
      trim:true,
    },
    avtar:{
      type:String,      // cloudnary url
      required:true
    },
    coverImg:{
      type:String,     // cloudnary url
    },
    watchHistory:[  // the [] is for use multiple dynamic values
      {
        type:Schema.Types.ObjectId,
        ref:{video}
      }
    ],
    password:{
      type:true,
      required:[true,"pass is req.."]
    },
    refreshToken:{
      type:String
    }
  },
{
  timestamps:true
})

// This is for converting the user send password into encrypted form
// by pre means before the saving into db

userSchema.pre("save",async function(next) {
  if(!this.isModified(this.password)) return next();
  
  this.password= await bcrypt.hash(this.password,10);
  next()
})
//this code is for comparing the hash saved pass
userSchema.methods.isPasswordCorrect = async(password)=>{
    return await bctypt.compare(password,this.password)
}
userSchema.methods.generateAccessToken =async function() {
  return JWT.sign(
     {
      _id:this._id,
      email:this.email,
      userName:this.userName,
      fullName:this.fullName,
     },
      process.env.ACCESS_TOKEN_SECRET,
     {
      expiresIn: process.env.ACCESS_TOKEN_EXPIRY
     }
  )
}
  userSchema.methods.genrateRefreshToken=async function(){
    return JWT.sign(
     {
      _id:this._id,
    
     },
      process.env.REFRESH_TOKEN_SECRET,
     {
      expiresIn: process.env.REFRESH_TOKEN_EXPIRY
     }
  )
  }

export const user = mongoose.model("user",userSchema) 