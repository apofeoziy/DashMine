# DashMine Deployment Guide

## 🚀 Быстрый старт с Docker

### 1. Установка зависимостей
```bash
npm run install:all
```

### 2. Сборка проекта
```bash
npm run build
```

### 3. Запуск через Docker Compose (рекомендуется)
```bash
docker-compose up -d
```

### 4. Запуск через Docker вручную
```bash
# Сборка образа
npm run docker:build

# Запуск контейнера
npm run docker:run
```

## 📦 Структура проекта

- **Backend API** (порт 3000) - Node.js/Express сервер
- **Frontend** (порт 3001) - Next.js приложение

## 🔧 Доступные команды

### Разработка
```bash
npm run dev              # Запуск backend в dev режиме
cd neweb && npm run dev  # Запуск frontend в dev режиме
```

### Продакшн
```bash
npm start                # Запуск backend
npm run build            # Сборка Next.js приложения
```

### Docker
```bash
npm run docker:build     # Сборка Docker образа
npm run docker:push      # Push в Docker Hub
npm run docker:run       # Запуск контейнера
npm run docker:stop      # Остановка контейнера
npm run docker:remove    # Удаление контейнера
npm run deploy           # Полный деплой (build + docker:build + docker:push)
```

## 🌐 Доступ к приложению

После запуска:
- Frontend: http://localhost:3001
- Backend API: http://localhost:3000/api

## 📝 Конфигурация

Создайте файлы конфигурации:
- `config.json` - основная конфигурация
- `users.json` - пользователи системы

## 🔒 Volumes

Docker Compose монтирует следующие директории:
- `./servers` - данные серверов Minecraft
- `./logs` - логи приложения
- `./backups` - резервные копии
- `./config.json` - конфигурация
- `./users.json` - пользователи

## ⚙️ Переменные окружения

```bash
NODE_ENV=production
```

## 🛠️ Troubleshooting

### Порты заняты
Измените порты в `docker-compose.yml`:
```yaml
ports:
  - "YOUR_PORT:3000"
  - "YOUR_PORT:3001"
```

### Проблемы с правами доступа
```bash
sudo chown -R $USER:$USER servers/ logs/ backups/
```

### Очистка Docker
```bash
docker system prune -a
```

## 📊 Мониторинг

Просмотр логов:
```bash
docker-compose logs -f dashmine
```

Статус контейнера:
```bash
docker ps
```
