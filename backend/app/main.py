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

def _init_db():
    """Create tables and seed data — wrapped so startup never crashes."""
    try:
        Base.metadata.create_all(bind=engine, checkfirst=True)
    except Exception:
        return  # DB not reachable — don't crash, requests will fail naturally
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
        from app import seed as _seed_module  # noqa: F401
    except Exception:
        pass

_init_db()

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


@app.post("/api/internal/seed")
def run_seed(request: Request):
    secret = os.getenv("SEED_SECRET", "")
    provided = request.headers.get("x-seed-secret", "")
    if not secret or provided != secret:
        from fastapi import HTTPException
        raise HTTPException(status_code=403, detail="Forbidden")
    try:
        import importlib
        import app.seed as seed_module
        importlib.reload(seed_module)
        return {"ok": True, "message": "Seed completed"}
    except Exception as e:
        return {"ok": False, "error": str(e)}
