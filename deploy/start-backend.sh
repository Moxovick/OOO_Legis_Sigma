#!/bin/bash
# Run from /var/www/sigma-new/backend
cd /var/www/sigma-new/backend

# Install deps
pip install -r requirements.txt

# Run migrations
alembic upgrade head

# Seed DB (first time only)
python -m app.seed

# Start FastAPI with gunicorn
gunicorn app.main:app \
  --workers 2 \
  --worker-class uvicorn.workers.UvicornWorker \
  --bind 127.0.0.1:8000 \
  --access-logfile /var/log/sigma-backend.log \
  --error-logfile /var/log/sigma-backend-error.log \
  --daemon
