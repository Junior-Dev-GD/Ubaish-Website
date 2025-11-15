from rest_framework.permissions import BasePermission


class IsAdmin(BasePermission):
    """Permission class to check if user is an admin"""
    def has_permission(self, request, view):
        return bool(
            request.user and 
            request.user.is_authenticated and 
            request.user.role == "ADMIN"
        )


class IsAlumni(BasePermission):
    """Permission class to check if user is an alumni"""
    def has_permission(self, request, view):
        return bool(
            request.user and 
            request.user.is_authenticated and 
            request.user.role == "ALUMNI"
        )


class IsAdminOrAlumni(BasePermission):
    """Permission class to check if user is admin or alumni"""
    def has_permission(self, request, view):
        return bool(
            request.user and 
            request.user.is_authenticated and 
            request.user.role in ["ADMIN", "ALUMNI"]
        )


class IsOwnerOrAdmin(BasePermission):
    """Permission class to check if user owns the object or is an admin"""
    def has_object_permission(self, request, view, obj):
        # Admins can access everything
        if request.user.role == "ADMIN":
            return True
        
        # Check if user owns the object
        if hasattr(obj, 'owner'):
            return obj.owner_id == request.user.id
        elif hasattr(obj, 'user'):
            return obj.user_id == request.user.id
        
        return False


class DebtClearForDownload(BasePermission):
    """
    Permission class to verify debt status before allowing document downloads.
    Admins can always download, but alumni must have no outstanding debt.
    """
    def has_object_permission(self, request, view, obj):
        # Admins can always download
        if request.user.role == "ADMIN":
            return True
        
        # Users can only download their own documents
        if hasattr(obj, 'owner'):
            if obj.owner_id != request.user.id:
                return False
        else:
            return False
        
        # For alumni, check if they have outstanding debt
        if request.user.role == "ALUMNI":
            # Check both the owes_fees flag and actual outstanding fees
            if request.user.owes_fees or request.user.has_outstanding_debt():
                return False
        
        return True


class CanManageFees(BasePermission):
    """Permission class to check if user can create/manage fees"""
    def has_permission(self, request, view):
        # Only admins can manage fees
        return bool(
            request.user and 
            request.user.is_authenticated and 
            request.user.role == "ADMIN"
        )


class CanVerifyDocuments(BasePermission):
    """Permission class to check if user can verify documents"""
    def has_permission(self, request, view):
        # Only admins can verify documents
        return bool(
            request.user and 
            request.user.is_authenticated and 
            request.user.role == "ADMIN"
        )


class CanViewUserDetails(BasePermission):
    """Permission class to check if user can view other users' details"""
    def has_object_permission(self, request, view, obj):
        # Admins can view all users
        if request.user.role == "ADMIN":
            return True
        
        # Users can view their own details
        return obj.id == request.user.id