const http = require("http");
const express = require("express");
const app = express();
const fs = require("fs");
const path = require("path");
const { Server } = require("socket.io");
const server = http.createServer(app);
const AI = require("../ai/ai");
// Required Modules

const users = {};

const getSocketID = id => {
    if (users?.id) {
        console.log("socket.js --> ", users[id]);
        return users[id].sock_id;
    }
    return;
};

const deleteFileSync = async filePath => {
    try {
        fs.unlinkSync(filePath);
        console.log(`File deleted successfully: ${filePath}`);
    } catch (err) {
        console.error(`Error deleting file: ${err}`);
    }
};

const IO = new Server(server, {
    cors: {
        origin: ["http://localhost:3000"],
        method: ["GET", "POST", "PUT", "DELETE"]
    }
});

// Create Socket Connection
IO.on("connection", async socket => {
    /*--> Create Handshake <--*/
    const user_id = socket.id;
    console.log(`\n [+] ---> ${user_id} Has Connected\n`);

    /*--> WORKING WITH CLIENT <--*/
    socket.on("send_message", async message => {
        let res = await AI(message);
        setTimeout(() => {
            try {
                const data = fs.readFileSync(
                    path.join(__dirname, "../public/files/ai.mp3")
                ); // Read file synchronously
                IO.to(user_id).emit("receive_message", {
                    content: res,
                    voice: data.toString("base64") // Convert audio data to base64
                });
               /* 
             deleteFileSync(
                path.join(__dirname, "../public/files/ai.mp3")
            );
            */
                console.log("[+] Message Sent Successfully");
            } catch (err) {
                console.error("Error reading audio file:", err);
                IO.to(user_id).emit("receive_message", {
                    content: null,
                    voice: null
                });
            }
        }, 1000);
    });

    /*--> For Disonnecting User <--*/
    socket.on("disconnect", async socket => {
        //delete users[user_id];
        console.log(`\n [-] ---> ${user_id} Has Disonnected\n`);
    });
});

// Export All
module.exports = { app, server, IO, users, getSocketID };
