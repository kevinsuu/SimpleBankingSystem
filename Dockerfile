FROM node:14

# Create app directory
WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install


COPY . .
# 執行測試
RUN npm test
RUN echo "測試成功"

EXPOSE 5000
CMD [ "node", "app.js" ]
