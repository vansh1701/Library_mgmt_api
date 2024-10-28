const express = require("express");
const mongoose = require("mongoose");
const app = express();
const port = 801;
const booksrouter = require("./routes/books");
const authorsrouter = require("./routes/authors");

app.use(express.json());

const uri = "mongodb+srv://vanshmittal1701:tjrEKSyuSi58yaaX@cluster0.iha99.mongodb.net/";

app.use("/api/books", booksrouter);
app.use("/api/authors", authorsrouter);

app.listen(port,async ()=>{
    if (await mongoose.connect(uri)){
        console.log(`connected to database`);
    }else{
        console.log(`databse not connected`);
    }

    console.log(   `server is running at ${port}`);
})