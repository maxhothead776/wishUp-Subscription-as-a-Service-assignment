const { userModel } = require("../models");

const validator = require("../utils/validator.js");

const createUser = async (req, res) => {
  try {
    const user_name = req.params.user_name;

    // whether the USERNAME is valid or not
    if (!validator.validateUserName(user_name)) {
      res.status(400).send({ status: false, msg: "enter a valid user name" });
      return;
    }

    // UNIQUE USER

    let isUserNameAlreadyPresent = await userModel.findOne({ user_name });

    if (isUserNameAlreadyPresent) {
      return res.status(400).send({
        status: false,
        msg: ` username ${user_name} already taken, choose a new one`,
      });
    }

    // creating USER in db
    const newUser = {
      user_name: user_name,
      created_at: new Date(),
    };

    const createdUser = await userModel.create(newUser);

    // OUTPUT
    res.status(201).send({ status: true, msg: "SUCCESS", data: createdUser });
  } catch (error) {
    res.status(500).send({ status: false, msg: error.message });
  }
};

const getUser = async (req, res) => {
  try {
    const user_name = req.params.user_name;

    // validating the USERNAME
    if (!validator.validateUserName(user_name)) {
      res.status(400).send({ status: false, msg: "enter a valid name to get" });
      return;
    }

    // finding the USERNAME in db
    const user = await userModel.findOne({ user_name }, { _id: 0, __v: 0 });

    // if USERNAME is not present
    if (!user) {
      res.status(404).send({
        status: false,
        msg: `user ${user_name} has not registered yet`,
      });
      return;
    }

    // OUTPUT
    res.status(200).send({ status: true, data: user });
  } catch (error) {
    res.status(500).send({ status: false, msg: error.message });
  }
};

module.exports = {
  createUser,
  getUser,
};
