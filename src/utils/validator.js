const subsPlan = require("../configs/subsPlan.js");

const isValid = function (value) {
  if (typeof value === "undefined" || value === null) return false;
  if (typeof value === "string" && value.trim().length === 0) return false;
  if (typeof value === "number" && value.toString().trim().length === 0)
    return false;
  return true;
};

const isValidPlan = function (plan_Id) {
  return subsPlan.plan_Id.indexOf(plan_Id) !== -1;
};

const isValidRequestBody = function (requestBody) {
  return Object.keys(requestBody).length > 0;
};

module.exports = {
  isValid,
  isValidRequestBody,
  isValidPlan,
};
