const express = require("express");
const router = express.Router();
const axios = require("axios");
const auth = require("../middleware/auth");
const Commute = require("../models/Commute");

router.post("/route", auth, async (req, res) => {
  const { start, destination } = req.body;
  try {
    const response = await axios.get(
      "https://maps.googleapis.com/maps/api/directions/json",
      {
        params: {
          origin: start,
          destination: destination,
          key: process.env.GOOGLE_MAPS_API_KEY,
          departure_time: "now",
          traffic_model: "best_guess",
        },
      }
    );

    if (response.data.status !== "OK") {
      return res.status(400).json({
        error: response.data.error_message || "Error fetching route data",
      });
    }

    const leg = response.data.routes[0].legs[0];
    const distance = leg.distance.value;
    const duration = leg.duration.value;
    const durationInTraffic = leg.duration_in_traffic
      ? leg.duration_in_traffic.value
      : duration;

    const baseFare = 3;
    const costPerKm = 2;
    const fare = baseFare + costPerKm * (distance / 1000);

    const commute = new Commute({
      user: req.user.id,
      start,
      destination,
      distance,
      duration: durationInTraffic,
      routeData: response.data.routes[0],
    });

    await commute.save();

    res.json({
      route: response.data.routes[0],
      commuteId: commute._id,
      distance,
      duration: durationInTraffic,
      fare: fare.toFixed(2),
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

router.get("/history", auth, async (req, res) => {
  try {
    const history = await Commute.find({ user: req.user.id }).sort({
      createdAt: -1,
    });
    res.json(history);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get("/dashboard", auth, async (req, res) => {
  try {
    const commutes = await Commute.find({ user: req.user.id });
    if (!commutes.length) {
      return res.json({ totalCommutes: 0, totalDistance: 0, avgDuration: 0 });
    }

    const totalDistance = commutes.reduce(
      (acc, commute) => acc + commute.distance,
      0
    );
    const totalDuration = commutes.reduce(
      (acc, commute) => acc + commute.duration,
      0
    );
    const avgDuration = totalDuration / commutes.length;

    res.json({
      totalCommutes: commutes.length,
      totalDistance,
      avgDuration,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
