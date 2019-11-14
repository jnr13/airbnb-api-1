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

router.post("/log_in", async (req, res) => {
  const password = req.body.password;
  const email = req.body.email;

  try {
    const user = await UserModel.findOne({ email: email });

    const hash = SHA256(password + user.salt).toString(encBase64); // On melange le password et le salt et on les encrypt
    if (user.hash === hash) {
      user.token = uid2(16); // On genere une chaine de caractere de taille 16
      await user.save();
      return res.json(_.pick(user, ["_id", "token", "account"])); // On renvoit une selection de key au client
    }
  } catch (err) {
    return res.status(400).json({ error: err.message }); // Si il y a une erreur, on la renvoit
  }
});

router.get("/:id", async (req, res) => {
  const userId = req.params.id;
  const token = req.headers.authorization;
  if (!token) {
    return res.status(401).json({
      error: {
        message: "No token"
      }
    });
  }

  try {
    const userSrc = await UserModel.findOne({ token: token.split(" ")[1] }); // Split pour enlever le "Bearer "
    if (userSrc) {
      const user = await UserModel.findById(userId);
      return res.json(_.pick(user, ["_id", "account"])); // On renvoit une selection de key au client
    }
    return res.status(401).json({
      error: {
        message: "Invalid token"
      }
    });
  } catch (err) {}
});

module.exports = router;
