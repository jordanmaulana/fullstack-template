from django.urls import path

from api.v1 import auth_api, payments_api

urlpatterns = [
    path("auth/google/", auth_api.google, name="api-v1-auth-google"),
    path("auth/logout/", auth_api.logout, name="api-v1-logout"),
    path("auth/me/", auth_api.me, name="api-v1-me"),
    path("payments/mayar/webhook/", payments_api.webhook, name="api-v1-mayar-webhook"),
]
