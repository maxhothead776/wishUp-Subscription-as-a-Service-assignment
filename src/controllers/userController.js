const userModel = require("../models/userModel.js");

const validator = require("../utils/validator.js");

const createUser = async (req, res) => {
  try {
    const user_name = req.params.user_name;

    if (!validator.isValid(user_name)) {
      res.status(400).send({ status: false, msg: "enter a valid name" });
      return;
    }

    const newUser = {
      user_name: user_name,
      created_at: new Date(),
    };

    await userModel.create(newUser);

    res.status(200).send({ status: true, msg: "SUCCESS" });
  } catch (error) {
    res.status(500).send({ status: false, msg: error.message });
  }
};

const getUser = async (req, res) => {
  try {
    const user_name = req.params.user_name;

    if (!validator.isValid(user_name)) {
      res.status(400).send({ status: false, msg: "enter a valid name to get" });
      return;
    }

    const user = await userModel.findOne({ user_name });

    if (!user) {
      res
        .status(404)
        .send({ status: false, msg: `user ${user_name} not found` });
      return;
    }

    res.status(200).send({ status: true, data: user });
  } catch (error) {
    res.status(500).send({ status: false, msg: error.message });
  }
};

module.exports = {
  createUser,
  getUser,
};
