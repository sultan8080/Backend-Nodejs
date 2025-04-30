const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { PrismaClient } = require("../generated/prisma");
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
    },
    });

    // Répondre avec un message de succès
    res.status(201).json({ message: "Utilisateur enregistré avec succès !", user: newUser });
  } catch (error) {
    // Gérer les erreurs
    res.status(500).json({ error: "Erreur lors de la création de l'utilisateur", details: error.message });
  }
};

// Connexion de l'utilisateur (Login)
exports.login = async (req, res, next) => {
    const { email, password } = req.body;
  
    try {
      // Vérifier si l'utilisateur existe
      const user = await prisma.user.findUnique({ where: { email } });
      if (!user) {
        return res.status(400).json({ error: "Utilisateur non trouvé" });
      }
  
      // Comparer le mot de passe
      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        return res.status(400).json({ error: "Mot de passe incorrect" });
      }
  
      // Générer un token JWT
      const token = jwt.sign({ userId: user.id, email: user.email }, process.env.JWT_SECRET, { expiresIn: "1h" });
  
      // Répondre avec le token
      res.status(200).json({
        message: "Connexion réussie !",
        token,
      });
    } catch (error) {
      // Gérer les erreurs
      res.status(500).json({ error: "Erreur lors de la connexion", details: error.message });
    }
  };