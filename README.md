# 🍽️ Restaurant Order System

![CI/CD](https://github.com/Snookerrio/labb6/actions/workflows/ci.yml/badge.svg)
![Node.js](https://img.shields.io/badge/node-20--alpine-green)
![Docker](https://img.shields.io/badge/docker-compose-blue)

REST API для системи управління замовленнями ресторану.  
**Стек:** Node.js 20, Express, Jest, Docker, MongoDB, GitHub Actions.

---

## 🚀 Запуск через Docker (рекомендовано)

```bash
# 1. Клонувати репозиторій
git clone https://github.com/Snookerrio/labb6.git
cd labb6

# 2. Скопіювати змінні середовища
cp .env.example .env

# 3. Запустити додаток + MongoDB
docker compose up -d

# 4. Перевірити статус
curl http://localhost:3000/health
```

Зупинити:
```bash
docker compose down
```

Запустити тести в Docker:
```bash
docker compose --profile test up tests
```

---

## 💻 Локальний запуск (без Docker)

```bash
npm install
npm start        # запуск сервера на порту 3000
npm test         # запуск тестів
```

---

## 🌍 Змінні середовища

| Змінна | За замовчуванням | Опис |
|--------|-----------------|------|
| `PORT` | `3000` | Порт HTTP-сервера |
| `NODE_ENV` | `development` | Середовище (`development` / `production` / `test`) |
| `DB_HOST` | `mongo` | Хост MongoDB (ім'я сервісу в docker-compose) |
| `DB_PORT` | `27017` | Порт MongoDB |
| `DB_NAME` | `restaurant` | Назва бази даних |
| `DB_USER` | `admin` | Логін MongoDB |
| `DB_PASS` | `secret` | Пароль MongoDB |

---

## 📡 API Endpoints

| Метод | URL | Опис |
|-------|-----|------|
| GET | `/health` | Перевірка стану сервера |
| GET | `/menu` | Отримати всі страви |
| POST | `/menu` | Додати страву `{ "name": "Паста", "price": 130 }` |
| POST | `/customers` | Зареєструвати клієнта `{ "name": "Юрій", "email": "y@ua.com" }` |
| POST | `/orders` | Розмістити замовлення `{ "customerName": "Юрій", "dishes": ["Піца Маргарита"] }` |
| GET | `/orders` | Отримати всі замовлення |
| GET | `/kitchen/notifications` | Сповіщення кухні |

### Приклади запитів (curl):

```bash
# Зареєструвати клієнта
curl -X POST http://localhost:3000/customers \
  -H "Content-Type: application/json" \
  -d '{"name":"Юрій","email":"y@mail.com"}'

# Відповідь:
# { "customer": { "name": "Юрій", "email": "y@mail.com" } }

# Додати страву до меню
curl -X POST http://localhost:3000/menu \
  -H "Content-Type: application/json" \
  -d '{"name":"Паста","price":130}'

# Розмістити замовлення
curl -X POST http://localhost:3000/orders \
  -H "Content-Type: application/json" \
  -d '{"customerName":"Юрій","dishes":["Піца Маргарита","Борщ"]}'

# Відповідь:
# { "order": { "customer": "Юрій", "items": [...], "total": 235, "status": "placed" } }

# Переглянути всі замовлення
curl http://localhost:3000/orders

# Переглянути сповіщення кухні
curl http://localhost:3000/kitchen/notifications

# Перевірити здоров'я сервера
curl http://localhost:3000/health
# { "status": "ok", "uptime": 42.3 }
```

---

## 🧪 Тести

```bash
# Запуск тестів локально
npm test

# З покриттям коду
npx jest --coverage 

# Тести в Docker-контейнері
docker compose --profile test up tests
```

