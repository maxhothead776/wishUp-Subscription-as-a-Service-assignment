const { userModel, subscriptionModel, planModel } = require("../models");

const validator = require("../utils/validator.js");

const subsPlan = require("../configs/subsPlan.js");

const createSubscription = async (req, res) => {
  try {
    const requestBody = req.body;

    if (!validator.isValidRequestBody(requestBody)) {
      res.status(400).send({ status: false, msg: "enter a valid body" });
      return;
    }

    const { plan_Id, user_name, start_date } = requestBody;

    if (!validator.isValid(plan_Id)) {
      res.status(400).send({ status: false, msg: "enter a plan id" });
      return;
    }

    if (!validator.isValidPlan(plan_Id)) {
      res.status(400).send({
        status: false,
        msg: `${subsPlan.plan_Id.join(",")} is required`,
      });
      return;
    }

    if (!validator.isValid(user_name)) {
      res.status(400).send({ status: false, msg: "enter a user name" });
      return;
    }

    const user = await userModel.findOne({ user_name });

    if (!user) {
      res
        .status(400)
        .send({ status: false, msg: `user ${user_name} not registered` });
      return;
    }

    if (!validator.isValid(start_date)) {
      res
        .status(400)
        .send({ status: false, message: "start date is required" });
      return;
    }

    if (!validator.validateDate(start_date)) {
      res
        .status(400)
        .send({ status: false, message: "enter date in YYYY-MM-DD format" });
      return;
    }

    const newSub = { plan_Id, user_name, start_date };

    await subscriptionModel.create(newSub);

    const amount = await planModel.findOne({ plan_Id });

    res.status(201).send({ status: "SUCCESS", amount: -amount.cost });
  } catch (error) {
    res.status(500).send({ status: false, msg: error.message });
  }
};

const getSubscription = async (req, res) => {
  try {
  } catch (error) {
    res.status(500).send({ status: false, msg: error.message });
  }
};

module.exports = {
  createSubscription,
  getSubscription,
};
