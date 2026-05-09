from fastapi import Depends
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from app.db.session import get_db
from app.core.security import decode_token
from app.models.user import User, UserStatus
from app.core.exceptions import (
    InvalidTokenError,
    SessionExpiredError,
    AccountBannedError,
    AccountSuspendedError,
    AuthException,
)
from fastapi import status

bearer_scheme = HTTPBearer()


async def get_current_user(
    credentials: HTTPAuthorizationCredentials = Depends(bearer_scheme),
    db: AsyncSession = Depends(get_db),
) -> User:
    token = credentials.credentials
    payload = decode_token(token)

    if not payload or payload.get("type") != "access":
        raise InvalidTokenError()

    user_id = payload.get("sub")
    result = await db.execute(select(User).where(User.id == user_id))
    user = result.scalar_one_or_none()

    if not user:
        raise SessionExpiredError()

    if user.status == UserStatus.BANNED:
        raise AccountBannedError()

    if user.status == UserStatus.SUSPENDED:
        raise AccountSuspendedError()

    return user


async def get_current_active_player(
    current_user: User = Depends(get_current_user),
) -> User:
    if current_user.status.value == "pending_verification":
        raise AuthException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Account pending verification",
        )
    return current_user

async def get_admin_user(
    current_user: User = Depends(get_current_user),
) -> User:
    from app.models.user import UserRole
    if current_user.role != UserRole.ADMIN:
        raise AuthException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Admin access required",
        )
    return current_user