from pydantic import BaseModel, EmailStr, field_validator, Field
from typing import Optional
from datetime import datetime
import re


# ── Settings ──────────────────────────────────────────────────────────────────

class SettingOut(BaseModel):
    key: str
    value: Optional[str]

ALLOWED_SETTING_KEYS = {
    "phone", "phone_href", "email", "address",
    "work_hours_weekdays", "work_hours_friday",
    "map_lat", "map_lon",
    "about_title", "about_text",
    "meta_title", "meta_description",
}

class SettingsBulkIn(BaseModel):
    settings: dict[str, str]

    @field_validator("settings")
    @classmethod
    def validate_keys(cls, v: dict) -> dict:
        bad = set(v.keys()) - ALLOWED_SETTING_KEYS
        if bad:
            raise ValueError(f"Недопустимые ключи настроек: {', '.join(sorted(bad))}")
        for val in v.values():
            if len(val) > 2000:
                raise ValueError("Значение настройки слишком длинное (макс. 2000 символов)")
        return v


# ── Services ───────────────────────────────────────────────────────────────────

class ServiceOut(BaseModel):
    id: int
    slug: str
    title: str
    description: Optional[str]
    icon_url: Optional[str]
    image_url: Optional[str]
    sort_order: int
    is_active: bool
    meta_title: Optional[str]
    meta_description: Optional[str]

    model_config = {"from_attributes": True}

class ServiceDetailOut(ServiceOut):
    content_design: Optional[str]
    content_install: Optional[str]
    content_maintain: Optional[str]

class ServiceIn(BaseModel):
    slug: str = Field(max_length=100)
    title: str = Field(max_length=255)
    description: Optional[str] = Field(None, max_length=1000)
    icon_url: Optional[str] = Field(None, max_length=500)
    image_url: Optional[str] = Field(None, max_length=500)
    sort_order: int = 0
    is_active: bool = True
    content_design: Optional[str] = Field(None, max_length=100_000)
    content_install: Optional[str] = Field(None, max_length=100_000)
    content_maintain: Optional[str] = Field(None, max_length=100_000)
    meta_title: Optional[str] = Field(None, max_length=255)
    meta_description: Optional[str] = Field(None, max_length=500)

class ServiceUpdate(BaseModel):
    title: Optional[str] = Field(None, max_length=255)
    description: Optional[str] = Field(None, max_length=1000)
    icon_url: Optional[str] = Field(None, max_length=500)
    image_url: Optional[str] = Field(None, max_length=500)
    sort_order: Optional[int] = None
    is_active: Optional[bool] = None
    content_design: Optional[str] = Field(None, max_length=100_000)
    content_install: Optional[str] = Field(None, max_length=100_000)
    content_maintain: Optional[str] = Field(None, max_length=100_000)
    meta_title: Optional[str] = Field(None, max_length=255)
    meta_description: Optional[str] = Field(None, max_length=500)


# ── Offers ────────────────────────────────────────────────────────────────────

class OfferOut(BaseModel):
    id: int
    title: str
    description: Optional[str]
    is_active: bool
    sort_order: int

    model_config = {"from_attributes": True}

class OfferIn(BaseModel):
    title: str = Field(max_length=255)
    description: Optional[str] = Field(None, max_length=1000)
    is_active: bool = True
    sort_order: int = 0

class OfferUpdate(BaseModel):
    title: Optional[str] = Field(None, max_length=255)
    description: Optional[str] = Field(None, max_length=1000)
    is_active: Optional[bool] = None
    sort_order: Optional[int] = None


# ── Partners ──────────────────────────────────────────────────────────────────

class PartnerOut(BaseModel):
    id: int
    name: str
    logo_url: Optional[str]
    sort_order: int
    is_active: bool

    model_config = {"from_attributes": True}

class PartnerIn(BaseModel):
    name: str = Field(max_length=255)
    logo_url: Optional[str] = Field(None, max_length=500)
    sort_order: int = 0
    is_active: bool = True

class PartnerUpdate(BaseModel):
    name: Optional[str] = Field(None, max_length=255)
    logo_url: Optional[str] = Field(None, max_length=500)
    sort_order: Optional[int] = None
    is_active: Optional[bool] = None


# ── Stats ─────────────────────────────────────────────────────────────────────

class StatOut(BaseModel):
    id: int
    value: str
    label: str
    sort_order: int

    model_config = {"from_attributes": True}

class StatIn(BaseModel):
    value: str = Field(max_length=50)
    label: str = Field(max_length=255)
    sort_order: int = 0

class StatUpdate(BaseModel):
    value: Optional[str] = Field(None, max_length=50)
    label: Optional[str] = Field(None, max_length=255)
    sort_order: Optional[int] = None


# ── Leads ─────────────────────────────────────────────────────────────────────

class LeadIn(BaseModel):
    name: Optional[str] = Field(None, max_length=100)
    phone: str = Field(max_length=30)
    message: Optional[str] = Field(None, max_length=2000)
    form_type: str = "main"

    @field_validator("phone")
    @classmethod
    def validate_phone(cls, v: str) -> str:
        digits = re.sub(r"\D", "", v)
        if len(digits) < 10 or len(digits) > 15:
            raise ValueError("Неверный формат телефона")
        return v

    @field_validator("form_type")
    @classmethod
    def validate_form_type(cls, v: str) -> str:
        allowed = {"main", "call", "order", "consult", "contract", "contacts"}
        if v not in allowed:
            return "main"
        return v

class LeadOut(BaseModel):
    id: int
    name: Optional[str]
    phone: str
    message: Optional[str]
    form_type: str
    created_at: datetime
    is_read: bool

    model_config = {"from_attributes": True}


# ── Auth ──────────────────────────────────────────────────────────────────────

class LoginIn(BaseModel):
    email: EmailStr = Field(max_length=254)
    password: str = Field(min_length=1, max_length=128)  # bcrypt DoS protection

class TokenOut(BaseModel):
    access_token: str
    refresh_token: str
    token_type: str = "bearer"

class RefreshIn(BaseModel):
    refresh_token: str


# ── Page Content ──────────────────────────────────────────────────────────────

class PageContentOut(BaseModel):
    slug: str
    data: str  # JSON string

    model_config = {"from_attributes": True}

class PageContentIn(BaseModel):
    data: str = Field(max_length=200_000)  # JSON string, validated on frontend


# ── Pagination ────────────────────────────────────────────────────────────────

class LeadListOut(BaseModel):
    items: list[LeadOut]
    total: int
    page: int
    per_page: int
