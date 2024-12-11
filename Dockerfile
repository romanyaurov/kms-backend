# Используем официальный образ Node.js v20
FROM node:20

# Установить рабочую директорию
WORKDIR /app

# Копировать весь проект
COPY . .

# Установка зависимостей
RUN npm install

# Выполнить билд
RUN npm run build

# Команда запуска
CMD ["npm", "start"]