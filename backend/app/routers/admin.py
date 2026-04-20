from fastapi import APIRouter, Depends, HTTPException, status, Query, Request
from sqlalchemy.orm import Session
from slowapi import Limiter
from slowapi.util import get_remote_address
from app.database import get_db
from app.models import Admin, Setting, Service, Offer, Partner, Stat, Lead, PageContent
from app.schemas import (
    LoginIn, TokenOut, RefreshIn,
    SettingsBulkIn, SettingOut,
    ServiceIn, ServiceUpdate, ServiceOut, ServiceDetailOut,
    OfferIn, OfferUpdate, OfferOut,
    PartnerIn, PartnerUpdate, PartnerOut,
    StatIn, StatUpdate, StatOut,
    LeadOut, LeadListOut,
    PageContentOut, PageContentIn,
)
from app.auth import verify_password, create_access_token, create_refresh_token, rotate_refresh_token, get_current_admin
import os

router = APIRouter(prefix="/api/admin", tags=["admin"])
limiter = Limiter(key_func=get_remote_address)


# ── Auth ──────────────────────────────────────────────────────────────────────

@router.post("/login", response_model=TokenOut)
@limiter.limit("5/minute")
def login(request: Request, payload: LoginIn, db: Session = Depends(get_db)):
    admin = db.query(Admin).filter(Admin.email == payload.email).first()
    if not admin or not verify_password(payload.password, admin.password_hash):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Неверный email или пароль")
    access = create_access_token(admin.id)
    refresh = create_refresh_token(admin.id, db)
    return TokenOut(access_token=access, refresh_token=refresh)


@router.post("/refresh", response_model=TokenOut)
@limiter.limit("10/minute")
def refresh(request: Request, payload: RefreshIn, db: Session = Depends(get_db)):
    access, refresh = rotate_refresh_token(payload.refresh_token, db)
    return TokenOut(access_token=access, refresh_token=refresh)


@router.post("/logout")
def logout(payload: RefreshIn, db: Session = Depends(get_db), _=Depends(get_current_admin)):
    from app.models import RefreshToken
    record = db.query(RefreshToken).filter(RefreshToken.token == payload.refresh_token).first()
    if record:
        db.delete(record)
        db.commit()
    return {"ok": True}


# ── Settings ──────────────────────────────────────────────────────────────────

@router.get("/settings", response_model=list[SettingOut])
def admin_get_settings(db: Session = Depends(get_db), _=Depends(get_current_admin)):
    return db.query(Setting).all()


@router.patch("/settings")
def admin_update_settings(
    payload: SettingsBulkIn,
    db: Session = Depends(get_db),
    _=Depends(get_current_admin),
):
    for key, value in payload.settings.items():
        record = db.query(Setting).filter(Setting.key == key).first()
        if record:
            record.value = value
        else:
            db.add(Setting(key=key, value=value))
    db.commit()
    return {"ok": True}


# ── Services ──────────────────────────────────────────────────────────────────

@router.get("/services", response_model=list[ServiceDetailOut])
def admin_get_services(db: Session = Depends(get_db), _=Depends(get_current_admin)):
    return db.query(Service).order_by(Service.sort_order).all()


@router.post("/services", response_model=ServiceDetailOut, status_code=201)
def admin_create_service(payload: ServiceIn, db: Session = Depends(get_db), _=Depends(get_current_admin)):
    if db.query(Service).filter(Service.slug == payload.slug).first():
        raise HTTPException(status_code=400, detail="Slug уже занят")
    service = Service(**payload.model_dump())
    db.add(service)
    db.commit()
    db.refresh(service)
    return service


@router.patch("/services/{service_id}", response_model=ServiceDetailOut)
def admin_update_service(
    service_id: int,
    payload: ServiceUpdate,
    db: Session = Depends(get_db),
    _=Depends(get_current_admin),
):
    service = db.query(Service).filter(Service.id == service_id).first()
    if not service:
        raise HTTPException(status_code=404, detail="Не найдено")
    for field, value in payload.model_dump(exclude_none=True).items():
        setattr(service, field, value)
    db.commit()
    db.refresh(service)
    return service


@router.delete("/services/{service_id}", status_code=204)
def admin_delete_service(service_id: int, db: Session = Depends(get_db), _=Depends(get_current_admin)):
    service = db.query(Service).filter(Service.id == service_id).first()
    if not service:
        raise HTTPException(status_code=404, detail="Не найдено")
    db.delete(service)
    db.commit()


# ── Offers ────────────────────────────────────────────────────────────────────

@router.get("/offers", response_model=list[OfferOut])
def admin_get_offers(db: Session = Depends(get_db), _=Depends(get_current_admin)):
    return db.query(Offer).order_by(Offer.sort_order).all()


@router.post("/offers", response_model=OfferOut, status_code=201)
def admin_create_offer(payload: OfferIn, db: Session = Depends(get_db), _=Depends(get_current_admin)):
    offer = Offer(**payload.model_dump())
    db.add(offer)
    db.commit()
    db.refresh(offer)
    return offer


@router.patch("/offers/{offer_id}", response_model=OfferOut)
def admin_update_offer(offer_id: int, payload: OfferUpdate, db: Session = Depends(get_db), _=Depends(get_current_admin)):
    offer = db.query(Offer).filter(Offer.id == offer_id).first()
    if not offer:
        raise HTTPException(status_code=404, detail="Не найдено")
    for field, value in payload.model_dump(exclude_none=True).items():
        setattr(offer, field, value)
    db.commit()
    db.refresh(offer)
    return offer


