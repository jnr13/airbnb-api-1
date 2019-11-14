require("dotenv").config(); // Ajoute ce qu'il y a dans le fichier .env dans l'env global
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

const app = express();
app.use(bodyParser.json());

mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

app.listen(process.env.PORT, function() {
  console.log("Server started");
});
