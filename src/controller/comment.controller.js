import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { Comment } from "../model/comment.model.js";
import { User } from "../model/user.model.js";
import jwt from "jsonwebtoken"
import { Post } from "../model/post.model.js";

const commentbyuser = async (req, res) => {
    try {
        const { comment } = req.body;
        const token = req.cookies.accessToken;
        console.log("The current token is ", token);
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
        console.log("User:", user);
        if (!user) {
            throw new ApiError(401, "User not found");
        }
        req.user = user;
        const postId = await Post.findOne({ author: req.user._id });
        console.log("The post id is ", postId);
        console.log("User ID:", req.user._id);

        const commented = new Comment({
            comment,
            author: req.user._id,
            post: postId,
        });
        await commented.save();

        return res.status(201).json(
            new ApiResponse(200, commented, "Comment added successfully")
        );
    } catch (error) {
        // Send the error response to the client
        return res.status(error.status || 500).json({
            message: error.message || "Internal server error",
        });
    }
};

export { commentbyuser };