//models.js
const {v4: uuidv4} = require("uuid");

let accounts = {};
let transactions = [];

class Account {
  constructor(name, balance) {
    this.id = uuidv4();
    this.name = name;
    this.balance = balance;
  }
}

class Transaction {
  constructor(from, to, amount, message) {
    this.id = uuidv4();
    this.from = from;
    this.to = to;
    this.amount = amount;
    this.message = message;
    this.timestamp = new Date();
  }
}

module.exports = {accounts, transactions, Account, Transaction};
