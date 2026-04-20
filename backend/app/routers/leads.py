from fastapi import APIRouter, Depends, Request
from sqlalchemy.orm import Session
from slowapi import Limiter
from slowapi.util import get_remote_address
from app.database import get_db
from app.models import Lead
from app.schemas import LeadIn

router = APIRouter(prefix="/api", tags=["leads"])
limiter = Limiter(key_func=get_remote_address)


@router.post("/leads", status_code=201)
@limiter.limit("5/minute")
def create_lead(request: Request, payload: LeadIn, db: Session = Depends(get_db)):
    lead = Lead(
        name=payload.name,
        phone=payload.phone,
        message=payload.message,
        form_type=payload.form_type,
    )
    db.add(lead)
    db.commit()
    return {"ok": True, "message": "Заявка принята"}
