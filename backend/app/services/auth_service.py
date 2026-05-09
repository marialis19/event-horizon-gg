from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from app.models.user import User, UserStatus
from app.schemas.auth import RegisterRequest, LoginRequest, TokenResponse
from app.core.security import hash_password, verify_password, decode_token
from app.services.token_service import TokenService
from app.services.otp_service import OTPService
from app.core.exceptions import (
    InvalidCredentialsError,
    EmailAlreadyExistsError,
    GamertagAlreadyTakenError,
    AccountBannedError,
    AccountSuspendedError,
    InvalidOTPError,
    OTPNotConfiguredError,
    InvalidTokenError,
)


class AuthService:

    @staticmethod
    async def register(
        data: RegisterRequest, db: AsyncSession, client_ip: str
    ) -> User:
        result = await db.execute(
            select(User).where(
                (User.email == data.email) | (User.gamertag == data.gamertag)
            )
        )
        existing = result.scalar_one_or_none()

        if existing:
            if existing.email == data.email:
                raise EmailAlreadyExistsError()
            raise GamertagAlreadyTakenError()

        user = User(
            email=data.email,
            gamertag=data.gamertag,
            hashed_password=hash_password(data.password),
            registration_ip=client_ip,
        )

        db.add(user)
        await db.flush()
        return user

    @staticmethod
    async def login(
        data: LoginRequest,
        db: AsyncSession,
        client_ip: str,
    ) -> tuple[TokenResponse, str, bool]:
        result = await db.execute(select(User).where(User.email == data.email))
        user = result.scalar_one_or_none()

        if not user or not verify_password(data.password, user.hashed_password):
            raise InvalidCredentialsError()

        if user.status == UserStatus.BANNED:
            raise AccountBannedError()

        if user.status == UserStatus.SUSPENDED:
            raise AccountSuspendedError()

        user.last_login_ip = client_ip
        db.add(user)

        if user.is_2fa_enabled:
            temp_token = TokenService.generate_temp_token(str(user.id))
            return TokenResponse(access_token=temp_token, requires_otp=True), "", True

        token_response, refresh_token = await TokenService.generate_tokens(user, db)
        return token_response, refresh_token, False

    @staticmethod
    async def verify_otp(
        temp_token: str,
        otp_code: str,
        db: AsyncSession,
    ) -> tuple[TokenResponse, str]:
        payload = decode_token(temp_token)

        if not payload or payload.get("type") != "otp_pending":
            raise InvalidTokenError()

        user_id = payload.get("sub")
        result = await db.execute(select(User).where(User.id == user_id))
        user = result.scalar_one_or_none()

        if not user or not user.otp_secret:
            raise OTPNotConfiguredError()

        if not OTPService.verify_otp(user.otp_secret, otp_code):
            raise InvalidOTPError()

        return await TokenService.generate_tokens(user, db)

    @staticmethod
    async def enable_2fa(user: User, db: AsyncSession) -> str:
        secret = OTPService.generate_secret()
        user.otp_secret = secret
        db.add(user)
        await db.flush()
        return OTPService.generate_qr_base64(user.email, secret)

    @staticmethod
    async def confirm_2fa(
        user: User, otp_code: str, db: AsyncSession
    ) -> bool:
        if not user.otp_secret:
            raise OTPNotConfiguredError()

        if not OTPService.verify_otp(user.otp_secret, otp_code):
            raise InvalidOTPError()

        user.is_2fa_enabled = True
        db.add(user)
        await db.flush()
        return True

    @staticmethod
    async def logout(user: User, db: AsyncSession) -> None:
        await TokenService.revoke_token(user, db)