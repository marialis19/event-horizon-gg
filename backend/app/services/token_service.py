from datetime import timedelta
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from app.models.user import User
from app.core.security import (
    create_access_token,
    create_refresh_token,
    decode_token,
    hash_password,
    verify_password,
)
from app.schemas.auth import TokenResponse
from app.core.exceptions import InvalidTokenError, SessionExpiredError

class TokenService:

    @staticmethod
    def _hash_refresh_token(token: str) -> str:
        return hash_password(token)

    @staticmethod
    def _verify_refresh_token(plain_token: str, hashed_token: str) -> bool:
        return verify_password(plain_token, hashed_token)

    @staticmethod
    def generate_temp_token(user_id: str) -> str:
        return create_access_token(
            data={"sub": user_id, "type": "otp_pending"},
            expires_delta=timedelta(minutes=5)
        )

    @staticmethod
    async def generate_tokens(user: User, db: AsyncSession) -> tuple[TokenResponse, str]:
        access_token = create_access_token(
            data={"sub": str(user.id), "role": user.role.value}
        )
        refresh_token = create_refresh_token(data={"sub": str(user.id)})

        user.hashed_refresh_token = TokenService._hash_refresh_token(refresh_token)
        db.add(user)
        await db.flush()

        return TokenResponse(access_token=access_token), refresh_token

    @staticmethod
    async def rotate_refresh_token(
        refresh_token: str, db: AsyncSession
    ) -> tuple[TokenResponse, str]:
        payload = decode_token(refresh_token)
        if not payload or payload.get("type") != "refresh":
            raise InvalidTokenError()

        user_id = payload.get("sub")
        result = await db.execute(select(User).where(User.id == user_id))
        user = result.scalar_one_or_none()

        if not user or not user.hashed_refresh_token:
            raise SessionExpiredError()

        if not TokenService._verify_refresh_token(refresh_token, user.hashed_refresh_token):
            raise InvalidTokenError()

        return await TokenService.generate_tokens(user, db)

    @staticmethod
    async def revoke_token(user: User, db: AsyncSession) -> None:
        user.hashed_refresh_token = None
        db.add(user)
        await db.flush()