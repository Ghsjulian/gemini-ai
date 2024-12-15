const gtts = require("gtts");
const path = require("path")
const fs = require("fs")




const createFileSync = async(filePath) =>{
  try {
    fs.writeFileSync(filePath, "");
    console.log(`File created successfully: ${filePath}`);
  } catch (err) {
    console.error(`Error creating file: ${err}`);
  }
}

// Function to delete a file synchronouslyconst
const deleteFileSync = async (filePath) =>{
  try {
    fs.unlinkSync(filePath);
    console.log(`File deleted successfully: ${filePath}`);
  } catch (err) {
    console.error(`Error deleting file: ${err}`);
  }
}



const audioMaker = async (text, outputFilePath)=>{
    // Create a new gtts instance
    const speech = new gtts(text, "en");
    //await createFileSync(outputFilePath)
    // 'en' for English
    // Save the speech to an MP3 file
    speech.save(outputFilePath, (err, result) =>{
        if (err) {
            console.error("Error saving the audio file:", err);
            return "Error -> "+err.mesaage
        } else {
            return true
        }
    });
}

/*
// Example usage
textToSpeechMP3(
    "Hello, this is a simple text-to-speech conversion.",
    "output1.mp3"
);
*/ 

module.exports = audioMaker