import pyotp
import qrcode
import io
import base64
from app.core.config import settings

class OTPService:

    @staticmethod
    def generate_secret() -> str:
        return pyotp.random_base32()

    @staticmethod
    def get_totp(secret: str) -> pyotp.TOTP:
        return pyotp.TOTP(secret)

    @staticmethod
    def verify_otp(secret: str, code: str) -> bool:
        totp = OTPService.get_totp(secret)
        return totp.verify(code, valid_window=1)

    @staticmethod
    def generate_qr_base64(email: str, secret: str) -> str:
        totp = OTPService.get_totp(secret)
        provisioning_uri = totp.provisioning_uri(
            name=email,
            issuer_name=settings.OTP_ISSUER_NAME
        )
        qr = qrcode.make(provisioning_uri)
        buffer = io.BytesIO()
        qr.save(buffer, format="PNG")
        buffer.seek(0)
        return base64.b64encode(buffer.getvalue()).decode("utf-8")