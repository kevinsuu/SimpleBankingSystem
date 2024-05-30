# InvertBinaryTree.js

## 敘述

- 此程式為反轉二元樹。給予一個二元樹的根節點，並將所有的子節點進行左右反轉。

## 運行

- node InvertBinaryTree.js

# SimpleBankingSystem

## 部署方式

1. docker-compose up --build -d
2. 可以匯入 BankingSystem.postman_collection.json 進 postman
3. Call API Example

## 測試

1. docker-compose down ps.Dockerfile 內也有進行 npm test
2. npm test

## API 相關說明

1.  創建帳戶
    - 路徑：POST /accounts
    - 說明：需要提供用戶名和初始餘額。初始餘額不能為負。
    - Request Body 範例：{ "name": "John Doe", "balance": 100 }
    - Response ：返回 201 狀態碼和帳戶的詳細資訊；如果初始餘額，則返回 400 狀態碼。
2.  存錢至帳戶
    - 路徑：POST /accounts/:id/deposit
    - 參數：需替換 :id 為實際的帳戶 ID。
    - 功能：需要提供存入的金額。
    - Request Body 範例：{ "amount": 50 }
    - Response：返回 200 狀態碼和更新後的帳戶資訊；如果查無此帳號，則返回 404 狀態碼。
3.  從帳戶提款
    - 路徑：POST /accounts/:1d/withdraw
    - 參數：需要替換 :id 為實際的帳戶 ID。
    - 說明：需要提供提取的金額。
    - Request Body：{ "amount": 30 }
    - Response：如果帳戶餘額足夠，應該返回 200 狀態碼和更新後的帳戶資訊；如果餘額不足，則返回 400 狀態碼；如果查無此帳號，則返回 404 狀態碼。
4.  帳戶間轉賬
    - 路徑：POST /accounts/transfer
    - 說明：需要提供轉出帳戶 ID、轉入帳戶 ID 和轉賬金額。
    - Request Body：{ "senderId": "id1", "recipientId": "id2", "amount": 20 }
    - Response：如果兩個帳戶均存在且轉出帳戶餘額足夠，應該返回 200 狀態碼和單筆交易紀錄；如果餘額不足，則返回 400 狀態碼；如果查無此帳號，則返回 404 狀態碼；如果交易失敗，則返回 500 狀態碼；
5.  查看所有交易記錄
    - 路徑：GET /transactions
    - Response：返回 200 狀態碼和所有交易記錄的列表。
