import logging

import httpx
from django.conf import settings

logger = logging.getLogger(__name__)

PAID_STATUSES = {"paid", "success", "completed"}
FAILED_STATUSES = {"failed", "expired", "cancelled", "canceled"}


class MayarError(Exception):
    pass


def _base_url() -> str:
    return settings.MAYAR_BASE_URL or "https://api.mayar.id/hl/v1"


def _headers() -> dict:
    if not settings.MAYAR_API_KEY:
        raise MayarError("MAYAR_API_KEY not configured.")
    return {
        "Authorization": f"Bearer {settings.MAYAR_API_KEY}",
        "Content-Type": "application/json",
    }


def create_payment_link(
    *, name: str, amount: int, email: str, description: str, redirect_url: str, mobile: str = ""
) -> dict:
    payload = {
        "name": name,
        "amount": amount,
        "email": email,
        "description": description,
        "redirectUrl": redirect_url,
    }
    if mobile:
        payload["mobile"] = mobile
    try:
        resp = httpx.post(
            f"{_base_url()}/payment/create", headers=_headers(), json=payload, timeout=15
        )
    except httpx.HTTPError as exc:
        raise MayarError(f"Mayar request failed: {exc}") from exc
    if resp.status_code >= 400:
        raise MayarError(f"Mayar {resp.status_code}: {resp.text}")
    body = resp.json()
    data = body.get("data") or {}
    link = data.get("link")
    tx_id = data.get("id") or data.get("transaction_id")
    if not link or not tx_id:
        raise MayarError(f"Mayar response missing link/id: {body}")
    return {"link": link, "transaction_id": str(tx_id)}


def get_payment_status(payment_id: str) -> dict:
    resp = httpx.get(f"{_base_url()}/payment/{payment_id}", headers=_headers(), timeout=15)
    if resp.status_code >= 400:
        raise MayarError(f"Mayar {resp.status_code}: {resp.text}")
    data = resp.json().get("data") or {}
    return {"status": str(data.get("status") or "").lower(), "raw": data}


def verify_webhook(request) -> bool:
    expected = settings.MAYAR_WEBHOOK_TOKEN
    if not expected:
        logger.error("mayar webhook: MAYAR_WEBHOOK_TOKEN not configured")
        return False
    received = request.headers.get("X-Callback-Token") or request.headers.get("x-callback-token")
    return bool(received) and received == expected
