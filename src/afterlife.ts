import express from "express";

const app = express();

app.use(express.json());



app.get("/", (req,res) =>
{
    res.send("Steam Scraper");
})






const PORT = process.env.PORT || 5000; 

const start = async () : Promise<void> =>
{
    app.listen(PORT, () =>
    {
        console.log(`Server running on port ${PORT}...`);
    })

}

start();