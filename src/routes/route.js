const express = require("express");

const router = express.Router();

const userController = require("../controllers/userController.js")

// USER ROUTES

router.put("/user/:user_name", userController.createUser)
router.get("/user/:user_name", userController.getUser)

module.exports = router;