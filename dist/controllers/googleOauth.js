"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authorizeUser = exports.authorizeServer = void 0;
const google_auth_library_1 = require("google-auth-library");
const http_status_codes_1 = require("http-status-codes");
const asyncWrapper_1 = __importDefault(require("../middlewares/asyncWrapper"));
const badRequest_1 = __importDefault(require("../errors/badRequest"));
const unauthenticated_1 = __importDefault(require("../errors/unauthenticated"));
exports.authorizeServer = (0, asyncWrapper_1.default)(async (req, res) => {
    res.header('Access-Control-Allow-Origin', 'http://localhost:5000');
    res.header('referrer-policy', 'no-referrer-when-downgrade');
    const redirectUrl = 'http://localhost:5000/response/oauth';
    const client = new google_auth_library_1.OAuth2Client(process.env.CLIENT_ID, process.env.CLIENT_SECRET, redirectUrl);
    const authorizationUrl = client.generateAuthUrl({
        access_type: 'offline',
        scope: ['https://www.googleapis.com/auth/userinfo.profile openid email'],
        prompt: 'consent',
    });
    res.status(http_status_codes_1.StatusCodes.OK).json({ url: authorizationUrl });
});
async function getUserData(access_token) {
    const response = await fetch(`https://www.googleapis.com/oauth2/v3/userinfo?access_token=${access_token}`);
    const data = await response.json();
    console.log(data);
}
exports.authorizeUser = (0, asyncWrapper_1.default)(async (req, res) => {
    const code = req.query.code;
    console.log(code);
    if (!code)
        throw new unauthenticated_1.default("Headers must include auth code");
    if (typeof code !== "string")
        throw new badRequest_1.default("Invalid request");
    const redirectUrl = 'http://localhost:5000/response/oauth';
    const client = new google_auth_library_1.OAuth2Client(process.env.CLIENT_ID, process.env.CLIENT_SECRET, redirectUrl);
    try {
        const googleResponse = await client.getToken(code);
        await client.setCredentials(googleResponse.tokens);
    }
    catch (error) {
        throw new unauthenticated_1.default('Invalid or expired token');
    }
    const user = client.credentials;
    if (typeof user !== 'object' || !('access_token' in user) || typeof user.access_token !== 'string') {
        throw new badRequest_1.default("Invalid request");
    }
    console.log('credentials', user);
    await getUserData(user.access_token);
    res.json({ msg: 'Success' });
});
