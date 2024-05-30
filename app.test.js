// app.test.js
const supertest = require("supertest");
const app = require("./app");
const {Account, Transaction} = require("./controllers/models");
const request = supertest(app);
describe("帳戶單元測試", () => {
  it("建立一個帳戶並設定初始餘額", () => {
    const account = new Account("Alice", 100);
    expect(account.name).toEqual("Alice");
    expect(account.balance).toEqual(100);
  });

  it("測試存款操作", async () => {
    const account = new Account("Bob", 50);
    account.balance += 50;
    expect(account.balance).toEqual(100);
  });

  it("測試提款操作", async () => {
    const account = new Account("Charlie", 100);
    account.balance -= 30;
    expect(account.balance).toEqual(70);
  });

  it("餘額不足時，防止提款取出", async () => {
    const account = new Account("Dave", 50);
    if (account.balance < 60) {
      account.balance = account.balance;
    } else {
      account.balance -= 60;
    }
    expect(account.balance).toEqual(50);
  });
});
describe("交易紀錄單元測試", () => {
  it("區分交易屬性", () => {
    const transaction = new Transaction("123", "456", 50);
    expect(transaction.from).toEqual("123");
    expect(transaction.to).toEqual("456");
    expect(transaction.amount).toEqual(50);
    expect(transaction.timestamp).toBeInstanceOf(Date);
  });

  it("設置交易紀錄時間戳", () => {
    const beforeTime = new Date();
    const transaction = new Transaction("123", "456", 50);
    const afterTime = new Date();
    expect(transaction.timestamp.getTime()).toBeGreaterThanOrEqual(beforeTime.getTime());
    expect(transaction.timestamp.getTime()).toBeLessThanOrEqual(afterTime.getTime());
  });

  it("每個交易應有唯一的 ID", () => {
    const transaction1 = new Transaction("123", "456", 50);
    const transaction2 = new Transaction("456", "789", 100);
    expect(transaction1.id).not.toEqual(transaction2.id);
  });
});
describe("交易紀錄單元測試", () => {
  test("should create a transaction with specified details", () => {
    const transaction = new Transaction("123", "456", 50);
    expect(transaction.from).toBe("123");
    expect(transaction.to).toBe("456");
    expect(transaction.amount).toBe(50);
  });

  test("should record the correct timestamp for a transaction", () => {
    const initialTime = new Date();
    const transaction = new Transaction("123", "456", 50);
    const afterTime = new Date();
    expect(transaction.timestamp).toBeInstanceOf(Date);
    expect(transaction.timestamp.getTime()).toBeGreaterThanOrEqual(initialTime.getTime());
    expect(transaction.timestamp.getTime()).toBeLessThanOrEqual(afterTime.getTime());
  });

  test("should assign unique IDs to each transaction", () => {
    const transaction1 = new Transaction("123", "456", 50);
    const transaction2 = new Transaction("789", "012", 75);
    expect(transaction1.id).not.toBe(transaction2.id);
  });
});

describe("Banking API Tests", () => {
  let createdAccountId;

  test("Create an account", async () => {
    const response = await request.post("/api/accounts").send({name: "Test Member", balance: 100});
    expect(response.status).toBe(201);
    expect(response.body.success).toBe(true);
    expect(response.body.account).toHaveProperty("id");
    createdAccountId = response.body.account.id;
  });

  test("帳戶存款", async () => {
    const response = await request.post(`/api/accounts/${createdAccountId}/deposit`).send({amount: 50});
    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.account.balance).toBe(150);
  });

  test("帳戶提款", async () => {
    const response = await request.post(`/api/accounts/${createdAccountId}/withdraw`).send({amount: 30});
    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.account.balance).toBe(120);
  });

  test("帳戶轉帳交易", async () => {
    const senderResponse = await request.post("/api/accounts").send({name: "Test Member", balance: 50});
    const senderId = senderResponse.body.account.id;
    const recipientResponse = await request.post("/api/accounts").send({name: "Test Member2", balance: 50});
    const recipientId = recipientResponse.body.account.id;

    const transferResponse = await request.post("/api/accounts/transfer").send({
      senderId: senderId,
      recipientId: recipientId,
      amount: 20,
    });
    expect(transferResponse.status).toBe(200);
    expect(transferResponse.body.success).toBe(true);
    expect(transferResponse.body.sender.balance).toBe(30);
  });

  test("取得交易紀錄", async () => {
    const response = await request.get("/api/transactions");
    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.transactions).toBeInstanceOf(Array);
  });
});
