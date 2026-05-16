from sqlalchemy import create_engine
from sqlalchemy.orm import DeclarativeBase, sessionmaker
from dotenv import load_dotenv
import os

load_dotenv()

# Normalize URL: strip sslmode from query string and +psycopg prefix
_raw_url = os.getenv("DATABASE_URL", "postgresql://user:password@localhost:5432/sigma_db")
_url = _raw_url.replace("postgresql+psycopg://", "postgresql://", 1)
# Remove ?sslmode=... from URL — passed via connect_args instead
if "?sslmode=" in _url:
    _url = _url.split("?sslmode=")[0]
DATABASE_URL = _url

# On production (remote Postgres) SSL is required; locally it's disabled
_sslmode = os.getenv("DB_SSLMODE", "disable")

engine = create_engine(
    DATABASE_URL,
    connect_args={"sslmode": _sslmode},
    pool_pre_ping=True,
    pool_size=1,
    max_overflow=0,
    pool_recycle=300,
)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)


class Base(DeclarativeBase):
    pass


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
