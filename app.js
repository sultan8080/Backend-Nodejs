const express = require('express');
const app = express();
app.use((req, res, next)=>{
    console.log('Requête recue');
    next();
})
app.use((req, res, next)=>{
    res.status(201);
    next();
})
app.use((req, res, next) => {
    res.json({message: "Votre requête a bien été reçu"});
    next();
})
app.use((req, res) => {
    console.log("Réponse envoyée avec succcès");
})

module.exports = app;
