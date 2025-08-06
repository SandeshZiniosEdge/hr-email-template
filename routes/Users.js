// routes/Users.js
const express = require("express");
const router = express.Router();
const graphService = require("../services/graphService");

// Middleware for error handling
const asyncHandler = (fn) => (req, res, next) =>
  Promise.resolve(fn(req, res, next)).catch(next);

// GET /users - Get all users with optional filtering
router.get(
  "/",
  asyncHandler(async (req, res) => {
    try {
      const { select, top = 100, filter, department } = req.query;

      let users;

      if (department) {
        users = await graphService.getUsersByDepartment(department, {
          select,
          top: parseInt(top),
        });
      } else {
        users = await graphService.getAllUsers({
          select,
          top: parseInt(top),
          filter,
        });
      }

      res.json({
        success: true,
        data: users,
        count: users.value?.length || 0,
      });
    } catch (error) {
      console.error("Error in GET /users:", error);
      res.status(500).json({
        success: false,
        error: "Failed to fetch users",
        details: error.message,
      });
    }
  })
);

// GET /users/:id - Get user by ID
router.get(
  "/:id",
  asyncHandler(async (req, res) => {
    try {
      const { id } = req.params;
      const { select } = req.query;

      const user = await graphService.getUserById(id, select);

      res.json({
        success: true,
        data: user,
      });
    } catch (error) {
      console.error("Error in GET /users/:id:", error);

      if (error.code === "Request_ResourceNotFound") {
        return res.status(404).json({
          success: false,
          error: "User not found",
        });
      }

      res.status(500).json({
        success: false,
        error: "Failed to fetch user",
        details: error.message,
      });
    }
  })
);

// GET /users/search/:term - Search users
router.get(
  "/search/:term",
  asyncHandler(async (req, res) => {
    try {
      const { term } = req.params;
      const { select, top = 50 } = req.query;

      const users = await graphService.searchUsers(term, {
        select,
        top: parseInt(top),
      });

      res.json({
        success: true,
        data: users,
        count: users.value?.length || 0,
        searchTerm: term,
      });
    } catch (error) {
      console.error("Error in GET /users/search:", error);
      res.status(500).json({
        success: false,
        error: "Failed to search users",
        details: error.message,
      });
    }
  })
);

// GET /users/:id/groups - Get user's groups
router.get(
  "/:id/groups",
  asyncHandler(async (req, res) => {
    try {
      const { id } = req.params;

      const groups = await graphService.getUserGroups(id);

      res.json({
        success: true,
        data: groups,
        count: groups.value?.length || 0,
      });
    } catch (error) {
      console.error("Error in GET /users/:id/groups:", error);
      res.status(500).json({
        success: false,
        error: "Failed to fetch user groups",
        details: error.message,
      });
    }
  })
);

// GET /users/:id/manager - Get user's manager
router.get(
  "/:id/manager",
  asyncHandler(async (req, res) => {
    try {
      const { id } = req.params;

      const manager = await graphService.getUserManager(id);

      res.json({
        success: true,
        data: manager,
      });
    } catch (error) {
      console.error("Error in GET /users/:id/manager:", error);

      if (error.code === "Request_ResourceNotFound") {
        return res.json({
          success: true,
          data: null,
          message: "User has no manager",
        });
      }

      res.status(500).json({
        success: false,
        error: "Failed to fetch user manager",
        details: error.message,
      });
    }
  })
);

// GET /users/:id/direct-reports - Get user's direct reports
router.get(
  "/:id/direct-reports",
  asyncHandler(async (req, res) => {
    try {
      const { id } = req.params;

      const directReports = await graphService.getUserDirectReports(id);

      res.json({
        success: true,
        data: directReports,
        count: directReports.value?.length || 0,
      });
    } catch (error) {
      console.error("Error in GET /users/:id/direct-reports:", error);
      res.status(500).json({
        success: false,
        error: "Failed to fetch user direct reports",
        details: error.message,
      });
    }
  })
);

module.exports = router;
