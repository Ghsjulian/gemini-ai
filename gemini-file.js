// Make sure to include these imports:
const { GoogleGenerativeAI } = require("@google/generative-ai");
const fs = require("fs");
const path = require("path");

const genAI = new GoogleGenerativeAI(process.env.API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

function fileToGenerativePart(filePath, mimeType) {
    return {
        inlineData: {
            data: Buffer.from(fs.readFileSync(filePath)).toString("base64"),
            mimeType,
        },
    };
}

const prompt = "Describe how this product might be manufactured.";
// Note: The only accepted mime types are some image types, image
const mediaPath = "path/to/your/media"; // Set your media path here
const imagePart = fileToGenerativePart(
    path.join(mediaPath, "jetpack.jpg"),
    "image/jpeg"
);

async function generateContent() {
    try {
        const result = await model.generateContent([prompt, imagePart]);
        console.log(result.response.text());
    } catch (error) {
        console.error("Error generating content:", error);
    }
}

generateContent();
