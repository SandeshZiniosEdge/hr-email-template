const express = require("express");
const NotificationScenarioRoutes = require("./routes/NotificationScenarios");
const TemplateVariableRoutes = require("./routes/TemplateVariables");
const cors = require("cors");
const { sequelize } = require("./models");

const app = express();

// ✅ Move CORS BEFORE express.json()
app.use(
  cors({
    origin: "*", // Add your frontend URLs
  })
);

app.use(express.json()); // ✅ This should come AFTER CORS
app.get("/", (req, res) => {
  res.json({ message: "Server is running!" });
});

app.use("/scenarios", NotificationScenarioRoutes);
app.use("/variables", TemplateVariableRoutes);

const PORT = 5050;
app.listen(PORT, async () => {
  try {
    await sequelize.authenticate();
    console.log("✅ Connected to Neon PostgreSQL");
    console.log(`🚀 Server running at http://localhost:${PORT}`);
  } catch (error) {
    console.error("❌ Unable to connect to the database:", error);
  }
});
