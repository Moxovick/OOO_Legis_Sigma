@echo off
set /p SITE_URL=Введи URL сайта на Vercel (например https://sigma-profi.vercel.app):

echo.
echo Создаём admin-аккаунт...
curl -s -X POST "%SITE_URL%/api/internal/seed" -H "x-seed-secret: sigma-seed-secret-2024" -H "Content-Type: application/json"
echo.
echo.
echo Готово! Теперь можешь войти в админку:
echo %SITE_URL%/admin
echo Логин: admin@sigma-profi.org
echo Пароль: changeme123!
pause
