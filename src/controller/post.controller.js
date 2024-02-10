import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { Post } from "../model/post.model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import jwt from "jsonwebtoken";
import { User } from "../model/user.model.js";
const Postuser=(async(req,res)=>{
    console.log("aara hai");
    const {caption,Category}=req.body;
    console.log(caption,Category)
    if(Category===""){
        throw new ApiError(400,"please select the category")
    }
    

    const token =req.cookies.accessToken;
  console.log(" the current token is ", token);
  if (!token) {
    throw new ApiError(401, "Unauthorized request");
  }
  const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
  if (!decodedToken || !decodedToken._id) {
    throw new ApiError(401, "Invalid access token");
  }
  const user = await User.findById(decodedToken._id).select({
    password: 0,
    refreshToken: 0,
  });
  console.log("d-------", user);
  if (!user) {
    throw new ApiError(401, "User not found");
  }
  req.user = user;
 console.log(req.user._id);

    

const Postimagelocalpath=req.files?.Postimage?.[0]?.path;

if(!Postimagelocalpath){
    throw new ApiError(400,"file is not added or path is missing ")
}
const Postimage=await uploadOnCloudinary(Postimagelocalpath)

const post=await Post.create({
    caption,
    Category,
    Postimage:Postimage.url,
    author:req.user._id,
})
if(!post){
    throw new ApiError(409,"Sorry unable to  create post")
}

return res.status(201).json(
    new ApiResponse(200,post,"Post created succesfully")
)
})


const deletepost=asyncHandler(async(req,res)=>{
    try {
        const postId=req.params.id;
    
        await Post.findByIdAndDelete(postId);
        return res.status(200).json(
            new ApiResponse(200,postId,"Post deleted Successfully")
        )
    } catch (error) {
        throw new ApiError(500,"server error")
        
    }
})

const updatepost=asyncHandler(async(req,res)=>{
    try {
        const PostId=req.params.id;
        const{Caption,Postcategory}=req.body
        const updatedPost = await Post.findByIdAndUpdate(PostId, { Caption,Postcategory}, { new: true });
        return res.status(200).json(
            new ApiResponse(200,updatedPost,"post updated successfully")
        )
    } catch (error) {
        throw new ApiError(500,"Internal server error try again")
    }
})

export {Postuser,deletepost,updatepost}