import mongoose ,{Schema} from "mongoose";

const postSchema=new Schema({
    caption:{
        type:String,
        required:false,
    },
    Postimage:{
        type:String,
        required:true,
    },
    author:{
        type:Schema.Types.ObjectId,
        ref:"User",
    },
    Category:{
        type:Schema.Types.ObjectId,
        ref:"Category"
    }
},{timestamps:true})

export const Post=mongoose.model("Post",postSchema)
