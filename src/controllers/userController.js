const { userModel } = require("../models");

const moment = require("moment")

const validator = require("../utils/validator.js");

const createUser = async (req, res) => {
  try {
    const user_name = req.params.user_name;

    // whether the USERNAME is valid or not
    if (!validator.isValid(user_name)) {
      res.status(400).send({ status: "FAILURE", msg: "enter a user name" });
      return;
    }

    // UNIQUE USER

    let UserAlreadyPresent = await userModel.findOne({ user_name });

    if (UserAlreadyPresent) {
      return res.status(400).send({
        status: "FAILURE",
        msg: ` username ${user_name.trim()} already taken, choose a new one`,
      });
    }

    // creating USER in db
    const newUser = {
      user_name: user_name,
      created_at: new Date(),
    };

    const createdUser = await userModel.create(newUser);

    // OUTPUT
    res.status(201).send({ status: "SUCCESS", data: createdUser });
  } catch (error) {
    res.status(500).send({ status: "FAILURE", msg: error.message });
  }
};

const getUser = async (req, res) => {
  try {
    const user_name = req.params.user_name;

    // validating the USERNAME
    if (!validator.isValid(user_name)) {
      res.status(400).send({ status: false, msg: "enter a valid name to get" });
      return;
    }

    // finding the USER in db
    let user = await userModel.findOne({ user_name }, { _id: 0, __v: 0 });

    // if USER is not present
    if (!user) {
      res.status(404).send({
        status: "FAILURE",
        msg: `user ${user_name} has not registered yet`,
      });
      return;
    }

    // formatting date to match the sample output
    user = user.toJSON();
    user.created_at = moment(user.created_at).format("YYYY-MM-DD HH:mm:ss")

    // OUTPUT
    res.status(200).send({ status: "SUCCESS", data: user });
  } catch (error) {
    res.status(500).send({ status: "FAILURE", msg: error.message });
  }
};

module.exports = {
  createUser,
  getUser,
};
