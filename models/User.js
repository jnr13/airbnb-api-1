const mongoose = require("mongoose");

const UserModel = mongoose.model("User", {
  account: {
    username: String,
    biography: String
  },
  email: String,
  token: String,
  hash: String,
  salt: String
});

module.exports = UserModel;
