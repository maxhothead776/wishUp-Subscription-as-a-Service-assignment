const subsPlan = require("../configs/subsPlan.js");

const dateRegex = /^\d{4}\-(0[1-9]|1[012])\-(0[1-9]|[12][0-9]|3[01])$/;

const usernameRegex = /^[a-z0-9_\.]+$/;

const isValid = function (value) {
  if (typeof value === "undefined" || value === null) return false;
  if (typeof value === "string" && value.trim().length === 0) return false;
  if (typeof value === "number" && value.toString().trim().length === 0)
    return false;
  return true;
};

const validateUserName = function (username) {
  return usernameRegex.test(username);
};

const isValidPlan = function (plan_Id) {
  return subsPlan.plan_Id.indexOf(plan_Id) !== -1;
};

const isValidRequestBody = function (requestBody) {
  return Object.keys(requestBody).length > 0;
};

const validateDate = function (date) {
  return dateRegex.test(date);
};

const validTill = function (date, days) {
  var result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
};

module.exports = {
  isValid,
  validateUserName,
  isValidRequestBody,
  isValidPlan,
  validateDate,
  validTill,
};
