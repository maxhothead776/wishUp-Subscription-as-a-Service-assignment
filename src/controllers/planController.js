const planModel = require("../models/planModel.js");

const validator = require("../utils/validator.js");

const subsPlan = require("../configs/subsPlan.js");

const createPlan = async (req, res) => {
  try {
    const requestBody = req.body;

    if (!validator.isValidRequestBody(requestBody)) {
      res.status(400).send({ status: false, msg: "enter a valid body" });
      return;
    }

    const { plan_Id, validity, cost } = requestBody;

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

    if (!validator.isValid(validity)) {
      res
        .status(400)
        .send({ status: false, msg: "enter a valid validity period" });
      return;
    }

    if (!validator.isValid(cost)) {
      res.status(400).send({ status: false, msg: "enter a valid amount" });
      return;
    }

    newPlan = { plan_Id, validity, cost };

    const createdPlan = await planModel.create(newPlan);

    res
      .status(200)
      .send({ status: true, msg: "new plan incorporated", data: createdPlan });
  } catch (error) {
    res.status(500).send({ status: false, msg: error.message });
  }
};


module.exports = {
    createPlan
}