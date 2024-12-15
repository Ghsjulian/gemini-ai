// Make sure to include these imports:
const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI("AIzaSyBq83mVrkXv7QbY9kVt1V0dB2A-UhyvMlI");
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

const chat = model.startChat({
    history: [
        {
            role: "user",
            parts: [{ text: "Hello" }],
        },
        {
            role: "model",
            parts: [{ text: "Great to meet you. What would you like to know?" }],
        },
    ],
});

async function chatWithModel() {
    try {
        let result = await chat.sendMessage("I have 2 dogs in my house.");
        console.log(result.response.text());

        result = await chat.sendMessage("How many paws are in my house?");
        console.log(result.response.text());
    } catch (error) {
        console.error("Error during chat:", error);
    }
}

chatWithModel();
