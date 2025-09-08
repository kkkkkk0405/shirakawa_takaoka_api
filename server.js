import express from "express";
const app = express();
const PORT = process.env.PORT || 3000;

app.get("/", (req,res)=>res.send("ok"));
app.get("/ping", (req,res)=>res.json({pong:true, time:new Date().toISOString()}));

app.listen(PORT, ()=>console.log("listening", PORT));
