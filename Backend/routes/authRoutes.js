const express = require("express");
const router = express.Router();
const { loginAdmin } = require("../controllers/adminController");

// POST /api/auth/admin-login
router.post("/admin-login", loginAdmin);

module.exports = router;
