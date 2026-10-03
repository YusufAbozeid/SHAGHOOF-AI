import os
import tempfile
from sqlalchemy import create_engine
from sqlalchemy.orm import DeclarativeBase, sessionmaker

from .config import settings

db_url = getattr(settings, "DATABASE_URL", None) or os.getenv("DATABASE_URL")
if not db_url:
    if os.getenv("VERCEL"):
        db_path = os.path.join(tempfile.gettempdir(), "edumind_activity.sqlite3")
        db_url = f"sqlite:///{db_path}"
    else:
        db_url = "sqlite:///./edumind_activity.sqlite3"

connect_args = {"check_same_thread": False} if db_url.startswith("sqlite") else {}
engine = create_engine(db_url, connect_args=connect_args, pool_pre_ping=True)
SessionLocal = sessionmaker(bind=engine, autoflush=False, autocommit=False, expire_on_commit=False)


class Base(DeclarativeBase):
    pass


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
