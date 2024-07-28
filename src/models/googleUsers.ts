import mongoose from "mongoose";
import jwt  from "jsonwebtoken";


interface IUser extends mongoose.Document
{
    username: string;
    email: string;
    createJWT: () => string;
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

// create JWT
if(!process.env.JWT_SECRET ) throw new Error("JWT_SECRET is undefined");
const JWT_SECRET: string = process.env.JWT_SECRET;

googleUsers.methods.createJWT = function(): string
{
    return jwt.sign({userID: this._id, username: this.username}, JWT_SECRET, {expiresIn:process.env.JWT_LIFETIME});
}


const GoogleUser = mongoose.model<IUser>("User", googleUsers);
export default GoogleUser;