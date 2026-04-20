from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import JSONResponse
from slowapi import Limiter, _rate_limit_exceeded_handler
from slowapi.util import get_remote_address
from slowapi.errors import RateLimitExceeded
from dotenv import load_dotenv
import os
from pathlib import Path

load_dotenv()

from app.database import engine
from app.models import Base
# Create any new tables without touching existing ones
Base.metadata.create_all(bind=engine, checkfirst=True)

from app.routers import public, leads, admin

limiter = Limiter(key_func=get_remote_address)

_debug = os.getenv("DEBUG", "false").lower() == "true"

app = FastAPI(
    title="Легис-Тех API",
    version="1.0.0",
    docs_url="/api/docs" if _debug else None,
    redoc_url=None,
    openapi_url="/api/openapi.json" if _debug else None,
)

app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)

# CORS
cors_origins = os.getenv("CORS_ORIGINS", "http://localhost:3000").split(",")
app.add_middleware(
    CORSMiddleware,
    allow_origins=[o.strip() for o in cors_origins],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Security headers middleware
@app.middleware("http")
async def security_headers(request: Request, call_next):
    response = await call_next(request)
    response.headers["X-Content-Type-Options"] = "nosniff"
    response.headers["X-Frame-Options"] = "DENY"
    response.headers["Referrer-Policy"] = "strict-origin-when-cross-origin"
    response.headers["Strict-Transport-Security"] = "max-age=31536000; includeSubDomains"
    response.headers["Permissions-Policy"] = "geolocation=(), microphone=(), camera=()"
    response.headers["X-Permitted-Cross-Domain-Policies"] = "none"
    # Скрыть имя сервера
    if "server" in response.headers:
        del response.headers["server"]
    return response

# Static files for uploads
upload_dir = Path(os.getenv("UPLOAD_DIR", "./uploads"))
upload_dir.mkdir(parents=True, exist_ok=True)
app.mount("/uploads", StaticFiles(directory=str(upload_dir)), name="uploads")

# Routers
app.include_router(public.router)
app.include_router(leads.router)
app.include_router(admin.router)


@app.get("/api/health")
def health():
    return {"status": "ok"}
