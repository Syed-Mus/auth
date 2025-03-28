const express = require("express");
const { register, login, getProfile } = require("../controllers/authController");
const authMiddleware = require("../middleware/authMiddleware"); // Protect the route

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.get("/profile", authMiddleware, getProfile); // New profile route

module.exports = router;  

//adfasdfasfasfasf
