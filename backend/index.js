const express = require("express");
const cors = require("cors");
const { connectDB } = require("./config/database");
const errorHandler = require("./middleware/errorHandler");

const app = express();

// ---------------------------------------------------------------------------
// Middleware
// ---------------------------------------------------------------------------
app.use(cors({
  origin: process.env.CORS_ORIGIN || "*",   // allow mobile + web
  credentials: true,
}));

app.use(express.json());

// ---------------------------------------------------------------------------
// Routes
// ---------------------------------------------------------------------------
const authRoutes       = require("./routes/auth");
const musclesRoutes    = require("./routes/muscles");
const muscleRoutes     = require("./routes/muscle");   // NEW — muscle activation data
const exercisesRoutes  = require("./routes/exercises");
const workoutRoutes    = require("./routes/workout");
const splitsRoutes     = require("./routes/splits");
const caloriesRoutes   = require("./routes/calories");
const analyticsRoutes  = require("./routes/analytics");
const buddyRoutes      = require("./routes/buddy");
const setsRoutes       = require("./routes/sets");
const sessionsRoutes   = require("./routes/sessions");
const nutritionRoutes  = require("./routes/nutrition");
const hydrationRoutes  = require("./routes/hydration");
const dashboardRoutes  = require("./routes/dashboard");

// Health check
app.get("/health", (req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

// Existing routes — preserve frontend API contract (no /api prefix)
app.use("/auth",       authRoutes);
app.use("/muscles",    musclesRoutes);
app.use("/exercises",  exercisesRoutes);
app.use("/workout",    workoutRoutes);
app.use("/splits",     splitsRoutes);
app.use("/calories",   caloriesRoutes);
app.use("/analytics",  analyticsRoutes);
app.use("/buddy",      buddyRoutes);
app.use("/sets",       setsRoutes);
app.use("/sessions",   sessionsRoutes);
app.use("/nutrition",  nutritionRoutes);
app.use("/hydration",  hydrationRoutes);
app.use("/dashboard",  dashboardRoutes);

// NEW — muscle activation heatmap data
app.use("/muscle",     muscleRoutes);

// Also mount under /api prefix for mobile clients
app.use("/api/auth",       authRoutes);
app.use("/api/muscles",    musclesRoutes);
app.use("/api/muscle",     muscleRoutes);
app.use("/api/exercises",  exercisesRoutes);
app.use("/api/workouts",   workoutRoutes);
app.use("/api/sessions",   sessionsRoutes);
app.use("/api/nutrition",  nutritionRoutes);
app.use("/api/hydration",  hydrationRoutes);
app.use("/api/dashboard",  dashboardRoutes);

// ---------------------------------------------------------------------------
// Central Error Handler (must be AFTER routes)
// ---------------------------------------------------------------------------
app.use(errorHandler);

// ---------------------------------------------------------------------------
// Start Server
// ---------------------------------------------------------------------------
async function startServer() {
  await connectDB();

  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => {
    console.log(`✓ Server running on port ${PORT}`);
    console.log(`  Health: http://localhost:${PORT}/health`);
  });
}

startServer();