import express from "express";

const app = express();

// ====== 環境変数 ======
<<<<<<< HEAD
=======
const API_SECRET   = process.env.API_SECRET || "sk_live_123456";      // 例: "sk_live_abc123..."
const ALLOW_ORIGIN = process.env.ALLOW_ORIGIN || "sk_live_123456";    // 例: "https://kkkkkk0405.github.io"（末尾スラなし）
>>>>>>> 81023cc230e7d8b7297d24404f132bc8b3e59041

const API_SECRET   = process.env.API_SECRET || "sk_live_abc123456";      // 例: "sk_live_abc123456"
const ALLOW_ORIGIN = process.env.ALLOW_ORIGIN || "https://kkkkkk0405.github.io";    // 例: "https://kkkkkk0405.github.io"（末尾スラなし）

// ====== CORS 固定（ALLOW_ORIGIN のみ許可） ======
app.use((req, res, next) => {
  if (ALLOW_ORIGIN) {
    res.setHeader("Access-Control-Allow-Origin", ALLOW_ORIGIN);
  }
  res.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, x-api-key");
  // 特定Origin固定の明示（キャッシュ分岐用）
  res.setHeader("Vary", "Origin");

  if (req.method === "OPTIONS") {
    return res.sendStatus(204);
  }
  next();
});

// ====== ヘルパ：APIキー検証（/seats用） ======
function requireApiKey(req, res, next) {
  const key = req.header("x-api-key") || "";
  if (!API_SECRET || key !== API_SECRET) {
    return res.status(401).json({ error: "Unauthorized" });
  }
  next();
}

// ====== 健康確認 ======
app.get("/ping", (req, res) => {
  res.json({ pong: true, time: new Date().toISOString() });
});

// ====== ダミー座席API（キー必須） ======
app.get("/seats", requireApiKey, (req, res) => {
  // クエリ例: ?from=kanazawa&to=shirakawago&todate=YYYY-MM-DD
  const { from = "kanazawa", to = "shirakawago", todate } = req.query;

  // ダミーの判定（todateの末尾でパターン変化）※お好みで固定にしてOK
  const statuses = ["available", "limited", "full"];
  let pick = 0;
  if (typeof todate === "string" && todate.length >= 10) {
    const d = Number(todate.replaceAll("-", "").slice(-2));
    pick = d % statuses.length;
  }
  const status = statuses[pick];

  const remaining = status === "limited" ? Math.max(1, (new Date().getMinutes() % 8) + 2) : null;

  res.json({
    query: { from, to, todate },
    summary: {
      status,                 // "available" | "limited" | "full"
      remaining,              // limited のときだけ数が入る（null可）
      updatedAt: new Date().toISOString(),
    },
    // 必要なら便ごとのダミー配列を追加
    items: []
  });
});

// ====== 起動 ======
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`API listening on :${PORT}`);
});
