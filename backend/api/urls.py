from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import DocumentViewSet, register

router = DefaultRouter()
router.register(r"documents", DocumentViewSet, basename="documents")

urlpatterns = [
    path("auth/register/", register, name="register"),
    path("", include(router.urls)),
]