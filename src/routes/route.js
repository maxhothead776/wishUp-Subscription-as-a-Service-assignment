const express = require("express");

const router = express.Router();

const userController = require("../controllers/userController.js")

// USER API

router.put("/user/:user_name", userController.createUser)
router.get("/user/:user_name", userController.getUser)

// FOR ADMIN ONLY(PLAN API)
const planController = require("../controllers/planController.js")
router.post("/plan", planController.createPlan)

// SUBSCRIPTION API


module.exports = router;