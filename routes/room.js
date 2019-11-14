const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();

const RoomModel = require("../models/Room");

router.post("/publish", async (req, res) => {
  try {
    const room = new RoomModel(req.body); // req.body il y a deja toute les variables dont on a besoin
    await room.save(); // On sauvegarde le model prealablement créé
    return res.json(room); // On le renvoit au client
  } catch (err) {
    return res.status(400).json({ error: err.message }); // Si il y a une erreur, on la renvoit
  }
});

router.get("/:id", async (req, res) => {
  const roomId = req.params.id;

  try {
    const room = await RoomModel.findById(roomId); // On recupere la Room par son id
    return res.json(room); // On la renvoit au client
  } catch (err) {
    return res.status(400).json({ error: err.message }); // Si il y a une erreur, on la renvoit
  }
});

module.exports = router;
