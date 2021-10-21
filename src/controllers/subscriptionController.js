const { userModel, subscriptionModel, planModel } = require("../models");

const validator = require("../utils/validator.js");

const subsPlan = require("../configs/subsPlan.js");

const createSubscription = async (req, res) => {
  try {
    const requestBody = req.body;

    // checking for valid input
    if (!validator.isValidRequestBody(requestBody)) {
      res.status(400).send({ status: false, msg: "enter a valid body" });
      return;
    }

    // object destructuring
    const { plan_id, user_name, start_date } = requestBody;

    // valid plan Id
    if (!validator.isValid(plan_id)) {
      res.status(400).send({ status: false, msg: "enter a plan id" });
      return;
    }

    // plan id can only be one of the given six
    if (!validator.isValidPlan(plan_id)) {
      res.status(400).send({
        status: false,
        msg: `the plan should be one of ${subsPlan.plan_Id.join(", ")} `,
      });
      return;
    }

    // username should be present as well
    if (!validator.isValid(user_name)) {
      res.status(400).send({ status: false, msg: "enter a user name" });
      return;
    }

    // valid username
    if (!validator.validateUserName(user_name)) {
      res.status(400).send({ status: false, msg: "enter a valid user name" });
      return;
    }

    // whether the user has registered

    const user = await userModel.findOne({ user_name });

    if (!user) {
      res
        .status(404)
        .send({ status: false, msg: `user ${user_name} not registered` });
      return;
    }

    // checking whether the user has already subscribed

    /*
    let isSubscriptionAlreadyPresent = await subscriptionModel.findOne({
      user_name,
    });

    if (isSubscriptionAlreadyPresent) {
      return res.status(400).send({
        status: false,
        msg: ` username ${user_name} has already subscribed`,
      });
    }
    */
   
    // start_date should be entered
    if (!validator.isValid(start_date)) {
      res
        .status(400)
        .send({ status: false, message: "start date is required" });
      return;
    }

    // valid date should be enterd
    if (!validator.validateDate(start_date)) {
      res
        .status(400)
        .send({ status: false, message: "enter date in YYYY-MM-DD format" });
      return;
    }

    // creating new subscription
    const newSub = { plan_id, user_name, start_date };

    await subscriptionModel.create(newSub);

    // output
    const amount = await planModel.findOne({ plan_id });

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

    // checking whether the user is present or not
    const user = await userModel.findOne({ user_name });

    if (!user) {
      res
        .status(404)
        .send({ status: false, msg: `user ${user_name} not found` });
      return;
    }

    // checking whether he has subscribed or not
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
