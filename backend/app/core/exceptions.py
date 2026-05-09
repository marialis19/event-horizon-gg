from fastapi import HTTPException, status

class AuthException(HTTPException):
    pass 

class InvalidCredentialsException(AuthException):
    def __init__(self):
        super().__init__(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid authentication credentials",
        )

class EmailAlreadyExistsException(AuthException):
    def __init__(self):
        super().__init__(
            status_code=status.HTTP_409_CONFLICT,
            detail="Email already exists",
        )

class GamertagAlreadyTakenError(AuthException):
    def __init__(self):
        super().__init__(
            status_code=status.HTTP_409_CONFLICT,
            detail="Gamertag already taken",
        )

class AccountBannedError(AuthException):
    def __init__(self):
        super().__init__(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Account is banned",
        )

class AccountSuspendedError(AuthException):
    def __init__(self):
        super().__init__(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Account is suspended",
        )

class InvalidOTPError(AuthException):
    def __init__(self):
        super().__init__(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid OTP code",
        )

class OTPConfiguredError(AuthException):
    def __init__(self):
        super().__init__(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="OTP is already configured for this account",
        )

class InvalidTokenError(AuthException):
    def __init__(self):
        super().__init__(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid token",
        )

class SessionExpiredError(AuthException):
    def __init__(self):
        super().__init__(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Session has expired",
        )

