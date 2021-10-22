const { userModel, subscriptionModel, planModel } = require("../models");

const moment = require("moment");

const validator = require("../utils/validator.js");

const subsPlan = require("../configs/subsPlan.js");

const createSubscription = async (req, res) => {
  try {
    const requestBody = req.body;

    // checking for valid input
    if (!validator.isValidRequestBody(requestBody)) {
      res.status(400).send({
        status: "FAILURE",
        msg: "enter a valid body",
      });
      return;
    }

    // object destructuring
    let { plan_id, user_name, start_date } = requestBody;

    // username should be present as well
    if (!validator.isValid(user_name)) {
      res.status(400).send({
        status: "FAILURE",
        msg: "enter a user name",
      });
      return;
    }

    // whether the user has registered

    const user = await userModel.findOne({
      user_name,
    });

    if (!user) {
      res.status(404).send({
        status: "FAILURE",
        msg: `user ${user_name} not registered`,
      });
      return;
    }

    // valid plan Id
    if (!validator.isValid(plan_id)) {
      res.status(400).send({
        status: "FAILURE",
        msg: "enter a plan id",
      });
      return;
    }

    // plan id can only be one of the given six
    if (!validator.isValidPlan(plan_id)) {
      res.status(400).send({
        status: "FAILURE",
        msg: `the plan should be one of ${subsPlan.plan_Id.join(", ")} `,
      });
      return;
    }

    // start_date should be entered
    if (!validator.isValid(start_date)) {
      res.status(400).send({
        status: "FAILURE",
        message: "enter date in YYYY-MM-DD format",
      });
      return;
    }

    // valid date should be enterd
    if (!validator.validDate(start_date)) {
      res.status(400).send({
        status: "FAILURE",
        message: "enter a correct date and in YYYY-MM-DD format",
      });
      return;
    }

    // checking whether the user has already subscribed

    let total_subscriptions = await subscriptionModel.find({
      user_name: user_name,
    });

    // Assuming that all the subscriptions are in order
    if (total_subscriptions.length >= 1) {
      var latestSubscription =
        total_subscriptions[total_subscriptions.length - 1];
      let validTill = latestSubscription.valid_till;

      if (
        moment(start_date).format("YYYY-MM-DD") <
        moment(validTill).format("YYYY-MM-DD")
      ) {
        return res.status(400).send({
          status: "FAILURE",
          msg: `user is already subscribed upto ${validTill}`,
        });
      }
    }

    // calculating valid_till date
    const plan = await planModel.findOne({
      plan_id,
    });

    var valid_till;

    if (plan.validity == 1e300) {
      // for infinite date
      var MAX_TIMESTAMP = 8640000000000000;
      valid_till = new Date(MAX_TIMESTAMP);
    } else {
      valid_till = moment(start_date, "YYYY-MM-DD").add(plan.validity, "days");
    }

    // creating new subscription
    const newSub = {
      plan_id,
      user_name,
      start_date,
      valid_till,
    };

    const subscription = await subscriptionModel.create(newSub);

    // cost of chosen subscription plan
    const amount = plan.cost;

    if (!subscription) {
      return res.status(400).send({
        status: "FAILURE",
        msg: "Subscription Failed. Your money will be sent back",
        amount: +amount,
      });
    }

    // output

    res.status(201).send({
      status: "SUCCESS",
      amount: -amount,
    });
  } catch (error) {
    res.status(500).send({
      status: "FAILURE",
      msg: error.message,
    });
  }
};

const getSubscriptionByDate = async (req, res) => {
  try {
    const user_name = req.params.user_name;
    const current_date = req.params.date;

    if (!validator.isValid(user_name)) {
      res.status(400).send({
        status: "FAILURE",
        msg: "enter a valid name",
      });
      return;
    }

    if (!validator.isValid(current_date)) {
      res.status(400).send({
        status: "FAILURE",
        message: "current date is required",
      });
      return;
    }

    if (!validator.validDate(current_date)) {
      res.status(400).send({
        status: "FAILURE",
        message: "enter date in YYYY-MM-DD format",
      });
      return;
    }

    // checking whether the user is present or not
    const user = await userModel.findOne({
      user_name,
    });

    if (!user) {
      res.status(404).send({
        status: "FAILURE",
        msg: `user ${user_name} not found`,
      });
      return;
    }

    // checking whether he has subscribed or not
    const subs = await subscriptionModel.find({
      user_name,
    });

    if (!subs) {
      res.status(404).send({
        status: "FAILURE",
        msg: `user ${user_name} has not subscribed yet`,
      });
      return;
    }

    // latest subscription details
    const latestSubscription = subs[subs.length - 1];
    const plan_id = latestSubscription.plan_id;
    const valid_till = latestSubscription.valid_till;

    // check whether the current date is between today's date and valid till date
    if (
      moment(current_date).format("YYYY-MM-DD") < moment().format("YYYY-MM-DD")
    ) {
      return res.status(400).send({
        status: "FAILURE",
        msg: "please enter today's date",
      });
    }

    if (new Date(current_date) > valid_till) {
      return res.status(404).send({
        status: "FAILURE",
        msg: "No active plans found. Please renew your subscription",
      });
    }

    const timeDif = Math.abs(valid_till - new Date(current_date));
    const days_left = Math.ceil(timeDif / (1000 * 60 * 60 * 24));

    const data = {
      plan_id,
      days_left,
    };

    res.status(200).send({
      status: "SUCCESS",
      data: data,
    });
  } catch (error) {
    res.status(500).send({
      status: "FAILURE",
      msg: error.message,
    });
  }
};

const getSubscription = async (req, res) => {
  try {
    const user_name = req.params.user_name;

    if (!validator.isValid(user_name)) {
      res.status(400).send({
        status: "FAILURE",
        msg: "enter a valid name",
      });
      return;
    }

    const user = await userModel.findOne({
      user_name,
    });

    if (!user) {
      res.status(404).send({
        status: "FAILURE",
        msg: `user ${user_name} not found`,
      });
      return;
    }

    const subs = await subscriptionModel.find(
      {
        user_name: user_name,
      },
      {
        user_name: 0,
        _id: 0,
        __v: 0,
      }
    );

    if (!subs) {
      res.status(404).send({
        status: "FAILURE",
        msg: `user ${user_name} has not subscribed yet`,
      });
      return;
    }

    res.status(200).send({
      status: "SUCCESS",
      data: subs,
    });
  } catch (error) {
    res.status(500).send({
      status: "FAILURE",
      msg: error.message,
    });
  }
};

module.exports = {
  createSubscription,
  getSubscriptionByDate,
  getSubscription,
};
