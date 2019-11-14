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

router.get("/", async (req, res) => {
  const city = req.query.city;
  const priceMin = req.query.priceMin;
  const priceMax = req.query.priceMax;
  const page = req.query.page;

  let filters = {}; // Filtre a donner a find()
  if (city) {
    // Ici on crée une regular expression avec l'option "i" qui signifie insensitive
    filters.city = new RegExp(city, "i");
  }
  if (priceMin) {
    filters.price = {};
    // $gte signifi qu'on va recuperer que les produits avec un "price" >= req.query.priceMin
    filters.price.$gte = priceMin;
  }
  if (priceMax) {
    // Condition pour pas RE-creer l'objet filters.price
    if (filters.price === undefined) filters.price = {};
    // $lte signifi qu'on va recuperer que les produits avec un "price" <= req.query.priceMax
    filters.price.$lte = priceMax;
  }

  try {
    const search = RoomModel.find(filters); // On lance une recheche a MongoDb avec les potentiels filtres

    if (page) {
      // Si on recoit une page on limit a 3 elements et on "skip" (3 x <page>)
      const limit = 3;
      search.limit(limit).skip(page * limit);
    }

    const rooms = await search; // Le await est deplacé ici car on veut le resultat que maintenant

    return res.json({ rooms: rooms, count: rooms.length }); // On les renvoit au client avec le nombre
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
