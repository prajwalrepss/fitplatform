const express = require("express");
const cors = require("cors");                // ← ADD THIS
const { connectDB } = require("./config/database");

const app = express();

app.use(cors({                              // ← ADD THIS BLOCK
  origin: "http://localhost:5173",
  credentials: true
}));

app.use(express.json());

const musclesRoutes = require("./routes/muscles");
const exercisesRoutes = require("./routes/exercises");
const workoutRoutes = require("./routes/workout");
const splitsRoutes = require("./routes/splits");
const authRoutes = require("./routes/auth");
const caloriesRoutes = require("./routes/calories");
const analyticsRoutes = require("./routes/analytics");
const buddyRoutes = require("./routes/buddy");
const setsRoutes = require("./routes/sets");

app.get("/health", (req, res) => {
  res.json({ status: "ok" });
});

app.use("/auth", authRoutes);
app.use("/muscles", musclesRoutes);
app.use("/exercises", exercisesRoutes);
app.use("/workout", workoutRoutes);
app.use("/splits", splitsRoutes);
app.use("/calories", caloriesRoutes);
app.use("/analytics", analyticsRoutes);
app.use("/buddy", buddyRoutes);
app.use("/sets", setsRoutes);

async function startServer() {
  await connectDB();

  app.listen(5000, () => {
    console.log("Server running on port 5000");
  });
}

startServer();