import mongoose ,{Schema} from "mongoose";
import jwt from "jsonwebtoken"
import bcrypt from "bcrypt"

const userSchema=new Schema({
    username:{
        type: String,
        required:true,
        unique:true,
        lowercase:true,
        trim:true,
        index:true // for searching in a model
    },
    FirstName:{
        type:String,
        required:true,
        trim:true,
        index:true,
    },
    LastName:{
        type:String,
        required:true,
        trim:true,
        index:true,
    },
    Email:{
        type:String,
        required:true,
        unique:true,
        lowercase:true,
        trim:true,
    },
    Profilephoto:{
        type:String ,// cloudinary url
        required:true,
    },
    Password:{
        type:String,
        required:[true,'password is required'],
    },
    refreshToken:{
        type:String,
    }
},
{
    timestamps:true
}
)
userSchema.pre("save", async function (next) {
    if (!this.isModified("Password")) return next();
    //console.log(this.Password); // This will run only when the user changes the password
    this.Password = await bcrypt.hash(this.Password, 10);
    //console.log(Password,this.Password) // Encrypting the password
    next(); // Use for middleware
});

/*userSchema.methods.isPasswordCorrect = async function(Password) {
    return await bcrypt.compare(Password, this.Password);
    // Comparing the password at the time of login
};*/
userSchema.methods.isPasswordCorrect = async function(Password) {
    // Check if Password is provided
    if (!Password) {
        throw new Error("Password is required for comparison.");
    }
    // Check if this.Password is set
    if (!this.Password) {
        throw new Error("Hashed password is missing in the database.");
    }
    return await bcrypt.compare(Password, this.Password);
};



userSchema.methods.generateAcessToken=function(){
    return jwt.sign(
        {
        _id:this.id,
        Lastname:this.LastName,
        email:this.Email,
        username:this.username,
        fullname:this.FullName
        },
        process.env.ACCESS_TOKEN_SECRET,
        {                                                               // generating token 
            expiresIn:process.env.ACCESS_TOKEN_EXPIRY
        }
    )
    }
    userSchema.methods.generateRefreshToken=function(){
        return jwt.sign(
            {
            _id:this.id
            },
            process.env.REFRESH_TOKEN_SECRET,
            {
                expiresIn:process.env.REFRESH_TOKEN_EXPIRY
            }
        )
        }

 export const User=mongoose.model("User",userSchema)        