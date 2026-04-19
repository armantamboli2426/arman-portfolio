const express = require("express");
const helmet = require("helmet");
const compression = require("compression");
const fs = require("node:fs/promises");
const path = require("node:path");

const app = express();
const PORT = process.env.PORT || 3000;
const dataPath = path.join(__dirname, "data", "messages.json");

const profile = {
  name: "Arman",
  role: "Video Editor",
  tagline: "I create modern, high-retention edits with energetic transitions.",
  intro:
    "I am a video editor with 1 year of experience using Adobe Premiere Pro and After Effects. I recently completed my Diploma in Computer Technology and I love turning raw clips into polished, engaging content.",
  experienceYears: 1,
  tools: ["Adobe Premiere Pro", "Adobe After Effects"],
  education: "Diploma in Computer Technology (Completed)",
};

const projects = [
  {
    id: "reels",
    title: "Social Reels Editing",
    category: "Short-form Content",
    summary:
      "Fast-paced reel edits with hook-first structure, beat sync, punch cuts, and smooth transitions.",
    stack: ["Premiere Pro", "After Effects"],
  },
  {
    id: "motion",
    title: "Motion Text & Graphics",
    category: "Motion Design",
    summary:
      "Animated titles, shape transitions, and modern motion graphics that elevate brand videos.",
    stack: ["After Effects", "Premiere Pro"],
  },
  {
    id: "promo",
    title: "Promo & Intro Videos",
    category: "Brand Promotion",
    summary:
      "Cinematic promo edits with clean pacing, color polish, and engaging visual effects.",
    stack: ["Premiere Pro", "After Effects"],
  },
];

app.use(helmet({ contentSecurityPolicy: false }));
app.use(compression());
app.use(express.json({ limit: "1mb" }));
app.use(express.static(path.join(__dirname, "public")));

app.get("/api/health", (_req, res) => {
  res.json({ status: "ok", date: new Date().toISOString() });
});

app.get("/api/profile", (_req, res) => {
  res.json(profile);
});

app.get("/api/projects", (_req, res) => {
  res.json(projects);
});

app.get("/api/messages", async (_req, res) => {
  try {
    const existingRaw = await fs.readFile(dataPath, "utf8");
    const existing = JSON.parse(existingRaw);
    return res.json(Array.isArray(existing) ? existing : []);
  } catch (error) {
    console.error("Failed to read messages", error);
    return res.status(500).json({ error: "Unable to read messages right now." });
  }
});

app.post("/api/contact", async (req, res) => {
  const { name, email, projectType, message } = req.body || {};

  if (!name || !email || !message) {
    return res.status(400).json({ error: "Name, email, and message are required." });
  }

  const cleanEmail = String(email).trim();
  const emailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanEmail);

  if (!emailValid) {
    return res.status(400).json({ error: "Please enter a valid email address." });
  }

  const submission = {
    id: `msg_${Date.now()}`,
    name: String(name).trim(),
    email: cleanEmail,
    projectType: String(projectType || "General").trim(),
    message: String(message).trim(),
    createdAt: new Date().toISOString(),
  };

  try {
    const existingRaw = await fs.readFile(dataPath, "utf8");
    const existing = JSON.parse(existingRaw);
    const next = Array.isArray(existing) ? existing : [];
    next.push(submission);
    await fs.writeFile(dataPath, JSON.stringify(next, null, 2));

    return res.status(201).json({
      success: true,
      message: "Message received. Arman will contact you soon.",
    });
  } catch (error) {
    console.error("Failed to persist contact submission", error);
    return res.status(500).json({ error: "Unable to save your message right now." });
  }
});

app.get("*", (_req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
