import express from "express";
import axios from "axios";
import dotenv from "dotenv";

dotenv.config();
const router = express.Router();

// GET /api/weather - Get current weather for Alibag
router.get("/", async (req, res) => {
  try {
    const apiKey = process.env.OPENWEATHER_API_KEY;
    const lat = process.env.ALIBAG_LAT;
    const lon = process.env.ALIBAG_LON;

    console.log("Fetching weather with key:", apiKey ? "Key exists" : "No key");

    const response = await axios.get(
      `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`
    );

    const weatherData = {
      temperature: Math.round(response.data.main.temp),
      feels_like: Math.round(response.data.main.feels_like),
      condition: response.data.weather[0].main,
      description: response.data.weather[0].description,
      humidity: response.data.main.humidity,
      windSpeed: response.data.wind.speed,
      icon: response.data.weather[0].icon,
      location: "Alibag, India",
    };

    // Add recommendation
    const recommendation = getVisitRecommendation(weatherData);
    weatherData.recommendation = recommendation;

    res.json(weatherData);
  } catch (error) {
    console.error("Weather API error:", error.response?.data || error.message);

    if (error.response?.status === 401) {
      return res.status(500).json({ error: "Invalid API key" });
    }
    if (error.response?.status === 429) {
      return res.status(500).json({ error: "API limit exceeded" });
    }

    res.status(500).json({ error: "Failed to fetch weather data" });
  }
});

function getVisitRecommendation(weather) {
  const { temperature, condition, windSpeed } = weather;

  if (temperature >= 25 && temperature <= 35) {
    if (condition === "Clear" || condition === "Clouds") {
      if (windSpeed < 20) {
        return {
          status: "PERFECT",
          message: "Great time to visit Alibag! Ideal beach weather.",
          emoji: "🏖️",
          color: "green",
        };
      }
      return {
        status: "GOOD",
        message: "Good weather for sightseeing. A bit windy for beaches.",
        emoji: "👍",
        color: "blue",
      };
    }
  }

  if (condition === "Rain" || condition === "Thunderstorm") {
    return {
      status: "POOR",
      message: "Not ideal for outdoor activities. Consider indoor attractions.",
      emoji: "🌧️",
      color: "red",
    };
  }

  if (temperature < 20) {
    return {
      status: "COLD",
      message: "Quite cool for beaches. Good for fort visits and exploring.",
      emoji: "🧥",
      color: "yellow",
    };
  }

  return {
    status: "MODERATE",
    message: "Decent weather. Check specific activities for recommendations.",
    emoji: "⛅",
    color: "yellow",
  };
}

export default router;
