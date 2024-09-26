import mongoose from "mongoose";
import jwt  from "jsonwebtoken";


interface IUser extends mongoose.Document
{
    username: string;
    email: string;
    createAccessToken: () => string;
}
const googleUsers = new mongoose.Schema(
    {
        username:
        {
            type: String,
            required: [true, "Please provide username"],
            max: 30
        },
        email:
        {
            type: String,
            unique: true,
            required: [true, "Please provide email address"],
            match: [/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/, "Please provide a valid email address"]
        },
    }, {timestamps: true}
);

// create JWT for access token
if(!process.env.ACCESS_TOKEN_SECRET ) throw new Error("ACCESS_TOKEN_SECRET is undefined");
const ACCESS_TOKEN_SECRET: string = process.env.ACCESS_TOKEN_SECRET;

googleUsers.methods.createAccessToken = function(): string
{
    return jwt.sign({userID: this._id, username: this.username}, ACCESS_TOKEN_SECRET, {expiresIn:process.env.ACCESS_TOKEN_LIFETIME});
}


const GoogleUser = mongoose.model<IUser>("GoogleUser", googleUsers);
export default GoogleUser;