FROM python:3.9-slim

# 避免中途卡住互動提示 + 安裝常用系統工具
ENV DEBIAN_FRONTEND=noninteractive
RUN apt-get update && apt-get install -y \
    build-essential \
    libpq-dev \
    default-libmysqlclient-dev \
    gcc \
    curl \
    && rm -rf /var/lib/apt/lists/*

# 設置環境變量
ENV PYTHONUNBUFFERED 1
ENV PYTHONDONTWRITEBYTECODE 1

WORKDIR /app

# 升級 pip 套件管理工具
RUN pip install --upgrade pip setuptools wheel

# 安裝 Python 依賴
COPY ./requirements.txt /app/requirements.txt


RUN pip install --no-cache-dir -r /app/requirements.txt

# 複製 Django 專案所有檔案
COPY . .
