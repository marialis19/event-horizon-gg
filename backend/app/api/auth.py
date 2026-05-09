from fastapi import APIRouter, Depends, Request, Response, status
from sqlalchemy.ext.asyncio import AsyncSession
from app.db.session import get_db
from app.schemas.auth import (
    RegisterRequest,
    LoginRequest,
    OTPVerifyRequest,
    TokenResponse,
    UserResponse,
)
from app.services.auth_service import AuthService
from app.services.token_service import TokenService
from app.core.dependencies import get_current_user
from app.core.exceptions import InvalidTokenError
from app.models.user import User

router = APIRouter(prefix="/auth", tags=["auth"])

REFRESH_TOKEN_COOKIE = "refresh_token"


def _set_refresh_cookie(response: Response, refresh_token: str) -> None:
    response.set_cookie(
        key=REFRESH_TOKEN_COOKIE,
        value=refresh_token,
        httponly=True,
        secure=True,
        samesite="lax",
        max_age=60 * 60 * 24 * 7,
    )


def _clear_refresh_cookie(response: Response) -> None:
    response.delete_cookie(key=REFRESH_TOKEN_COOKIE)


@router.post("/register", response_model=UserResponse, status_code=status.HTTP_201_CREATED)
async def register(
    data: RegisterRequest,
    request: Request,
    db: AsyncSession = Depends(get_db),
) -> UserResponse:
    client_ip = request.client.host
    user = await AuthService.register(data, db, client_ip)
    return user


@router.post("/login", response_model=TokenResponse)
async def login(
    data: LoginRequest,
    request: Request,
    response: Response,
    db: AsyncSession = Depends(get_db),
) -> TokenResponse:
    client_ip = request.client.host
    token_response, refresh_token, requires_otp = await AuthService.login(data, db, client_ip)

    if not requires_otp and refresh_token:
        _set_refresh_cookie(response, refresh_token)

    return token_response


@router.post("/otp/verify", response_model=TokenResponse)
async def verify_otp(
    data: OTPVerifyRequest,
    response: Response,
    db: AsyncSession = Depends(get_db),
) -> TokenResponse:
    token_response, refresh_token = await AuthService.verify_otp(
        temp_token=data.temp_token,
        otp_code=data.otp_code,
        db=db,
    )
    _set_refresh_cookie(response, refresh_token)
    return token_response


@router.post("/refresh", response_model=TokenResponse)
async def refresh_token(
    request: Request,
    response: Response,
    db: AsyncSession = Depends(get_db),
) -> TokenResponse:
    refresh_token = request.cookies.get(REFRESH_TOKEN_COOKIE)
    if not refresh_token:
        raise InvalidTokenError()

    token_response, new_refresh_token = await TokenService.rotate_refresh_token(refresh_token, db)
    _set_refresh_cookie(response, new_refresh_token)
    return token_response


@router.post("/logout", status_code=status.HTTP_204_NO_CONTENT)
async def logout(
    response: Response,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> None:
    await AuthService.logout(current_user, db)
    _clear_refresh_cookie(response)


@router.get("/me", response_model=UserResponse)
async def get_me(
    current_user: User = Depends(get_current_user),
) -> UserResponse:
    return current_user


@router.post("/2fa/enable", status_code=status.HTTP_200_OK)
async def enable_2fa(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> dict:
    qr_base64 = await AuthService.enable_2fa(current_user, db)
    return {"qr_code": qr_base64, "message": "Scan this QR with your authenticator app"}


@router.post("/2fa/confirm", status_code=status.HTTP_200_OK)
async def confirm_2fa(
    data: OTPVerifyRequest,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> dict:
    await AuthService.confirm_2fa(current_user, data.otp_code, db)
    return {"message": "2FA enabled successfully"}