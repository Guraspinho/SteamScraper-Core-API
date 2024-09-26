import mongoose, { CallbackError } from "mongoose";
import jwt from "jsonwebtoken";
import argon2 from "argon2";
import dotenv from "dotenv";


dotenv.config();

interface IUser extends mongoose.Document
{
    username: string;
    email: string;
    password: string;
    verified: boolean;
    createAccessToken: () => string;
    createRefreshToken: () => string;
    emailVerificationToken: () => string;
    passwordResetToken: () => string;
    comparePasswords: (candidatePassword:string) => Promise<boolean>;
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


// create JWTs for access token and refresh token
if(!process.env.ACCESS_TOKEN_SECRET || !process.env.JWT_SECRET || !process.env.REFRESH_TOKEN_SECRET) throw new Error("env variable is undefined");

const ACCESS_TOKEN_SECRET: string = process.env.ACCESS_TOKEN_SECRET;
const JWT_SECRET: string = process.env.JWT_SECRET;
const REFRESH_TOKEN_SECRET: string = process.env.REFRESH_TOKEN_SECRET;

// create access tokens
userSchema.methods.createAccessToken = function(): string
{
    return jwt.sign({userID: this._id, username: this.username}, ACCESS_TOKEN_SECRET , {expiresIn: process.env.ACCESS_TOKEN_LIFETIME});
}

// create refresh tokens
userSchema.methods.createRefreshToken = function(): String
{
    return jwt.sign({userID: this._id, username: this.username}, REFRESH_TOKEN_SECRET , {expiresIn: process.env.REFRESH_TOKEN_LIFETIME})
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
userSchema.pre('save', async function(next): Promise<void>
{
    if (!this.isModified('password'))
    {
        return next();
    }
    try
    {
        const hashedPassword = await argon2.hash(this.password);
        this.password = hashedPassword;
        next();
    } 
    catch (error)
    {
        next(error as CallbackError);
    }
});


// compare provided password to the one that is in the db.
userSchema.methods.comparePasswords = async function(candidatePassword: string): Promise<boolean>
{
    const isMatch = await argon2.verify(this.password,candidatePassword);
   
    return isMatch;
}



const User =  mongoose.model<IUser>("User", userSchema);
export default User;

