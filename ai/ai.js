const AudioMaker = require("../tools/audio.maker");
const path = require("path");
const fs = require("fs");
const { GoogleGenerativeAI } = require("@google/generative-ai");
const { IO } = require("../socket/socket");
const genAI = new GoogleGenerativeAI("AIzaSyBq83mVrkXv7QbY9kVt1V0dB2A-UhyvMlI");
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

const chat = model.startChat({
    history: [
        {
            role: "user",
            parts: [{ text: "Hello" }]
        },
        {
            role: "model",
            parts: [{ text: "Great to meet you. What would you like to know?" }]
        }
    ]
});

const chatWithModel = async (command, id) => {
    try {
        let result = await chat.sendMessage(command);
        let res = result.response.text();
        await AudioMaker(res, path.join(__dirname, "../public/files/ai.mp3"));
        return res
        /*
        try {
            const data = fs.readFileSync(path.join("../public/files/ai.mp3")); // Read file synchronously
            IO.to(id).emit("receive_message", {
                content: res,
                voice: data.toString("base64") // Convert audio data to base64
            });
            console.log("[+] Message Sent Successfully");
        } catch (err) {
            console.error("Error reading audio file:", err);
            IO.to(id).emit("receive_message", {
                content: null,
                ai: null
            });
        }
        */
        /*
        fs.readFile(path.join("../public/files/ai.mp3"), (err, data) => {
            if (err) {
                console.error("Error reading audio file:", err);
                IO.to(id).emit("receive_message", {
                    content: null,
                    ai: null
                });
            } else {
                IO.to(id).emit("receive_message", {
                    content: res,
                    voice: data.toString("base64") // Convert audio data to base64
                });
                console.log("[+] Message Sent Successfully");
            }
        });
        */
    } catch (error) {
        console.error("Error during chat:", error);
    }
};

module.exports = chatWithModel;

/* 
socket.emit('send-file', {
    filename: 'example.pdf',
    file: Buffer.from('file contents', 'binary')
  });
  
  socket.on('send-file', (file) => {
  const filename = file.filename;
  const fileBuffer = file.file;
  // Save the file to disk or display it in the browser
  console.log('Received file:', filename);
});


*/
