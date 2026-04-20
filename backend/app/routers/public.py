from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.database import get_db
from app.models import Setting, Service, Offer, Partner, Stat, PageContent
from app.schemas import SettingOut, ServiceOut, ServiceDetailOut, OfferOut, PartnerOut, StatOut, PageContentOut

router = APIRouter(prefix="/api", tags=["public"])


@router.get("/settings", response_model=list[SettingOut])
def get_settings(db: Session = Depends(get_db)):
    return db.query(Setting).all()


@router.get("/services", response_model=list[ServiceOut])
def get_services(db: Session = Depends(get_db)):
    return (
        db.query(Service)
        .filter(Service.is_active == True)
        .order_by(Service.sort_order)
        .all()
    )


@router.get("/services/{slug}", response_model=ServiceDetailOut)
def get_service(slug: str, db: Session = Depends(get_db)):
    from fastapi import HTTPException, status
    service = (
        db.query(Service)
        .filter(Service.slug == slug, Service.is_active == True)
        .first()
    )
    if not service:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Услуга не найдена")
    return service


@router.get("/offers", response_model=list[OfferOut])
def get_offers(db: Session = Depends(get_db)):
    return (
        db.query(Offer)
        .filter(Offer.is_active == True)
        .order_by(Offer.sort_order)
        .all()
    )


@router.get("/partners", response_model=list[PartnerOut])
def get_partners(db: Session = Depends(get_db)):
    return (
        db.query(Partner)
        .filter(Partner.is_active == True)
        .order_by(Partner.sort_order)
        .all()
    )


@router.get("/stats", response_model=list[StatOut])
def get_stats(db: Session = Depends(get_db)):
    return db.query(Stat).order_by(Stat.sort_order).all()


@router.get("/pages/{slug}", response_model=PageContentOut)
def get_page_content(slug: str, db: Session = Depends(get_db)):
    record = db.query(PageContent).filter(PageContent.slug == slug).first()
    if not record:
        return PageContentOut(slug=slug, data="{}")
    return record
