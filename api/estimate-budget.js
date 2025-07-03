export default async function handler(req, res) {
  // 🔓 CORS headers
  res.setHeader("Access-Control-Allow-Origin", "https://enchanting-gumdrop-6882e1.netlify.app");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  // ✅ Handle preflight request
  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  // 🚀 Your existing code here
  try {
    const { destination, travelStyle, travelMode, people, days } = req.body;

    // your AI logic / dummy response
    const budget = {
      Travel: 1000 * people,
      Stay: 800 * days,
      Food: 500 * days * people,
      Misc: 300,
    };

    return res.status(200).json({ budget });
  } catch (error) {
    return res.status(500).json({ error: "Something went wrong" });
  }
}
