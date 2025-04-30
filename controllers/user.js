const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const router = express.Router();

// Inscription d'un nouvel utilisateur
exports.signup = async (req, res, next) => {
  const { email, password} = req.body; // On récupère les informations de l'utilisateur depuis le corps de la requête

  try {
    // Vérifier si l'utilisateur existe déjà
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ error: "Email déjà utilisé" });
    }

    // Hasher le mot de passe avant de l'enregistrer
    const hashedPassword = await bcrypt.hash(password, 10);

    // Créer un nouvel utilisateur
    const newUser = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name, // Assurez-vous que le nom est envoyé dans le corps de la requête
      },
    });

    // Répondre avec un message de succès
    res.status(201).json({ message: "Utilisateur enregistré avec succès !", user: newUser });
  } catch (error) {
    // Gérer les erreurs
    res.status(500).json({ error: "Erreur lors de la création de l'utilisateur", details: error.message });
  }
};