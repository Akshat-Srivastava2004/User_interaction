import mongoose ,{Schema} from "mongoose";

const likeSchema=new Schema({
    Postname:{
        type:Schema.Types.ObjectId,
        ref:"Post",
    },
    Username:{
        type:Schema.Types.ObjectId,
        ref:"User",
    }
},{timestamps:true})

export const Like=mongoose.model("Like",likeSchema)