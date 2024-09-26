import mongoose from "mongoose";


interface Token extends mongoose.Document
{
    token: String;
}
const tokenSchema = new mongoose.Schema(
    {
        token:
        {
            type: String,
            required: true,
        },
        createdAt:
        {
            type: Date,
            default: Date.now,
            expires: "7d" // Automatically delete a document after 7 days
        }
    },
);


const RefreshToken = mongoose.model<Token>("RefreshToken",tokenSchema);

export default RefreshToken;