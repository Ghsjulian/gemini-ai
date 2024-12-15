// Import required modules
const express = require("express");
const { server, app, IO } = require("./socket/socket");
const { AI, scanDir } = require("./ai/AI");
const path = require("path");
const mongoose = require("mongoose");
const dotenv = require("dotenv").config();
const cookieParser = require("cookie-parser");
const cors = require("cors");
// Declaring some variables
const PORT = process.env.SERVER_PORT || 3000;
const HOST = process.env.SERVER_HOST || "127.0.0.1";

// Set up EJS template engine
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
// Serve static files from public directory
app.use(express.static(path.join(__dirname, "public")));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({ origin: "*" }));
app.use(cookieParser());

scanDir("./datasets/")
    .then(files => {
        AI.loadDatasets(files);
    })
    .catch(error => console.error(error));
app.get("/", (req, res) => {
    res.render("index");
});

const aiRoutes = require("./routes/ai.routes");
app.use("/api/ai", aiRoutes);

// Testing  AI Here...
setTimeout(() => {
    AI.start();
    /*
    const question = "hi"; //"what is your name";
    const response = AI.getResponse(question);
    console.log("------------------------");
    console.log(`Question: ${question}`);
    console.log(`Response: ${response}`);
    console.log("------------------------");
*/
    server.listen(PORT, () => {
         console.clear();
        console.log(`\n ____________________________________________________`);
        console.log(`\n [+]  SERVER IS RUNNING - ${HOST}:${PORT}`);
        console.log(`\n [+]  WEB DEVELOPER NAME : GHS JULIAN`);
        console.log(`\n [+]  https://github.com/Ghsjulian`);
        console.log(`\n [+]  https://ghsresume.netlify.app`);
        console.log(
            ` ____________________________________________________\n\n`
        );
    });
}, 1500);
