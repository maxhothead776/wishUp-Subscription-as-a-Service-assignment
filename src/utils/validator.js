const subsPlan = require("../configs/subsPlan.js");

const moment = require("moment");

const validFormat = ["YYYY-MM-DD"];

// isValid checks valid strings for string and valid numbers for numbers at once
const isValid = function (value) {
  if (typeof value === "undefined" || value === null) return false;
  if (typeof value === "string" && value.trim().length === 0) return false;
  if (typeof value === "number" && value.toString().trim().length === 0)
    return false;
  return true;
};

// isValidPlan checks whether the plan_id is one of the mentioned six in subsPlan
const isValidPlan = function (plan_Id) {
  return subsPlan.plan_Id.indexOf(plan_Id) !== -1;
};

const isValidRequestBody = function (requestBody) {
  return Object.keys(requestBody).length > 0;
};

// date validation in yyyy-mm-dd format
const validDate = function (date) {
  return moment(date, validFormat, true).isValid();
};

// to ensure user doesn't enter past date
const isToday = function (date) {
  return moment(date).format("YYYY-MM-DD") > moment().format("YYYY-MM-DD");
};

module.exports = {
  isValid,
  isValidRequestBody,
  isValidPlan,
  validDate,
  isToday,
};
