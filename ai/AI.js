const express = require("express");
const app = express();
const dotenv = require("dotenv").config();
const fs = require("fs");
const path = require("path");
const PORT = 3000;
const HOST = "127.0.0.1";

const scanDir = async directory => {
    const txtFiles = [];
    // Read the directory
    const files = await fs.promises.readdir(directory);
    // Iterate over each file in the directory
    for (const file of files) {
        // Construct the full path to the file
        const filePath = path.join(directory, file);
        // Get the file stats
        const stats = await fs.promises.stat(filePath);
        // Check if the file is a directory
        if (stats.isDirectory()) {
            // Recursively scan the subdirectory
            txtFiles.push(...(await scanDir(filePath)));
        } else {
            // Check if the file is a .txt file
            if (path.extname(file) === ".txt") {
                // Add the file to the array
                txtFiles.push(filePath);
            }
        }
    }
    return txtFiles;
};

class GHSAI {
    constructor() {
        this.dataset = new Dataset();
        this.ai = new TrainAI(this.dataset);
    }

    // Load multiple datasets from files
    loadDatasets(files) {
        this.dataset.loadDatasets(files);
    }

    // Train the AI model
    train() {
        this.ai.train();
    }

    // Get a response for a given question
    getResponse(question) {
        return this.ai.getResponse(question);
    }

    // Start the AI system
    start() {
        console.log("Blackbox AI System Started.");
        this.train();
    }
}

// Define the Dataset class
class Dataset {
    constructor() {
        this.data = [];
    }

    // Load dataset from a file
    loadDataset(file) {
        const fs = require("fs");
        const readline = require("readline");
        const fileStream = fs.createReadStream(file);
        const rl = readline.createInterface({
            input: fileStream,
            crlfDelay: Infinity
        });

        rl.on("line", line => {
            const parts = line.split(",");
            if (parts.length === 2) {
                const question = parts[0].trim();
                const response = parts[1].trim();
                this.data.push({ question, response });
            }
        });

        rl.on("close", () => {
            // console.log(`Loaded ${this.data.length} lines from ${file}`);
            this.preprocessData();
        });
    }

    // Load multiple datasets from files
    loadDatasets(files) {
        files.forEach(file => {
            this.loadDataset(file);
        });
    }

    // Preprocess the data by tokenizing and stemming the words
    preprocessData() {
        this.data.forEach(item => {
            const tokens = this.tokenize(item.question);
            const stemmedTokens = tokens.map(token => this.stem(token));
            item.question = stemmedTokens.join(" ");
        });
    }

    // Tokenize a string into individual words
    tokenize(str) {
        return str.toLowerCase().split(/\s+/);
    }

    // Stem a word to its base form
    stem(word) {
        const suffixes = ["ing", "ed", "s", "ly", "er", "est"];
        for (const suffix of suffixes) {
            if (word.endsWith(suffix)) {
                return word.slice(0, -suffix.length);
            }
        }
        return word;
    }

    // Get a response for a given question
    getResponse(question) {
        const tokens = this.tokenize(question);
        const stemmedTokens = tokens.map(token => this.stem(token));
        question = stemmedTokens.join(" ");
        const match = this.data.find(
            item => this.similarity(item.question, question) > 0.5
        );
        if (match) {
            return match.response;
        } else {
            return "Sorry, I didn't understand your question.";
        }
    }

    // Calculate the similarity between two strings using Jaccard similarity
    similarity(str1, str2) {
        const set1 = new Set(str1.split(" "));
        const set2 = new Set(str2.split(" "));
        const intersection = new Set([...set1].filter(x => set2.has(x)));
        const union = new Set([...set1, ...set2]);
        return intersection.size / union.size;
    }
}

// Define the AI class
class TrainAI {
    constructor(dataset) {
        this.dataset = dataset;
    }

    // Train the AI model
    train() {
        console.log("Training AI model...");
    }

    // Get a response for a given question
    getResponse(question) {
        return this.dataset.getResponse(question);
    }
}

const AI = new GHSAI();
module.exports = {AI,scanDir}