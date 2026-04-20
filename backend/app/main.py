from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from slowapi import Limiter, _rate_limit_exceeded_handler
from slowapi.util import get_remote_address
from slowapi.errors import RateLimitExceeded
from dotenv import load_dotenv
import os

load_dotenv()

from app.database import engine, SessionLocal
from app.models import Base
Base.metadata.create_all(bind=engine, checkfirst=True)

# Auto-seed on first startup (creates admin + fills DB if empty)
def _auto_seed():
    try:
        from app.models import Admin
        from app.auth import hash_password
        db = SessionLocal()
        if not db.query(Admin).first():
            email = os.getenv("ADMIN_EMAIL", "admin@legis-teh.com")
            password = os.getenv("ADMIN_PASSWORD", "changeme123!")
            db.add(Admin(email=email, password_hash=hash_password(password)))
            db.commit()
        db.close()
        # Seed the rest of the data
        from app import seed as _seed_module  # noqa: F401
    except Exception:
        pass  # Don't crash startup if seed fails

_auto_seed()

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
    if "server" in response.headers:
        del response.headers["server"]
    return response

# Routers
app.include_router(public.router)
app.include_router(leads.router)
app.include_router(admin.router)


@app.get("/api/health")
def health():
    return {"status": "ok"}
