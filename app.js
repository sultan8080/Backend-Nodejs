const express = require("express");
const bodyParser = require("body-parser");

const stuffRoutes = require("./routes/stuff"); // Ensure path is correct

const app = express();

app.use(express.json());
app.use(bodyParser.json());

// CORS headers
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


app.use('/api/stuff', stuffRoutes);

module.exports = app;
