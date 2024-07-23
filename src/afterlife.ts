import express from "express";
import connectDB from "./db/mongo"
import dotenv from "dotenv";

// Security
import cors from "cors";
import helmet from "helmet";
import mongoSanitize from "express-mongo-sanitize";
import hpp from "hpp";
import rateLimiter from "express-rate-limit";

// errors
import notFound from "./middlewares/notFound";
import errorHandlerMiddleware from "./middlewares/errorHandler";

// dev 
import morgan from "morgan";

dotenv.config();
const app = express();

app.use(morgan("dev"));
app.use(express.json());


// Security packages
app.use(cors());
app.use(helmet());
app.use(mongoSanitize());
app.use(hpp());

app.set("trust proxy", 1);

app.use(
  rateLimiter(
    {
        windowMs: 15 * 60 * 1000, // 15 minutes
        max: 100, // limit each IP to 100 requests per windowMs
    })
);


app.get("/", (req,res) =>
{
    res.send("Steam Scraper");
});


// errors
app.use(errorHandlerMiddleware);
app.use(notFound);



const PORT = process.env.PORT || 5000; 

const start = async () : Promise<void> =>
{

    try
    {
        if(process.env.MONGO_URI)
        await connectDB(process.env.MONGO_URI);
    
        app.listen(PORT, () => console.log(`Server running on port ${PORT}...`))
        
    }
    catch (error)
    {
        console.error(error);    
    }

}

start();