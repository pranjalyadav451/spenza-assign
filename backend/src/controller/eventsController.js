const express = require("express");
const Event = require("../models/Event");
const HttpError = require("../models/HttpError");

const router = express.Router();

router.get("/list", async (req, res) => {
  try {
    const events = await Event.find({});
    res.json({
      allEvents: events.map((event) => event.toObject({ getters: true })),
    });
  } catch (err) {
    return next(err);
  }
});

router.post("/save", async (req, res, next) => {
  const { eventName } = req.body;

  const event = new Event({
    name: eventName,
    timeStamp: Date.now(),
  });
  try {
    await event.save();
    res.json({ message: "Event saved!" });
  } catch (err) {
    return new HttpError("Could not save event.", 500);
  }
});

module.exports = router;
