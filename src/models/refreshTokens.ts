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
            required: true
        }
    },
    {timestamps: true}
);


const RefreshToken = mongoose.model<Token>("RefreshToken",tokenSchema);

export default RefreshToken;