@router.delete("/offers/{offer_id}", status_code=204)
def admin_delete_offer(offer_id: int, db: Session = Depends(get_db), _=Depends(get_current_admin)):
    offer = db.query(Offer).filter(Offer.id == offer_id).first()
    if not offer:
        raise HTTPException(status_code=404, detail="Не найдено")
    db.delete(offer)
    db.commit()


# ── Partners ──────────────────────────────────────────────────────────────────

@router.get("/partners", response_model=list[PartnerOut])
def admin_get_partners(db: Session = Depends(get_db), _=Depends(get_current_admin)):
    return db.query(Partner).order_by(Partner.sort_order).all()


@router.post("/partners", response_model=PartnerOut, status_code=201)
def admin_create_partner(payload: PartnerIn, db: Session = Depends(get_db), _=Depends(get_current_admin)):
    partner = Partner(**payload.model_dump())
    db.add(partner)
    db.commit()
    db.refresh(partner)
    return partner


@router.patch("/partners/{partner_id}", response_model=PartnerOut)
def admin_update_partner(partner_id: int, payload: PartnerUpdate, db: Session = Depends(get_db), _=Depends(get_current_admin)):
    partner = db.query(Partner).filter(Partner.id == partner_id).first()
    if not partner:
        raise HTTPException(status_code=404, detail="Не найдено")
    for field, value in payload.model_dump(exclude_none=True).items():
        setattr(partner, field, value)
    db.commit()
    db.refresh(partner)
    return partner


@router.delete("/partners/{partner_id}", status_code=204)
def admin_delete_partner(partner_id: int, db: Session = Depends(get_db), _=Depends(get_current_admin)):
    partner = db.query(Partner).filter(Partner.id == partner_id).first()
    if not partner:
        raise HTTPException(status_code=404, detail="Не найдено")
    db.delete(partner)
    db.commit()


# ── Stats ─────────────────────────────────────────────────────────────────────

@router.get("/stats", response_model=list[StatOut])
def admin_get_stats(db: Session = Depends(get_db), _=Depends(get_current_admin)):
    return db.query(Stat).order_by(Stat.sort_order).all()


@router.patch("/stats/{stat_id}", response_model=StatOut)
def admin_update_stat(stat_id: int, payload: StatUpdate, db: Session = Depends(get_db), _=Depends(get_current_admin)):
    stat = db.query(Stat).filter(Stat.id == stat_id).first()
    if not stat:
        raise HTTPException(status_code=404, detail="Не найдено")
    for field, value in payload.model_dump(exclude_none=True).items():
        setattr(stat, field, value)
    db.commit()
    db.refresh(stat)
    return stat


# ── Leads ─────────────────────────────────────────────────────────────────────

@router.get("/leads", response_model=LeadListOut)
def admin_get_leads(
    page: int = Query(1, ge=1),
    per_page: int = Query(25, ge=1, le=100),
    is_read: bool | None = Query(None),
    form_type: str | None = Query(None),
    db: Session = Depends(get_db),
    _=Depends(get_current_admin),
):
    q = db.query(Lead)
    if is_read is not None:
        q = q.filter(Lead.is_read == is_read)
    if form_type:
        q = q.filter(Lead.form_type == form_type)
    total = q.count()
    items = q.order_by(Lead.created_at.desc()).offset((page - 1) * per_page).limit(per_page).all()
    return LeadListOut(items=items, total=total, page=page, per_page=per_page)


@router.patch("/leads/{lead_id}/read")
def admin_mark_lead_read(lead_id: int, db: Session = Depends(get_db), _=Depends(get_current_admin)):
    lead = db.query(Lead).filter(Lead.id == lead_id).first()
    if not lead:
        raise HTTPException(status_code=404, detail="Не найдено")
    lead.is_read = True
    db.commit()
    return {"ok": True}


@router.delete("/leads/{lead_id}", status_code=204)
def admin_delete_lead(lead_id: int, db: Session = Depends(get_db), _=Depends(get_current_admin)):
    lead = db.query(Lead).filter(Lead.id == lead_id).first()
    if not lead:
        raise HTTPException(status_code=404, detail="Не найдено")
    db.delete(lead)
    db.commit()


# ── Page Content ──────────────────────────────────────────────────────────────

@router.get("/pages/{slug}", response_model=PageContentOut)
def admin_get_page(slug: str, db: Session = Depends(get_db), _=Depends(get_current_admin)):
    record = db.query(PageContent).filter(PageContent.slug == slug).first()
    return PageContentOut(slug=slug, data=record.data if record else "{}")


@router.put("/pages/{slug}")
def admin_update_page(
    slug: str,
    payload: PageContentIn,
    db: Session = Depends(get_db),
    _=Depends(get_current_admin),
):
    import json
    try:
        json.loads(payload.data)
    except Exception:
        raise HTTPException(status_code=400, detail="Неверный формат данных (не JSON)")
    record = db.query(PageContent).filter(PageContent.slug == slug).first()
    if record:
        record.data = payload.data
    else:
        db.add(PageContent(slug=slug, data=payload.data))
    db.commit()
    return {"ok": True}
