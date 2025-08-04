const express = require("express");
const NotificationScenarioRoutes = require("./routes/NotificationScenarios");
const TemplateVariableRoutes = require("./routes/NotificationScenarios");

const { sequelize } = require("./models");

const app = express();
app.use(express.json());

app.use("/scenarios", NotificationScenarioRoutes);
app.use("/variables", TemplateVariableRoutes);

const PORT = 5000;
app.listen(PORT, async () => {
  try {
    await sequelize.authenticate();
    console.log("✅ Connected to Neon PostgreSQL");
    console.log(`🚀 Server running at http://localhost:${PORT}`);
  } catch (error) {
    console.error("❌ Unable to connect to the database:", error);
  }
});
