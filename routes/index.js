const express = require("express");
const router = express.Router();

// On ajoute un prefix aux routes qu'on recupere via le require
router.use("/api/room", require("./room"));

module.exports = router;
