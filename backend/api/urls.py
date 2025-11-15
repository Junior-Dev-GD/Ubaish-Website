from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    DocumentViewSet, UserViewSet, FeeViewSet,
    register, login, profile, update_profile
)

router = DefaultRouter()
router.register(r"documents", DocumentViewSet, basename="documents")
router.register(r"users", UserViewSet, basename="users")
router.register(r"fees", FeeViewSet, basename="fees")

urlpatterns = [
    # Authentication endpoints
    path("auth/register/", register, name="register"),
    path("auth/login/", login, name="login"),
    path("auth/profile/", profile, name="profile"),
    path("auth/profile/update/", update_profile, name="update_profile"),
    
    # API endpoints
    path("", include(router.urls)),
]