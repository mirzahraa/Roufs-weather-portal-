const express = require("express");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

const OPEN_METEO = "https://api.open-meteo.com/v1/forecast";
const GEOCODING = "https://geocoding-api.open-meteo.com/v1/search";

async function getJSON(url) {
  const r = await fetch(url);
  if (!r.ok) throw new Error(`Upstream API error: ${r.status}`);
  return r.json();
}

// Search any place in the world.
app.get("/api/geocode", async (req, res) => {
  try {
    const q = String(req.query.q || "").trim();
    if (!q) return res.status(400).json({error:"Missing q"});
    const url = new URL(GEOCODING);
    url.searchParams.set("name", q);
    url.searchParams.set("count", "8");
    url.searchParams.set("language", "en");
    url.searchParams.set("format", "json");
    const data = await getJSON(url);
    res.json(data);
  } catch (e) {
    res.status(502).json({error:e.message});
  }
});

// Weather for coordinates. Designed for current location or any selected place.
app.get("/api/weather", async (req, res) => {
  try {
    const lat = Number(req.query.latitude);
    const lon = Number(req.query.longitude);
    if (!Number.isFinite(lat) || !Number.isFinite(lon))
      return res.status(400).json({error:"Valid latitude and longitude are required"});

    const url = new URL(OPEN_METEO);
    url.searchParams.set("latitude", lat);
    url.searchParams.set("longitude", lon);
    url.searchParams.set("timezone", "auto");
    url.searchParams.set("forecast_days", "7");
    url.searchParams.set("current",
      "temperature_2m,relative_humidity_2m,apparent_temperature,precipitation,weather_code,wind_speed_10m,wind_gusts_10m");
    url.searchParams.set("hourly",
      "temperature_2m,apparent_temperature,precipitation_probability,precipitation,rain,showers,snowfall,weather_code,relative_humidity_2m,wind_speed_10m,wind_gusts_10m");
    url.searchParams.set("daily",
      "weather_code,temperature_2m_max,temperature_2m_min,precipitation_probability_max,precipitation_sum,wind_speed_10m_max,sunrise,sunset");

    const data = await getJSON(url);
    res.json(data);
  } catch (e) {
    res.status(502).json({error:e.message});
  }
});

app.get("*", (req,res) => res.sendFile(path.join(__dirname,"public","index.html")));

app.listen(PORT, () => console.log(`Er. Rouf's Weather Portal running on http://localhost:${PORT}`));
