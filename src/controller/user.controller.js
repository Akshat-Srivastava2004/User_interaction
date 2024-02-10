import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { User } from "../model/user.model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { Postuser } from "./post.controller.js";



                                 // REGISTERING THE USER //


const registerUser=asyncHandler(async(req,res)=>{
    const {FirstName,LastName,username,Email,Password}=req.body
       console.log(FirstName,username)
        if(FirstName===""){
            throw new ApiError(400,"FirstName is required ")
        }
        if(LastName===""){
            throw new ApiError(400,"LastName is required")
        }
        if(username===""){
            throw new ApiError(400,"username is required")
        }
        if(Email===""){
            throw new ApiError(400,"Email is required ")
        }
        if(Password===""){
            throw new ApiError(400,"password is required")
        }

    
        const existeduser=await User.findOne({
            $or:[{username},  {Email}]
        })
        
        if(existeduser){
            throw new ApiError(409,"user already existed with this username")
        }

        const Profilephotolocalpath=req.files?.Profilephoto?.[0]?.path;
        console.log("the profile photo local path is ",Profilephotolocalpath)

        if(!Profilephotolocalpath){
            throw new ApiError(400,"profile photo is required ")
        }

        const Profilephoto=await uploadOnCloudinary(Profilephotolocalpath)
        console.log(Profilephoto)

        const  user=await User.create({
            FirstName,
            LastName,
            Profilephoto:Profilephoto.url,
            Email,
            Password,
            username
        })

        const createdUser=await User.findById(user._id).select(
            "-Password -refreshToken"
        )

        if(!createdUser){
            throw new ApiError(500,"Sorry unable to register user ")
        }
        return res.status(201).json(
            new ApiResponse(200,createdUser,"user registered successfully")
           )        
})



         // GENERATING TOKEN WHEN USER IS LOGIN THIS WILL WORK AFTER USER ENTER CORRECT USERNAME AND PASSWORD //
const generateAcessTokenAndRefereshTokens=async(userId)=>{
    try {
        const user=await User.findById(userId)
        console.log(user);
        const accessToken=user.generateAcessToken()
        const refreshToken=user.generateRefreshToken()
        console.log("accessToken is :",accessToken)
        console.log("refreshToken is :",refreshToken
        )
        user.refreshToken=refreshToken;
        await user.save();
       console.log("token aagya hai wth ")
        // console.log(refreshToken)
        // await user.save({validateBeforeSave:false})
        return {accessToken,refreshToken}
    } catch (error) {
        throw new ApiError(500,"somethning went wrong  while generating tokens")
    }
    }


    // USER ENTERING THE USERNAME AND PASSWORD FOR LOGIN//

const loginuser=(async(req,res)=>{
    const {username,Password}=req.body
    console.log(username,Password)
    
    if(!username){
        throw new ApiError(400,"Username is required")
    }
    const user=await User.findOne({
        $or:[{username}]
    })
    if(!user){
        throw new ApiError(400,"user doesnot exist with this username and email")
    }
    const isPasswordvalid=await user.isPasswordCorrect(Password)
    console.log(isPasswordvalid)

    if(!isPasswordvalid){
        throw new ApiError(400,"Password enter by you is incorrect please enter the correct password")
    }

    
 const {accessToken,refreshToken}= 
    await generateAcessTokenAndRefereshTokens(user._id)
    console.log(accessToken)
    console.log(refreshToken)
 
     const loggedInUser=await User.findById(user._id)
     const log=Postuser(loggedInUser)
     console.log(log)
    //  select({ password: 0, refreshToken: 0 });
     console.log(loggedInUser)
 
     const options={
         httpOnly:true,
         secure:true
     }


                                // SENDING THE TOKEN IN THE COOKIES//
                                
     return res
     .status(200).cookie("accessToken",accessToken,options)
     .cookie("refreshToken",refreshToken,options)
     .json(
         new ApiResponse(
             201,{
                 // data 
                 user:loggedInUser,accessToken,
                 refreshToken,
             },
             "user logged in succesfully "
         )
     )
})

export {registerUser,loginuser}