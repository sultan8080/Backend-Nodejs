const express = require('express');
const router = express.Router();

const { PrismaClient } = require('../generated/prisma');
const prisma = new PrismaClient();

// POST /api/stuff → create a new Thing
router.post("/", async (req, res) => {
  try {
    const { title, description, imageUrl, price, userId } = req.body;

    const newThing = await prisma.thing.create({
      data: { title, description, imageUrl, price, userId },
    });

    res.status(201).json({
      message: "Objet créé !",
      thing: newThing,
    });
  } catch (error) {
    res.status(500).json({ error: "Erreur lors de la création", details: error });
  }
});

// GET /api/stuff → fetch all Things
router.get("/", async (req, res) => {
  try {
    const stuff = await prisma.thing.findMany();
    res.status(200).json(stuff);
  } catch (error) {
    res.status(500).json({ error: "Erreur lors de la récupération", details: error });
  }
});

// GET /api/stuff → fetch by id

router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params; 
    const staff = await prisma.thing.findUnique({
      where: {
        id: parseInt(id),
      },
    });
  res.status(200).json(staff);
  } catch (error) {
    res.status(500).json({ error: "Erreur lors de la récupération", details: error });
  }
});

router.put("/:id", async (req, res) => {
  try {
    const { id } = req.params; 
    const { title, description, imageUrl, price, userId } = req.body;

    const updateThings = await prisma.thing.update({
      where: { id: parseInt(id) },
      data: { title, description, imageUrl, price, userId },
    });

    res.status(200).json({
      message: "Things mis à jour avec succès !",
      thing: updateThings,
    });
  } catch (error) {
    res.status(500).json({ 
      error: "Erreur lors de la mise à jour du produit", 
      details: error.message 
    });
  }
});


router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const deletedThing = await prisma.thing.delete({
      where: { id: parseInt(id) },
    });
    res.status(200).json({
      message: "thing supprimé avec succès !",
      thing: deletedThing
    });
  } catch (error) {
    res.status(500).json({ 
      error: "Erreur lors de la suppression du produit", 
      details: error.message 
    });
  }
});


// Optional: Close Prisma connection gracefully
process.on("SIGINT", async () => {
  await prisma.$disconnect();
  process.exit(0);
});

module.exports = router;