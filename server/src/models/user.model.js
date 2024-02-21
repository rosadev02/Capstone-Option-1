const mongoose = require("mongoose");

const transactionSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ["Deposit", "Withdraw"],
  },
  amount: {
    type: Number,
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
});

const userSchema = new mongoose.Schema({
  name: {
    type: String,
  },
  email: {
    type: String,
  },
  password: {
    type: String,
  },
  balance: {
    type: Number,
    default: 0,
  },
  transactions: [transactionSchema],
});

const User = mongoose.model("User", userSchema);

module.exports = User;
