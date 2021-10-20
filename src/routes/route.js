const express = require("express");

const router = express.Router();

// USER API
const userController = require("../controllers/userController.js");

router.put("/user/:user_name", userController.createUser);
router.get("/user/:user_name", userController.getUser);

// FOR ADMIN ONLY(PLAN API)
const planController = require("../controllers/planController.js");

router.post("/plan", planController.createPlan);

// SUBSCRIPTION API
const subscriptionController = require("../controllers/subscriptionController.js");

router.post("/subscription", subscriptionController.createSubscription);
router.get("/subscription/:user_name", subscriptionController.getSubscription);
router.get(
    "/subscription/:user_name/:date",
    subscriptionController.getSubscription
);

module.exports = router;