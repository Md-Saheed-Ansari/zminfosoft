const express = require("express");
const router = express.Router();
const verifyToken = require("../middleware/auth");
const { getAllMessages } = require("../controllers/messageController");
const { markMessageAsRead } = require("../controllers/messageController");

const {
  createEmployee,
  updateEmployee,
  deleteEmployee,
  getEmployees,
} = require("../controllers/employeeController");


// 💬 Protect this messages route
router.get("/messages", verifyToken, getAllMessages);
router.put("/messages/:id/mark-read", verifyToken, markMessageAsRead);

// 👨‍💼 Employee management routes (all protected)
router.post("/employees", verifyToken, createEmployee);
router.get("/employees", verifyToken, getEmployees);
router.put("/employees/:id", verifyToken, updateEmployee);
router.delete("/employees/:id", verifyToken, deleteEmployee);


module.exports = router;
