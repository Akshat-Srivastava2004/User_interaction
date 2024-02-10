import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const likepostbyuser=asyncHandler(async(req,res)=>{
   try {
     const postId=req.params.Id;
     const userId=req.user.id;
 
    return  res.status(200).json(
     new ApiResponse(200,userId,"Postlike successfully")
    )
 
   } catch (error) {
    throw new ApiError(500,"something went wrong while liking post")
   }
})
export {likepostbyuser}


                                          //LOGIC FOR LIKING A POST//

                                          

/*When a user is logged in and viewing a list of posts on their screen, each post likely has a unique identifier associated with it. In the frontend, this identifier could be stored as a property of each post object.

For example, let's say you're rendering a list of posts in your frontend application. Each post in the list might be represented as an object like this:
{
  id: 'post1',
  title: 'Example Post 1',
  content: 'Lorem ipsum dolor sit amet...',
  // Other properties
}In this case, 'post1' could be the unique identifier (ID) for the first post. When the user clicks on the like button for this post, your frontend application can send a request to your server with this post ID, allowing the server to know which post the user is liking.
In this request, post1 is the ID of the post being liked. This ID is extracted from the URL parameters (req.params.postId) in your server-side code, just like you have implemented in your likePost function.*/