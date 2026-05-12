from django.conf import settings
from google.auth.transport import requests as google_requests
from google.oauth2 import id_token
from rest_framework import serializers


class UserSerializer(serializers.Serializer):
    id = serializers.IntegerField(read_only=True)
    email = serializers.EmailField(read_only=True)
    onboarded = serializers.SerializerMethodField()

    def get_onboarded(self, obj):
        return bool(getattr(obj, "profile", None) and obj.profile.full_name)


class GoogleAuthSerializer(serializers.Serializer):
    credential = serializers.CharField()

    def validate(self, attrs):
        if not settings.GOOGLE_OAUTH_CLIENT_ID:
            raise serializers.ValidationError("Google OAuth not configured")
        try:
            claims = id_token.verify_oauth2_token(
                attrs["credential"],
                google_requests.Request(),
                settings.GOOGLE_OAUTH_CLIENT_ID,
            )
        except ValueError as exc:
            raise serializers.ValidationError(f"Invalid Google credential: {exc}") from exc
        if not claims.get("email_verified"):
            raise serializers.ValidationError("Email not verified")
        attrs["claims"] = claims
        return attrs
