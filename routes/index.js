// index.js
const express = require("express");
const {accounts, transactions, Account, Transaction} = require("../controllers/models");

const router = express.Router();
function RecordTransaction(from, to, amount, message) {
  const transaction = new Transaction(from, to, amount, message);
  transactions.push(transaction);
  return transaction;
}
// 創建帳戶
router.post("/accounts", (req, res) => {
  const {name, balance} = req.body;
  if (balance < 0) {
    return res.status(400).json({success: false, message: "初始金額不能為負數"});
  }
  const account = new Account(name, balance);
  RecordTransaction(account.id, account.id, balance, "創建帳戶");

  accounts[account.id] = account;
  res.status(201).json({success: true, account});
});

// 存錢至帳戶
router.post("/accounts/:id/deposit", (req, res) => {
  const {id} = req.params;
  const amount = req.body.amount;
  const account = accounts[id];

  if (!account) {
    return res.status(404).json({success: false, message: "查無此帳號id"});
  }
  RecordTransaction(id, id, amount, "存錢");

  account.balance += amount;
  res.json({success: true, account});
});

// 從帳戶提款
router.post("/accounts/:id/withdraw", (req, res) => {
  const {id} = req.params;
  const {amount} = req.body;
  const account = accounts[id];
  if (!account) {
    RecordTransaction(id, id, amount, "查無此帳號id");
    return res.status(404).json({success: false, message: "查無此帳號id"});
  }
  if (account.balance < amount) {
    RecordTransaction(id, id, amount, "餘額不足");
    return res.status(400).send({success: false, message: "餘額不足"});
  }
  RecordTransaction(id, id, amount, "提款成功");
  account.balance -= amount;
  res.json({success: true, account});
});

// 帳戶轉帳
router.post("/accounts/transfer", (req, res) => {
  const {senderId, recipientId, amount} = req.body;
  const fromAccount = accounts[senderId];
  const toAccount = accounts[recipientId];
  if (!fromAccount || !toAccount) {
    RecordTransaction(senderId, recipientId, amount, "查無此帳號id");

    return res.status(404).json({success: false, message: "查無此帳號id"});
  }
  if (fromAccount.balance < amount) {
    RecordTransaction(senderId, recipientId, amount, "餘額不足");

    return res.status(400).json({success: false, message: "餘額不足"});
  }

  // 開始轉賬前保存初始狀態
  const initialFromBalance = fromAccount.balance;
  const initialToBalance = toAccount.balance;

  try {
    // 嘗試完成交易
    fromAccount.balance -= amount;
    toAccount.balance += amount;
    const transaction = RecordTransaction(senderId, recipientId, amount, "轉帳成功");

    res.json({success: true, sender: fromAccount, transaction});
  } catch (error) {
    // 如果交易失敗，恢復帳戶餘額
    fromAccount.balance = initialFromBalance;
    toAccount.balance = initialToBalance;
    RecordTransaction(senderId, recipientId, amount, "交易失敗");
    res.status(500).json({success: false, message: "交易失敗"});
  }
});
// 取得交易紀錄
router.get("/transactions", (req, res) => {
  res.json({success: true, transactions});
});

module.exports = router;
