import express from "express";
const app = express();

const API_SECRET = process.env.API_SECRET || "dev-secret";
const ALLOW_ORIGIN = process.env.ALLOW_ORIGIN || "*";

// CORS（厳しめ）
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", ALLOW_ORIGIN);
  res.header("Vary", "Origin");
  res.header("Access-Control-Allow-Headers", "Content-Type, x-api-key");
  res.header("Access-Control-Allow-Methods", "GET, OPTIONS");
  if (req.method === "OPTIONS") return res.sendStatus(204);
  next();
});

// APIキーチェック
function requireApiKey(req, res, next) {
  const key = req.header("x-api-key");
  if (!key || key !== API_SECRET) return res.status(401).json({ error: "Unauthorized" });
  next();
}

// Health
app.get("/", (_, res) => res.type("text").send("ok"));
app.get("/ping", (_, res) => res.json({ pong: true, time: new Date().toISOString() }));

// 残席API（まずはダミー返却）
app.get("/seats", requireApiKey, (req, res) => {
  const { from = "kanazawa", to = "shirakawago", todate } = req.query;
  if (!todate) return res.status(400).json({ error: "missing 'todate' (YYYY-MM-DD)" });
  res.json({
    route: `${from}->${to}`,
    date: String(todate),
    window: "morning-14:00",
    summary: { status: "available", remaining: null }, // available/limited/full
    last_updated: new Date().toISOString(),
  });
});

// 404
app.use((_, res) => res.status(404).json({ error: "not_found" }));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`API :${PORT}`));
