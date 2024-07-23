"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const mongo_1 = __importDefault(require("./db/mongo"));
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.get("/", (req, res) => {
    res.send("Steam Scraper");
});
const PORT = process.env.PORT || 5000;
const start = async () => {
    try {
        if (process.env.MONGO_URI)
            await (0, mongo_1.default)(process.env.MONGO_URI);
        app.listen(PORT, () => console.log(`Server running on port ${PORT}...`));
    }
    catch (error) {
        console.error(error);
    }
};
start();
