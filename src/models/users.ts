import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs"

import dotenv from "dotenv";

dotenv.config();

interface IUser extends mongoose.Document
{
    username: string;
    email: string;
    password: string;
    verified: boolean;
    emailVerificationToken: () => string;
    passwordResetToken: () => string;
    comparePasswords: () => Promise<boolean>;
}

const userSchema = new mongoose.Schema(
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
        password:
        {
            type: String,
            required: [true, "Please provide a password"]
        },
        verified:
        {
            type: Boolean,
            default: false
        }

    }, {timestamps: true}
);

// Schema methods


// create JWT
if(!process.env.JWT_SECRET ) throw new Error("JWT_SECRET is undefined");
const JWT_SECRET: string = process.env.JWT_SECRET;

userSchema.methods.createJWT = function(): string
{
    return jwt.sign({userID: this._id, username: this.username}, JWT_SECRET, {expiresIn: process.env.JWT_LIFETIME});
}


// generate email verification token
userSchema.methods.emailVerificationToken = function(): string
{
    return jwt.sign({userID: this._id, username: this.username}, JWT_SECRET, {expiresIn: process.env.CONFIRMATION_TOKEN_LIFETIME});
}


// generate password reset token
userSchema.methods.passwordResetToken = function(): string
{
    return jwt.sign({userID: this._id, username: this.username}, JWT_SECRET, {expiresIn: process.env.PASSWORD_RESET_TOKEN_LIFETIME});
}


// encrypt the password
userSchema.pre('save', async function(): Promise<void>
{
    try
    {
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(this.password,salt);
        this.password = hashedPassword;

    }
    catch (error)
    {
        console.error(error);
    }

})


// compare provided password to the one that is in the db.
userSchema.methods.comparePasswords = async function(candidatePassword: string): Promise<boolean>
{
    const isMatch = await bcrypt.compare(candidatePassword,this.password);
    return isMatch;
}



const User =  mongoose.model<IUser>("User", userSchema);
export default User;

