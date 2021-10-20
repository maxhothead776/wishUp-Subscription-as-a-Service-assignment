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

const getSubscriptionByDate = async (req, res) => {
  try {
    const user_name = req.params.user_name;
    const current_date = req.params.date;

    if (!validator.isValid(user_name)) {
      res.status(400).send({ status: false, msg: "enter a valid name" });
      return;
    }

    if (!validator.isValid(current_date)) {
      res
        .status(400)
        .send({ status: false, message: "current date is required" });
      return;
    }

    if (!validator.validateDate(current_date)) {
      res
        .status(400)
        .send({ status: false, message: "enter date in YYYY-MM-DD format" });
      return;
    }

    const user = await userModel.findOne({ user_name });

    if (!user) {
      res
        .status(404)
        .send({ status: false, msg: `user ${user_name} not found` });
      return;
    }

    const subs = await subscriptionModel.findOne({ user_name });

    if (!subs) {
      res.status(404).send({
        status: false,
        msg: `user ${user_name} has not subscribed yet`,
      });
      return;
    }

    const start_date = subs.start_date;
    const plan_Id = subs.plan_Id;

    const plan = await planModel.findOne({ plan_Id });

    const validity = plan.validity;

    const valid_till = validator.validTill(start_date, validity);

    // check whether the current date is between start date and valid till date

    const timeDif = Math.abs(new Date(current_date) - start_date);
    const days_left = Math.ceil(timeDif / (1000 * 60 * 60 * 24));

    const data = {
      plan_Id,
      days_left,
    };

    res.status(200).send({ status: true, data: data });
  } catch (error) {
    res.status(500).send({ status: false, msg: error.message });
  }
};

const getSubscription = async (req, res) => {
  try {
    const user_name = req.params.user_name;

    if (!validator.isValid(user_name)) {
      res.status(400).send({ status: false, msg: "enter a valid name" });
      return;
    }

    const user = await userModel.findOne({ user_name });

    if (!user) {
      res
        .status(404)
        .send({ status: false, msg: `user ${user_name} not found` });
      return;
    }

    const subs = await subscriptionModel.findOne({ user_name });

    if (!subs) {
      res.status(404).send({
        status: false,
        msg: `user ${user_name} has not subscribed yet`,
      });
      return;
    }

    const start_date = subs.start_date;
    const plan_Id = subs.plan_Id;

    const plan = await planModel.findOne({ plan_Id });

    const validity = plan.validity;

    const valid_till = validator.validTill(start_date, validity);

    const data = {
      plan_Id,
      start_date,
      valid_till,
    };

    res.status(200).send({ status: true, data: data });
  } catch (error) {
    res.status(500).send({ status: false, msg: error.message });
  }
};

module.exports = {
  createSubscription,
  getSubscriptionByDate,
  getSubscription,
};
