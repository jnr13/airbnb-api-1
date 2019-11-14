const express = require("express");
const SHA256 = require("crypto-js/sha256");
const encBase64 = require("crypto-js/enc-base64");
const uid2 = require("uid2");
const _ = require("lodash");

const router = express.Router();
const UserModel = require("../models/User"); // Require en dernier car il est fait par nous, et on a moins confiance en nous qu'aux autres

router.post("/sign_up", async (req, res) => {
  const password = req.body.password;
  const username = req.body.username;
  const biography = req.body.biography;
  const email = req.body.email;

  const token = uid2(16); // On genere une chaine de caractere de taille 16
  const salt = uid2(16); // On genere une chaine de caractere de taille 16

  const hash = SHA256(password + salt).toString(encBase64); // On melange le password et le salt et on les encrypt

  try {
    const user = new UserModel({
      account: {
        username: username,
        biography: biography
      },
      email: email,
      token: token,
      hash: hash,
      salt: salt
    });

    await user.save(); // On sauvegarde le model prealablement créé
    return res.json(_.pick(user, ["_id", "token", "account"])); // On renvoit une selection de key au client
  } catch (err) {
    return res.status(400).json({ error: err.message }); // Si il y a une erreur, on la renvoit
  }
});

module.exports = router;
