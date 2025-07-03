// api/estimate-budget.js

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Only POST requests are allowed" });
  }

  const { destination, travelStyle, travelMode, people, days } = req.body;

  const safePeople = Number(people) || 1;
  const safeDays = Number(days) || 1;

  const base = {
    Budget: { Travel: 1500, Stay: 800, Food: 500, Misc: 300 },
    "Mid-range": { Travel: 2500, Stay: 1500, Food: 800, Misc: 500 },
    Luxury: { Travel: 4500, Stay: 3000, Food: 1500, Misc: 800 },
  };

  const styleRates = base[travelStyle] || base["Mid-range"];

  const budget = {
    Travel: Math.round(styleRates.Travel * safePeople),
    Stay: Math.round(styleRates.Stay * safeDays * safePeople),
    Food: Math.round(styleRates.Food * safeDays * safePeople),
    Misc: Math.round(styleRates.Misc * safePeople),
  };

  return res.status(200).json({ budget });
}
