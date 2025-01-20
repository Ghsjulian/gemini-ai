const { AI } = require("../ai/AI");

class AIController {
    async chatMessage(req, res) {
        const question = "hi"; //"what is your name";
        const response = AI.getResponse(question);
        console.log("------------------------");
        console.log(`Question: ${question}`);
        console.log(`Response: ${response}`);
        console.log("------------------------");

        return res.json({
            message: "This Is Message"
        });
    }
}

module.exports = new AIController();
