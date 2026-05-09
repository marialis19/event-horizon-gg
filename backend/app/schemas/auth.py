from pydantic import BaseModel, EmailStr, field_validator
from uuid import UUID
from app.models.user import UserRole, UserStatus


class RegisterRequest(BaseModel):
    email: EmailStr
    gamertag: str
    password: str

    @field_validator("email")
    @classmethod
    def normalize_email(cls, v: str) -> str:
        return v.strip().lower()

    @field_validator("gamertag")
    @classmethod
    def validate_gamertag(cls, v: str) -> str:
        v = v.strip()
        if len(v) < 3 or len(v) > 50:
            raise ValueError("Gamertag must be between 3 and 50 characters")
        if not v.replace("_", "").replace("-", "").isalnum():
            raise ValueError("Gamertag can only contain letters, numbers, - and _")
        return v

    @field_validator("password")
    @classmethod
    def validate_password(cls, v: str) -> str:
        if len(v) < 8:
            raise ValueError("Password must be at least 8 characters")
        if not any(c.isupper() for c in v):
            raise ValueError("Password must contain at least one uppercase letter")
        if not any(c.isdigit() for c in v):
            raise ValueError("Password must contain at least one number")
        return v


class LoginRequest(BaseModel):
    email: EmailStr
    password: str

    @field_validator("email")
    @classmethod
    def normalize_email(cls, v: str) -> str:
        return v.strip().lower()


class OTPVerifyRequest(BaseModel):
    temp_token: str
    otp_code: str


class RefreshTokenRequest(BaseModel):
    refresh_token: str


class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    requires_otp: bool = False


class UserResponse(BaseModel):
    id: UUID
    email: str
    gamertag: str
    role: UserRole
    status: UserStatus
    is_2fa_enabled: bool

    model_config = {"from_attributes": True}