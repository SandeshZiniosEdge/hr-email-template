const express = require("express");
const router = express.Router();
const { TemplateVariable } = require("../models"); // Adjust path as needed

// GET /api/template-variables
router.get("/", async (req, res) => {
  try {
    const variables = await TemplateVariable.findAll({
      where: { isActive: true },
      order: [["id", "ASC"]],
    });
    res.json({ success: true, data: variables });
  } catch (error) {
    console.error("Error fetching template variables:", error);
    res.status(500).json({ success: false, error: "Internal Server Error" });
  }
});

module.exports = router;
