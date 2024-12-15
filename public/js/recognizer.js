/*--> SELECT  DOM <--*/
const main = document.querySelector("main");
const textarea = document.querySelector(".user-msg");
const enter = document.querySelector(".enter-btn");

const playAudio = async data => {
    const audioPlayer = document.getElementById("audioPlayer");
    // Ensure data.file is a valid base64 string
    try {
        // Decode base64 string
        const byteCharacters = atob(data);
        const byteNumbers = new Array(byteCharacters.length);
        for (let i = 0; i < byteCharacters.length; i++) {
            byteNumbers[i] = byteCharacters.charCodeAt(i);
        }
        const byteArray = new Uint8Array(byteNumbers);
        const audioBlob = new Blob([byteArray], { type: "audio/mp3" });
        const audioUrl = URL.createObjectURL(audioBlob);
        audioPlayer.src = audioUrl;
        audioPlayer.play().catch(error => {
            console.error("Error playing audio:", error);
        });
    } catch (error) {
        console.error("Error processing audio data:", error);
    }
};
// Function to speak the text
function speakText(text) {
    // Check if the SpeechSynthesis API is supported
    if ("speechSynthesis" in window) {
        // Create a new SpeechSynthesisUtterance instance
        const utterance = new SpeechSynthesisUtterance(text);

        // Optionally set properties
        utterance.lang = "en-US"; // Set the language
        utterance.pitch = 1; // Set the pitch (0 to 2)
        utterance.rate = 1; // Set the rate (0.1 to 10)
        utterance.volume = 1; // Set the volume (0 to 1)

        // Speak the text
        window.speechSynthesis.speak(utterance);
    } else {
        console.error("Speech synthesis not supported in this browser.");
    }
}

// Example usage

/*--> SOCKET CLIENT <--*/
const socket = io();
socket.emit("conn", "This connection");
socket.on("receive_message", msg => {
    console.log(msg);
    const ai = document.createElement("div");
    ai.className = "ai";
    ai.textContent = msg.content;
    main.appendChild(ai);
    const audio = new Audio(`data:audio/mp3;base64,${msg.voice}`);
        audio.play();
    // playAudio(msg.voice);
    // speakText(msg.content);
    main.scrollTop = main.scrollHeight;
});
/*--> RECOGNIZATION HERE <--*/
window.SpeechRecognition =
    window.SpeechRecognition || window.webkitSpeechRecognition;
var recognition = new SpeechRecognition();
var SpeechGrammarList =
    window.SpeechGrammarList || window.webkitSpeechGrammarList;
var grammar = "#JSGF V1.0;";
var speechGrammarList = new SpeechGrammarList();
speechGrammarList.addFromString(grammar, 1);
recognition.grammars = speechGrammarList;
recognition.interimResults = true;
recognition.lang = "en-US"; // Set the desired language

recognition.onresult = event => {
    let current = event.resultIndex;
    var result = event.results[current][0].transcript;
    var voice = result.toLowerCase();
    if (event.results[current].isFinal) {
        console.log(voice);
        socket.emit("send_message", voice.toLowerCase());
        const me = document.createElement("div");
        me.className = "me";
        me.textContent = voice;
        main.appendChild(me);
    }
};

// Event listener for when recognition ends
recognition.addEventListener("end", () => {
    // Restart recognition if the speaker is off
    recognition.start();
});

// Start recognition when the window loads
recognition.addEventListener("end", () => {
    recognition.start(e => {
        console.log(e);
    });
});

window.onload = () => {
    recognition.start(e => {
        console.log(e);
    });
};

/*--> ENTER AND SEND MESSAGE <--*/
enter.onclick = () => {
    var user_msg = textarea.value.trim();
    if (user_msg) {
        socket.emit("send_message", user_msg.toLowerCase());
        const me = document.createElement("div");
        me.className = "me";
        me.textContent = user_msg;
        main.appendChild(me);
        textarea.value = "";
    }
};

/*--> ERUDA CONSOLE <--*/

var script = document.createElement("script");
script.src = "http://localhost:8010/eruda.js";
document.body.appendChild(script);
script.onload = function () {
    eruda.init();
};
