from sqlalchemy import create_engine
from sqlalchemy.orm import DeclarativeBase, sessionmaker
from dotenv import load_dotenv
import os

load_dotenv()

DATABASE_URL = os.getenv("DATABASE_URL", "postgresql://user:password@localhost:5432/legis_db")

engine = create_engine(
    DATABASE_URL,
    pool_pre_ping=True,   # reconnect if connection dropped (important for serverless)
    pool_size=1,          # 1 connection per serverless instance
    max_overflow=0,       # no extra connections
    pool_recycle=300,     # recycle connections every 5 min
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
