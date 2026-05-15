# Sigma-Profi — Инструкция по запуску

## Локальная разработка

### 1. Backend

```bash
cd backend

# Создать .env из примера
cp .env.example .env
# Отредактировать .env: указать DATABASE_URL, SECRET_KEY

# Установить зависимости
pip install -r requirements.txt

# Запустить миграции
alembic upgrade head

# Заполнить базу начальными данными
python -m app.seed

# Запустить сервер
uvicorn app.main:app --reload --port 8000
```

API доступен: http://localhost:8000/api/docs

### 2. Frontend

```bash
cd frontend

# .env.local уже создан, BACKEND_URL=http://localhost:8000

npm install
npm run dev
```

Сайт: http://localhost:3000  
Админка: http://localhost:3000/admin  
Логин по умолчанию: `admin@sigma-profi.org` / `changeme123!`

**Сразу смени пароль через базу данных или добавь эндпоинт смены пароля.**

---

## Продакшн (Ubuntu VPS)

### Требования
- Ubuntu 22.04
- Nginx
- Node.js 20+
- Python 3.11+
- PostgreSQL
- PM2 (`npm i -g pm2`)
- Certbot (для HTTPS)

### 1. База данных

```sql
CREATE USER sigma_user WITH PASSWORD 'StrongPassword';
CREATE DATABASE sigma_db OWNER sigma_user;
```

### 2. Backend

```bash
# Скопировать проект в /var/www/sigma-new/
cp .env.example .env
# Настроить DATABASE_URL, SECRET_KEY, CORS_ORIGINS=https://sigma-profi.org
# ADMIN_PASSWORD=ВашПарольАдмина

bash deploy/start-backend.sh
```

### 3. Frontend

```bash
cd frontend
# Настроить .env.local: BACKEND_URL=http://127.0.0.1:8000

npm install
npm run build
pm2 start ../deploy/ecosystem.config.js
pm2 save
pm2 startup
```

### 4. Nginx

```bash
cp deploy/nginx.conf /etc/nginx/sites-available/sigma-profi.org
ln -s /etc/nginx/sites-available/sigma-profi.org /etc/nginx/sites-enabled/
nginx -t && systemctl reload nginx
```

### 5. HTTPS (Let's Encrypt)

```bash
certbot --nginx -d sigma-profi.org -d www.sigma-profi.org
```

---

## Структура проекта

```
sigma-new/
├── backend/
│   ├── app/
│   │   ├── main.py          — FastAPI app
│   │   ├── models.py        — SQLAlchemy модели
│   │   ├── schemas.py       — Pydantic схемы
│   │   ├── auth.py          — JWT авторизация
│   │   ├── database.py      — подключение к БД
│   │   ├── seed.py          — начальное заполнение БД
│   │   └── routers/
│   │       ├── public.py    — публичные эндпоинты
│   │       ├── admin.py     — эндпоинты админки
│   │       └── leads.py     — приём заявок
│   ├── alembic/             — миграции
│   ├── requirements.txt
│   └── .env.example
├── frontend/
│   ├── app/
│   │   ├── page.tsx         — Главная
│   │   ├── about/           — О компании
│   │   ├── services/        — Услуги + [slug]
│   │   ├── contacts/        — Контакты
│   │   ├── prices/          — Цены
│   │   ├── terms/           — Политика
│   │   └── admin/           — Панель управления
│   ├── components/
│   │   ├── layout/          — Header, Footer, SiteLayout
│   │   ├── sections/        — секции страниц
│   │   └── ui/              — Modal
│   ├── lib/
│   │   ├── api.ts           — API клиент
│   │   └── adminAuth.ts     — JWT хранение
│   └── public/
│       ├── css/             — styles.min.css (оригинальный)
│       ├── fonts/           — NTSomic шрифты
│       ├── images/          — логотип, спрайты, фото
│       └── upload/          — изображения с оригинала
├── deploy/
│   ├── nginx.conf
│   ├── ecosystem.config.js
│   └── start-backend.sh
└── SETUP.md
```

## Что управляется через админку

| Раздел | Что можно менять |
|--------|-----------------|
| Заявки | Просмотр, пометка прочитанными, удаление |
| Настройки | Телефон, email, адрес, часы работы, тексты |
| Услуги | Описания, тексты вкладок, meta-теги, иконки (URL) |
| Акции | Добавить/изменить/удалить акции |
| Партнёры | Добавить/изменить/удалить с загрузкой логотипа |
| Цифры | Редактировать 4 показателя компании |
