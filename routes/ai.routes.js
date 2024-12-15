const express = require("express");
const path = require("path");
const router = express.Router();

const AIController = require("../controllers/ai.controllers");

router.get("/chat", AIController.chatMessage);

module.exports = router;
