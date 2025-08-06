const express = require("express");
const NotificationScenarioRoutes = require("./routes/NotificationScenarios");
const TemplateVariableRoutes = require("./routes/TemplateVariables");
const UsersRoutes = require("./routes/Users"); // ✅ Add this line
const cors = require("cors");
const { sequelize } = require("./models");
require("dotenv").config(); // ✅ Add this for environment variables

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

// Health check endpoint for Microsoft Graph
app.get("/health/graph", async (req, res) => {
  try {
    const graphService = require("./services/graphService");
    await graphService.getAccessToken();
    res.json({
      success: true,
      message: "Microsoft Graph API connection is healthy",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Microsoft Graph API connection failed",
      error: error.message,
    });
  }
});

app.use("/scenarios", NotificationScenarioRoutes);
app.use("/variables", TemplateVariableRoutes);
app.use("/users", UsersRoutes); // ✅ Add this line

// Global error handler
app.use((error, req, res, next) => {
  console.error("Global error handler:", error);
  res.status(500).json({
    success: false,
    error: "Internal server error",
    details:
      process.env.NODE_ENV === "development"
        ? error.message
        : "Something went wrong",
  });
});

const PORT = process.env.PORT || 5050;

app.listen(PORT, async () => {
  try {
    await sequelize.authenticate();
    console.log("✅ Connected to Neon PostgreSQL");
    console.log(`🚀 Server running at http://localhost:${PORT}`);

    // Test Microsoft Graph connection
    try {
      const graphService = require("./services/graphService");
      await graphService.getAccessToken();
      console.log("✅ Microsoft Graph API connection successful");
    } catch (graphError) {
      console.error(
        "❌ Microsoft Graph API connection failed:",
        graphError.message
      );
    }
  } catch (error) {
    console.error("❌ Unable to connect to the database:", error);
  }
});
