# 使用官方Node.js鏡像
FROM node:18-alpine

# 設置工作目錄
WORKDIR /app

# 複製package.json和package-lock.json
COPY package*.json ./

# 安裝依賴
RUN npm install

# 複製所有文件
COPY . .

# 暴露端口
EXPOSE 3000

# 啟動開發服務器
CMD ["npm", "run", "dev"]