"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendVerificationEmail = sendVerificationEmail;
exports.sendContactEmail = sendContactEmail;
exports.sendPasswordResetEmail = sendPasswordResetEmail;
const nodemailer_1 = __importDefault(require("nodemailer"));
async function sendVerificationEmail(email, text) {
    const emailContent = `
    <!DOCTYPE html>
    <html>
    <head>
        <style>
        body {
            font-family: Arial, sans-serif;
            margin: 0;
            padding: 0;
            background-color: #f4f4f4;
        }
        .container {
            width: 80%;
            margin: auto;
            overflow: hidden;
            text-align: center;
        }
        .button {
            background-color: lightblue;
            border: none;
            color: white;
            padding: 15px 32px;
            text-align: center;
            text-decoration: none;
            display: inline-block;
            font-size: 16px;
            margin: 4px 2px;
            cursor: pointer;
        }
        </style>
    </head>
    <body>
        <div class="container">
            <h2>Welcome to SteamScraper</h2>
            <p>Thank you for signing up. Please confirm your email address to activate your account.</p>
            <a href="http://localhost:5000/auth/verify?token=${encodeURIComponent(text)}" class="button">Confirm Email</a>
            <p>This link will expire in 1 hour.</p>
        </div>
    </body>
    </html>
    `;
    const transporter = nodemailer_1.default.createTransport({
        host: 'smtp.gmail.com',
        port: 465,
        secure: true,
        auth: {
            user: process.env.USER,
            pass: process.env.PASSWORD
        }
    });
    const emailOptions = {
        from: ' Effigy <effypowered@gmail.com>',
        to: email,
        subject: 'Email Verification',
        html: emailContent
    };
    try {
        const info = await transporter.sendMail(emailOptions);
    }
    catch (error) {
        console.log(`error sending email ${error}`);
    }
}
async function sendContactEmail(name, email, text) {
    const emailContent = `
    <!DOCTYPE html>
    <html>
    <head>
    </head> 
        <body>
            <div>
                <h1>User feedback</h1>
                <p>name: ${name}</p>
                <p>email: ${email}</p>
                <p>text: ${text}</p>
            </div>
        </body>

    </html>
    `;
    const transporter = nodemailer_1.default.createTransport({
        host: 'smtp.gmail.com',
        port: 465,
        secure: true,
        auth: {
            user: process.env.USER,
            pass: process.env.PASSWORD
        }
    });
    const emailOptions = {
        from: 'Effigy',
        to: process.env.USER,
        subject: 'User feedback',
        html: emailContent
    };
    try {
        const info = await transporter.sendMail(emailOptions);
    }
    catch (error) {
        console.log(`error sending email ${error}`);
    }
}
async function sendPasswordResetEmail(email, text) {
    const emailContent = `
    <!DOCTYPE html>
    <html>
    <head>
        <style>
            body {
                font-family: Arial, sans-serif;
                margin: 0;
                padding: 0;
                background-color: #f4f4f4;
            }
            .container {
                width: 80%;
                margin: auto;
                overflow: hidden;
                text-align: center;
            }
            .button {
                background-color: lightblue;
                border: none;
                color: white;
                padding: 15px 32px;
                text-align: center;
                text-decoration: none;
                display: inline-block;
                font-size: 16px;
                margin: 4px 2px;
                cursor: pointer;
            }
    </style> 
    </head>
    <body>
        <div class="container">
            <h2>Reset Password</h2>
            <p>Click the link below to reset your password.</p>
            <a href="http://localhost:5000/auth/resetEmail?token=${encodeURIComponent(text)}" class="button">Reset Password</a>
            <p>This link will expire in 1 hour.</p>
        </div>
    </body>
    </html>
    `;
    const transporter = nodemailer_1.default.createTransport({
        host: 'smtp.gmail.com',
        port: 465,
        secure: true,
        auth: {
            user: process.env.USER,
            pass: process.env.PASSWORD
        }
    });
    const emailOptions = {
        from: 'Effigy',
        to: email,
        subject: 'Password Reset',
        html: emailContent
    };
    try {
        const info = await transporter.sendMail(emailOptions);
    }
    catch (error) {
        console.log(`error sending email ${error}`);
    }
}
