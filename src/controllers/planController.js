const { planModel } = require("../models");

const validator = require("../utils/validator.js");

const subsPlan = require("../configs/subsPlan.js");

const createPlan = async (req, res) => {
  try {
    const requestBody = req.body;

    // WHETHER THE REQUEST BODY or INPUT IS PRESENT
    if (!validator.isValidRequestBody(requestBody)) {
      res.status(400).send({ status: false, msg: "enter a valid body" });
      return;
    }

    // OBJECT DESTRUCTURING
    const { plan_id, validity, cost } = requestBody;

    // WHETHER A PLAN_ID IS PRESENT OR NOT
    if (!validator.isValid(plan_id)) {
      res.status(400).send({ status: false, msg: "enter a plan id" });
      return;
    }

    // WHETHER PLAN_ID IS FROM OUR PLANS OR NOT
    if (!validator.isValidPlan(plan_id)) {
      res.status(400).send({
        status: false,
        msg: ` the plan should be one of ${subsPlan.plan_Id.join(", ")} `,
      });
      return;
    }

    // WHETHER A VALIDITY IS GIVEN OR NOT
    if (!validator.isValid(validity)) {
      res
        .status(400)
        .send({ status: false, msg: "enter a valid validity period" });
      return;
    }

    // WHETHER THE COST IS GIVEN
    if (!validator.isValid(cost)) {
      res.status(400).send({ status: false, msg: "enter a valid amount" });
      return;
    }

    // CREATING THE NEW PLAN
    const newPlan = { plan_id, validity, cost };

    const createdPlan = await planModel.create(newPlan);

    // OUTPUT
    res
      .status(201)
      .send({ status: "SUCCESS", msg: "new plan incorporated", data: createdPlan });
  } catch (error) {
    res.status(500).send({ status: false, msg: error.message });
  }
};

module.exports = {
  createPlan,
};
