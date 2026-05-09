import uuid
from sqlalchemy import Column, String, Boolean, Enum as SAEnum
from sqlalchemy.dialects.postgresql import UUID
import enum
from app.db.base import Base, TimestampMixin


class UserRole(str, enum.Enum): 
    PLAYER = "player"
    ADMIN = "admin"
    MODERATOR = "moderator"

class UserStatus(str, enum.Enum):
    ACTIVE = "active"
    SUSPENDED = "suspended"
    BANNED = "banned"
    PENDING_VERIFICATION = "pending_verification"

class User(Base, TimestampMixin):
    __tablename__ = "users"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    email = Column(String(255), unique=True, nullable=False, index=True)
    gamertag = Column(String(50), unique=True, nullable=False, index=True)
    hashed_password = Column(String(255), nullable=False)
    role = Column(SAEnum(UserRole), default=UserRole.PLAYER, nullable=False)
    status = Column(SAEnum(UserStatus), default=UserStatus.PENDING_VERIFICATION, nullable=False)

    # OTP / 2FA
    otp_secret = Column(String(32), nullable=True)
    is_2fa_enabled = Column(Boolean, default=False, nullable=False)

    # Auth control
    hashed_refresh_token = Column(String(255), nullable=True)
    registration_ip = Column(String(45), nullable=True)
    last_login_ip = Column(String(45), nullable=True)