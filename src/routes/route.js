const express = require("express");

const router = express.Router();

// USER API
const userController = require("../controllers/userController.js");

router.put("/user/:user_name", userController.createUser);
router.get("/user/:user_name", userController.getUser);



// FOR ADMIN ONLY(PLAN API)
// even though i have not established any authentication or authorisation for admin but i can do it using jwt token.
const planController = require("../controllers/planController.js");

router.post("/plan", planController.createPlan);



// SUBSCRIPTION API
const subscriptionController = require("../controllers/subscriptionController.js");

router.post("/subscription", subscriptionController.createSubscription);
router.get("/subscription/:user_name", subscriptionController.getSubscription);
router.get(
  "/subscription/:user_name/:date",
  subscriptionController.getSubscriptionByDate
);

module.exports = router;
