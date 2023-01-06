const express = require("express");
const { default: mongoose } = require("mongoose");
const cors = require("cors");
const app = express();
const PORT = 5000;
const HttpError = require("./models/HttpError");
const eventsController = require("./controller/eventsController");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use("/api", eventsController);

app.use((_req, _res, _next) => {
  const error = new HttpError("Could not find this route.", 404);
  throw error;
});

app.use((error, _req, res, next) => {
  if (res.headerSent) {
    return next(error);
  }
  res.status(error.code || 500);
  res.json({ message: error.message || "An unknown error occurred!" });
});

mongoose
  .connect(
    "mongodb+srv://spenza:spenza@spenza.8kwfi5a.mongodb.net/?retryWrites=true&w=majority",
    { useNewUrlParser: true, useUnifiedTopology: true }
  )
  .then(() => {
    console.log("Connected to database!");
    app.listen(PORT, () =>
      console.log(`Example app listening on port ${PORT}!`)
    );
  })
  .catch(() => {
    console.log("Connection failed!");
  });
