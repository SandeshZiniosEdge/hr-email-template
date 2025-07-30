const express = require("express");
const { NotificationScenario } = require("../models"); // Adjust path as needed
const { Op } = require("sequelize");

const router = express.Router();

// Validation middleware
const validateNotificationScenario = (req, res, next) => {
  const { notificationScenario } = req.body;

  if (!notificationScenario || notificationScenario.trim() === "") {
    return res.status(400).json({
      success: false,
      message: "Notification scenario name is required",
    });
  }

  next();
};

// GET /api/notification-scenarios - Get all notification scenarios
router.get("/", async (req, res) => {
  try {
    const { page = 1, limit = 10, search, isActive } = req.query;
    const offset = (page - 1) * limit;

    // Build where clause
    const whereClause = {};

    if (search) {
      whereClause.notificationScenario = {
        [Op.iLike]: `%${search}%`,
      };
    }

    if (isActive !== undefined) {
      whereClause.isActive = isActive === "true";
    }

    const { count, rows } = await NotificationScenario.findAndCountAll({
      where: whereClause,
      limit: parseInt(limit),
      offset: parseInt(offset),
      order: [["createdAt", "DESC"]],
    });

    res.json({
      success: true,
      data: {
        scenarios: rows,
        pagination: {
          total: count,
          page: parseInt(page),
          limit: parseInt(limit),
          totalPages: Math.ceil(count / limit),
        },
      },
    });
  } catch (error) {
    console.error("Error fetching notification scenarios:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
});

// GET /api/notification-scenarios/:id - Get single notification scenario
router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const scenario = await NotificationScenario.findByPk(id);

    if (!scenario) {
      return res.status(404).json({
        success: false,
        message: "Notification scenario not found",
      });
    }

    res.json({
      success: true,
      data: scenario,
    });
  } catch (error) {
    console.error("Error fetching notification scenario:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
});

// POST /api/notification-scenarios - Create new notification scenario
router.post("/", validateNotificationScenario, async (req, res) => {
  try {
    const scenarioData = {
      notificationScenario: req.body.notificationScenario.trim(),
      smsRequired: req.body.smsRequired || false,
      smsBody: req.body.smsBody || null,
      emailRequired: req.body.emailRequired || false,
      emailSubject: req.body.emailSubject || null,
      emailBody: req.body.emailBody || null,
      emailButtonName: req.body.emailButtonName || null,
      inPortalWebRequired: req.body.inPortalWebRequired || false,
      inPortalWebSubject: req.body.inPortalWebSubject || null,
      inPortalWebBody: req.body.inPortalWebBody || null,
      inPortalWebLinkName: req.body.inPortalWebLinkName || null,
      mobilePushRequired: req.body.mobilePushRequired || false,
      mobilePushSubject: req.body.mobilePushSubject || null,
      mobilePushBody: req.body.mobilePushBody || null,
      isActive: req.body.isActive !== undefined ? req.body.isActive : true,
    };

    // Check if scenario name already exists
    const existingScenario = await NotificationScenario.findOne({
      where: {
        notificationScenario: scenarioData.notificationScenario,
        isActive: true,
      },
    });

    if (existingScenario) {
      return res.status(400).json({
        success: false,
        message: "Notification scenario with this name already exists",
      });
    }

    const newScenario = await NotificationScenario.create(scenarioData);

    res.status(201).json({
      success: true,
      message: "Notification scenario created successfully",
      data: newScenario,
    });
  } catch (error) {
    console.error("Error creating notification scenario:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
});

// PUT /api/notification-scenarios/:id - Update notification scenario
router.put("/:id", validateNotificationScenario, async (req, res) => {
  try {
    const { id } = req.params;

    const scenario = await NotificationScenario.findByPk(id);

    if (!scenario) {
      return res.status(404).json({
        success: false,
        message: "Notification scenario not found",
      });
    }

    // Check if new scenario name conflicts with existing ones (excluding current)
    if (req.body.notificationScenario !== scenario.notificationScenario) {
      const existingScenario = await NotificationScenario.findOne({
        where: {
          notificationScenario: req.body.notificationScenario.trim(),
          isActive: true,
          id: { [Op.ne]: id },
        },
      });

      if (existingScenario) {
        return res.status(400).json({
          success: false,
          message: "Notification scenario with this name already exists",
        });
      }
    }

    const updateData = {
      notificationScenario: req.body.notificationScenario.trim(),
      smsRequired:
        req.body.smsRequired !== undefined
          ? req.body.smsRequired
          : scenario.smsRequired,
      smsBody:
        req.body.smsBody !== undefined ? req.body.smsBody : scenario.smsBody,
      emailRequired:
        req.body.emailRequired !== undefined
          ? req.body.emailRequired
          : scenario.emailRequired,
      emailSubject:
        req.body.emailSubject !== undefined
          ? req.body.emailSubject
          : scenario.emailSubject,
      emailBody:
        req.body.emailBody !== undefined
          ? req.body.emailBody
          : scenario.emailBody,
      emailButtonName:
        req.body.emailButtonName !== undefined
          ? req.body.emailButtonName
          : scenario.emailButtonName,
      inPortalWebRequired:
        req.body.inPortalWebRequired !== undefined
          ? req.body.inPortalWebRequired
          : scenario.inPortalWebRequired,
      inPortalWebSubject:
        req.body.inPortalWebSubject !== undefined
          ? req.body.inPortalWebSubject
          : scenario.inPortalWebSubject,
      inPortalWebBody:
        req.body.inPortalWebBody !== undefined
          ? req.body.inPortalWebBody
          : scenario.inPortalWebBody,
      inPortalWebLinkName:
        req.body.inPortalWebLinkName !== undefined
          ? req.body.inPortalWebLinkName
          : scenario.inPortalWebLinkName,
      mobilePushRequired:
        req.body.mobilePushRequired !== undefined
          ? req.body.mobilePushRequired
          : scenario.mobilePushRequired,
      mobilePushSubject:
        req.body.mobilePushSubject !== undefined
          ? req.body.mobilePushSubject
          : scenario.mobilePushSubject,
      mobilePushBody:
        req.body.mobilePushBody !== undefined
          ? req.body.mobilePushBody
          : scenario.mobilePushBody,
      isActive:
        req.body.isActive !== undefined ? req.body.isActive : scenario.isActive,
    };

    await scenario.update(updateData);

    res.json({
      success: true,
      message: "Notification scenario updated successfully",
      data: scenario,
    });
  } catch (error) {
    console.error("Error updating notification scenario:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
});

// PATCH /api/notification-scenarios/:id/toggle-status - Toggle active status
router.patch("/:id/toggle-status", async (req, res) => {
  try {
    const { id } = req.params;

    const scenario = await NotificationScenario.findByPk(id);

    if (!scenario) {
      return res.status(404).json({
        success: false,
        message: "Notification scenario not found",
      });
    }

    await scenario.update({ isActive: !scenario.isActive });

    res.json({
      success: true,
      message: `Notification scenario ${
        scenario.isActive ? "activated" : "deactivated"
      } successfully`,
      data: scenario,
    });
  } catch (error) {
    console.error("Error toggling notification scenario status:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
});

// DELETE /api/notification-scenarios/:id - Soft delete (set isActive to false)
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { permanent } = req.query;

    const scenario = await NotificationScenario.findByPk(id);

    if (!scenario) {
      return res.status(404).json({
        success: false,
        message: "Notification scenario not found",
      });
    }

    if (permanent === "true") {
      // Hard delete - use with caution
      await scenario.destroy();
      res.json({
        success: true,
        message: "Notification scenario permanently deleted",
      });
    } else {
      // Soft delete - set isActive to false
      await scenario.update({ isActive: false });
      res.json({
        success: true,
        message: "Notification scenario deactivated successfully",
        data: scenario,
      });
    }
  } catch (error) {
    console.error("Error deleting notification scenario:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
});

// GET /api/notification-scenarios/active/list - Get only active scenarios (utility endpoint)
router.get("/active/list", async (req, res) => {
  try {
    const scenarios = await NotificationScenario.findAll({
      where: { isActive: true },
      attributes: ["id", "notificationScenario"],
      order: [["notificationScenario", "ASC"]],
    });

    res.json({
      success: true,
      data: scenarios,
    });
  } catch (error) {
    console.error("Error fetching active notification scenarios:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
});

// POST /api/notification-scenarios/bulk-create - Bulk create scenarios
router.post("/bulk-create", async (req, res) => {
  try {
    const { scenarios } = req.body;

    if (!Array.isArray(scenarios) || scenarios.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Please provide an array of scenarios",
      });
    }

    // Validate each scenario
    for (let i = 0; i < scenarios.length; i++) {
      if (
        !scenarios[i].notificationScenario ||
        scenarios[i].notificationScenario.trim() === ""
      ) {
        return res.status(400).json({
          success: false,
          message: `Scenario at index ${i} is missing notification scenario name`,
        });
      }
    }

    const createdScenarios = await NotificationScenario.bulkCreate(scenarios, {
      validate: true,
      returning: true,
    });

    res.status(201).json({
      success: true,
      message: `${createdScenarios.length} notification scenarios created successfully`,
      data: createdScenarios,
    });
  } catch (error) {
    console.error("Error bulk creating notification scenarios:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
});

module.exports = router;
