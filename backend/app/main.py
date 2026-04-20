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


@app.post("/api/internal/reset-admin")
def reset_admin(request: Request):
    from fastapi import HTTPException
    secret = os.getenv("SEED_SECRET", "")
    provided = request.headers.get("x-seed-secret", "")
    if not secret or provided != secret:
        raise HTTPException(status_code=403, detail="Forbidden")
    try:
        from app.database import SessionLocal
        from app.models import Admin
        from app.auth import hash_password
        db = SessionLocal()
        email = os.getenv("ADMIN_EMAIL", "admin@legis-teh.com")
        password = os.getenv("ADMIN_PASSWORD", "changeme123!")
        admin = db.query(Admin).first()
        if admin:
            admin.email = email
            admin.password_hash = hash_password(password)
        else:
            db.add(Admin(email=email, password_hash=hash_password(password)))
        db.commit()
        db.close()
        return {"ok": True, "email": email}
    except Exception as e:
        return {"ok": False, "error": str(e)}


@app.post("/api/internal/seed")
def run_seed(request: Request):
    from fastapi import HTTPException
    secret = os.getenv("SEED_SECRET", "")
    provided = request.headers.get("x-seed-secret", "")
    if not secret or provided != secret:
        raise HTTPException(status_code=403, detail="Forbidden")
    try:
        from app.database import SessionLocal
        from app.models import Setting, Service, Offer, Partner, Stat
        db = SessionLocal()
        inserted = []

        settings_data = {
            "phone": "8 495 128-13-18",
            "phone_href": "tel:84951281318",
            "email": "info@legis-teh.com",
            "address": "101000, Москва, Большой Златоустинский переулок, дом 7, строение 1",
            "work_hours_weekdays": "Пн-Чт: 9:30–18:00",
            "work_hours_friday": "Пт: 9:30–17:00",
            "company_name": 'ООО "ЛЕГИС-ТЕХ"',
            "copyright_year": "2008",
            "meta_title": 'Технические средства охраны: ТСО от компании "Легис-Тех"',
            "meta_description": "Проектирование, монтаж и обслуживание ТСО: систем видеонаблюдения, СКУД, охранной и пожарной сигнализации.",
            "yandex_maps_api_key": "",
            "map_lat": "55.757222",
            "map_lon": "37.635556",
            "hero_title": "Технические средства безопасности",
            "hero_text": "Группа компаний «ЛЕГИС» предлагает расширенный комплекс услуг пультовой охраны.",
            "about_title": "Технические средства безопасности",
            "about_text": "«ЛЕГИС» предлагает комплексные системы для обеспечения безопасности объектов любой сложности «под ключ».",
            "seo_text_title": "ЧОП Легис: знакомство с лучшим охранным предприятием Москвы",
            "seo_text": "Группа компаний Легис с 1993 года занимается различными видами охранной деятельности.",
        }
        for key, value in settings_data.items():
            if not db.query(Setting).filter(Setting.key == key).first():
                db.add(Setting(key=key, value=value))
        db.commit()
        inserted.append("settings")

        if not db.query(Stat).first():
            for value, label, order in [
                ("15+", "лет опыта за нашими плечами", 0),
                ("1000+", "реализованных проектов", 1),
                ("100+", "км протянутых кабелей", 2),
                ("5000+", "единиц установленного оборудования", 3),
            ]:
                db.add(Stat(value=value, label=label, sort_order=order))
            db.commit()
            inserted.append("stats")

        if not db.query(Service).first():
            for s in [
                {"slug": "skud", "title": "Системы контроля и управления доступом", "description": "Проектирование, монтаж и обслуживание СКУД любой сложности", "icon_url": "/upload/iblock/ef2/bxahnleutesjla5negi2gjifbqipnx9w.svg", "sort_order": 0, "meta_title": "СКУД — монтаж и обслуживание", "meta_description": "Проектирование, монтаж и обслуживание СКУД.", "content_design": "", "content_install": "", "content_maintain": ""},
                {"slug": "videonablyudenie", "title": "Видеонаблюдение", "description": "Системы видеонаблюдения для объектов любого масштаба", "icon_url": "/upload/iblock/a9d/7hfvfqpt9ooz1na54zbuqfq92de4bwia.svg", "sort_order": 1, "meta_title": "Видеонаблюдение — монтаж и обслуживание", "meta_description": "Проектирование, монтаж и обслуживание систем видеонаблюдения.", "content_design": "", "content_install": "", "content_maintain": ""},
                {"slug": "pozharnaya-bezopasnost", "title": "Системы противопожарной безопасности", "description": "Пожарная сигнализация, пожаротушение, оповещение", "icon_url": "/upload/iblock/295/r12rlwq018jjrdzgr67j85occ583c07s.svg", "sort_order": 2, "meta_title": "Пожарная безопасность — монтаж", "meta_description": "Проектирование, монтаж и обслуживание систем пожарной безопасности.", "content_design": "", "content_install": "", "content_maintain": ""},
                {"slug": "okhrannaya-signalizatsiya", "title": "Охранная сигнализация", "description": "Охранные системы для защиты объектов", "icon_url": "/upload/iblock/e9b/n2qglyit7uzuz44dtho033rc0vwocjet.svg", "sort_order": 3, "meta_title": "Охранная сигнализация — монтаж", "meta_description": "Проектирование, монтаж и обслуживание охранной сигнализации.", "content_design": "", "content_install": "", "content_maintain": ""},
                {"slug": "kompleksnye-sistemy-bezopasnosti", "title": "Комплексные системы безопасности", "description": "Интегрированные решения безопасности", "icon_url": "/upload/iblock/c66/kdxffdml9l4zax7k7edaoyf0rlhuib43.svg", "sort_order": 4, "meta_title": "Комплексные системы безопасности", "meta_description": "Проектирование и монтаж комплексных систем безопасности.", "content_design": "", "content_install": "", "content_maintain": ""},
            ]:
                db.add(Service(**s))
            db.commit()
            inserted.append("services")

        if not db.query(Offer).first():
            for title, desc, order in [
                ("Скидка 10%", "при заключении договора на монтаж от 5 видеокамер", 0),
                ("3 месяца ТО за наш счет", "при заключении договоров на монтаж и техническое обслуживание охранной сигнализации", 1),
                ("Скидка 40%", "на проектирование при заключении договора на монтаж системы пожарной безопасности", 2),
                ("2 месяца ТО в подарок", "при заключении договора на ТО СКУД и предоплате за 12 месяцев", 3),
                ("3 месяца ТО бесплатно", "при заключении договоров на монтаж и ТО систем видеонаблюдения", 4),
            ]:
                db.add(Offer(title=title, description=desc, sort_order=order))
            db.commit()
            inserted.append("offers")

        if not db.query(Partner).first():
            for name, logo_url, order in [
                ("ПраймФинанс", "/upload/iblock/7ff/8t6hsqpbxv7pde2q6v1oh4gxq6mud4rq.webp", 0),
                ("УралСиб", "/upload/iblock/0fc/qliz5o5x6qtcxceotskyzeha0dgrpbsa.webp", 1),
                ("OTP Bank", "/upload/iblock/150/le2bztzkzskz498zj5e7w2go9sa3a396.webp", 2),
                ("ПП Production", "/upload/iblock/c4c/rqbc2svej874gvyk70ihrenujamv3zzt.webp", 3),
                ("КИТФинанс Брокер", "/upload/iblock/2bf/255wczd6p6gvgymqz7bkg71ggoyitm3b.webp", 4),
                ("AMTEL", "/upload/iblock/b3e/jhafhrq1khydc8ggjwrqwr8sz90yo3ni.webp", 5),
            ]:
                db.add(Partner(name=name, logo_url=logo_url, sort_order=order))
            db.commit()
            inserted.append("partners")

        db.close()
        return {"ok": True, "inserted": inserted}
    except Exception as e:
        return {"ok": False, "error": str(e)}
