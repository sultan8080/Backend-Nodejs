const express = require("express");

const { PrismaClient } = require('./generated/prisma');


const app = express();
const prisma = new PrismaClient();

app.use(express.json());

// 👇 Your original custom CORS headers — unchanged
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content, Accept, Content-Type, Authorization"
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, PATCH, OPTIONS"
  );
  next();
});

// ✅ POST /api/stuff → create a new Thing
app.post("/api/stuff", async (req, res) => {
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

// ✅ GET /api/stuff → fetch all Things
app.get("/api/stuff", async (req, res) => {
  try {
    const stuff = await prisma.thing.findMany();
    res.status(200).json(stuff);
  } catch (error) {
    res.status(500).json({ error: "Erreur lors de la récupération", details: error });
  }
});

// Optional: Close Prisma connection gracefully
process.on("SIGINT", async () => {
  await prisma.$disconnect();
  process.exit(0);
});

module.exports = app;
