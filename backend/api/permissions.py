from rest_framework.permissions import BasePermission

class IsAdmin(BasePermission):
    def has_permission(self, request, view):
        return bool(request.user and request.user.is_authenticated and request.user.role == "ADMIN")

class IsOwnerOrAdmin(BasePermission):
    def has_object_permission(self, request, view, obj):
        if request.user.role == "ADMIN":
            return True
        return obj.owner_id == request.user.id

class DebtClearForDownload(BasePermission):
    def has_object_permission(self, request, view, obj):
        if request.user.role == "ADMIN":
            return True
        if obj.owner_id != request.user.id:
            return False
        if request.user.role == "ALUMNI" and request.user.owes_fees:
            return False
        return True