import logging

from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from rest_framework.response import Response

from core.payments.mayar import PAID_STATUSES, verify_webhook

logger = logging.getLogger(__name__)


@api_view(["POST"])
@permission_classes([AllowAny])
def webhook(request):
    if not verify_webhook(request):
        return Response({"detail": "invalid token"}, status=401)
    payload = request.data
    status_str = str(payload.get("status") or "").lower()
    if status_str in PAID_STATUSES:
        # call domain-specific activate_subscription(payload) here
        pass
    return Response({"ok": True})
