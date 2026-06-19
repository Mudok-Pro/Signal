import * as functions from "firebase-functions";
import fetch from "node-fetch";

export const mapsProxy = functions.https.onRequest(async (req, res) => {
  try {
    const apiKey = process.env.MAP_API_KEY;
    if (!apiKey) {
      res.status(500).json({error: "Missing API key"});
      return;
    }

    const query = req.query.q;
    if (!query) {
      res.status(400).json({error: "Missing query param"});
      return;
    }

    const url = `https://api.maptiler.com/geocoding/${query}.json?key=${apiKey}`;
    const response = await fetch(url as string);
    const data = await response.json();

    res.set("Access-Control-Allow-Origin", "*");
    res.json(data);
  } catch (err) {
    res.status(500).json({error: "Proxy failed"});
  }
});
