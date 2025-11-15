from django.shortcuts import get_object_or_404
from rest_framework import viewsets, status
from rest_framework.decorators import action, api_view, permission_classes
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework_simplejwt.tokens import RefreshToken
from django.http import FileResponse, Http404
from django.utils import timezone

from .models import Document, User, Fee
from .serializers import (
    DocumentSerializer, RegisterSerializer, UserSerializer,
    LoginSerializer, FeeSerializer
)
from .permissions import (
    IsOwnerOrAdmin, DebtClearForDownload, IsAdmin,
    CanManageFees, CanVerifyDocuments, CanViewUserDetails,
    IsAdminOrAlumni
)


# Authentication Views
@api_view(["POST"])
@permission_classes([AllowAny])
def register(request):
    """Register a new user (alumni or student)"""
    serializer = RegisterSerializer(data=request.data, context={'request': request})
    serializer.is_valid(raise_exception=True)
    user = serializer.save()
    
    # Generate JWT tokens
    refresh = RefreshToken.for_user(user)
    
    return Response({
        "user": UserSerializer(user).data,
        "tokens": {
            "refresh": str(refresh),
            "access": str(refresh.access_token),
        }
    }, status=status.HTTP_201_CREATED)


@api_view(["POST"])
@permission_classes([AllowAny])
def login(request):
    """Login and get JWT tokens"""
    serializer = LoginSerializer(data=request.data, context={'request': request})
    serializer.is_valid(raise_exception=True)
    user = serializer.validated_data['user']
    
    # Generate JWT tokens
    refresh = RefreshToken.for_user(user)
    
    return Response({
        "user": UserSerializer(user).data,
        "tokens": {
            "refresh": str(refresh),
            "access": str(refresh.access_token),
        }
    }, status=status.HTTP_200_OK)


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def profile(request):
    """Get current user's profile"""
    serializer = UserSerializer(request.user, context={'request': request})
    return Response(serializer.data)


@api_view(["PUT", "PATCH"])
@permission_classes([IsAuthenticated])
def update_profile(request):
    """Update current user's profile"""
    serializer = UserSerializer(
        request.user, 
        data=request.data, 
        partial=True,
        context={'request': request}
    )
    serializer.is_valid(raise_exception=True)
    serializer.save()
    return Response(serializer.data)


# User Management Views
class UserViewSet(viewsets.ReadOnlyModelViewSet):
    """ViewSet for user management (read-only for non-admins)"""
    queryset = User.objects.all().select_related()
    serializer_class = UserSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        if user.role == "ADMIN":
            return User.objects.all()
        # Non-admins can only see themselves
        return User.objects.filter(id=user.id)

    def get_permissions(self):
        if self.action == 'retrieve':
            return [IsAuthenticated(), CanViewUserDetails()]
        return [IsAuthenticated()]

    @action(detail=True, methods=['get'])
    def documents(self, request, pk=None):
        """Get all documents for a user"""
        user = get_object_or_404(User, pk=pk)
        
        # Check permissions
        if user.id != request.user.id and request.user.role != "ADMIN":
            return Response(
                {"detail": "You do not have permission to view this user's documents."},
                status=status.HTTP_403_FORBIDDEN
            )
        
        documents = user.documents.all()
        serializer = DocumentSerializer(documents, many=True, context={'request': request})
        return Response(serializer.data)

    @action(detail=True, methods=['get'])
    def fees(self, request, pk=None):
        """Get all fees for a user"""
        user = get_object_or_404(User, pk=pk)
        
        # Check permissions
        if user.id != request.user.id and request.user.role != "ADMIN":
            return Response(
                {"detail": "You do not have permission to view this user's fees."},
                status=status.HTTP_403_FORBIDDEN
            )
        
        fees = user.fees.all()
        serializer = FeeSerializer(fees, many=True, context={'request': request})
        return Response(serializer.data)


# Document Management Views
class DocumentViewSet(viewsets.ModelViewSet):
    """ViewSet for document management"""
    queryset = Document.objects.all().select_related("owner", "verified_by")
    serializer_class = DocumentSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        if user.role == "ADMIN":
            return Document.objects.all()
        # Users can only see their own documents
        return Document.objects.filter(owner=user)

    def get_permissions(self):
        if self.action in ["list", "retrieve", "create"]:
            return [IsAuthenticated()]
        elif self.action == "verify":
            return [IsAuthenticated(), CanVerifyDocuments()]
        return [IsAuthenticated(), IsOwnerOrAdmin()]

    def perform_create(self, serializer):
        serializer.save(owner=self.request.user)

    @action(detail=True, methods=["get"], permission_classes=[IsAuthenticated, DebtClearForDownload])
    def download(self, request, pk=None):
        """Download a document (with debt verification)"""
        doc = get_object_or_404(Document, pk=pk)
        
        # Check if file exists
        if not doc.file:
            raise Http404("Document file not found")
        
        try:
            file_response = FileResponse(
                open(doc.file.path, "rb"),
                filename=doc.file.name.split('/')[-1],
                as_attachment=True
            )
            return file_response
        except FileNotFoundError:
            raise Http404("Document file not found on server")

    @action(detail=True, methods=["post"], permission_classes=[IsAuthenticated, CanVerifyDocuments])
    def verify(self, request, pk=None):
        """Verify a document (admin only)"""
        doc = get_object_or_404(Document, pk=pk)
        doc.is_verified = True
        doc.verified_by = request.user
        doc.verified_at = timezone.now()
        doc.save()
        
        serializer = self.get_serializer(doc)
        return Response(serializer.data)

    @action(detail=True, methods=["post"], permission_classes=[IsAuthenticated, CanVerifyDocuments])
    def unverify(self, request, pk=None):
        """Unverify a document (admin only)"""
        doc = get_object_or_404(Document, pk=pk)
        doc.is_verified = False
        doc.verified_by = None
        doc.verified_at = None
        doc.save()
        
        serializer = self.get_serializer(doc)
        return Response(serializer.data)


# Fee Management Views
class FeeViewSet(viewsets.ModelViewSet):
    """ViewSet for fee management"""
    queryset = Fee.objects.all().select_related("user", "created_by")
    serializer_class = FeeSerializer
    permission_classes = [IsAuthenticated, CanManageFees]

    def get_queryset(self):
        user = self.request.user
        if user.role == "ADMIN":
            return Fee.objects.all()
        # Non-admins can only see their own fees
        return Fee.objects.filter(user=user)

    def get_permissions(self):
        if self.action in ["list", "retrieve"]:
            # Users can view their own fees, admins can view all
            return [IsAuthenticated()]
        # Only admins can create/update/delete fees
        return [IsAuthenticated(), CanManageFees()]

    def perform_create(self, serializer):
        serializer.save(created_by=self.request.user)

    @action(detail=True, methods=["post"])
    def mark_paid(self, request, pk=None):
        """Mark a fee as paid (admin only)"""
        fee = get_object_or_404(Fee, pk=pk)
        fee.is_paid = True
        fee.paid_date = timezone.now().date()
        fee.save()
        
        serializer = self.get_serializer(fee)
        return Response(serializer.data)

    @action(detail=True, methods=["post"])
    def mark_unpaid(self, request, pk=None):
        """Mark a fee as unpaid (admin only)"""
        fee = get_object_or_404(Fee, pk=pk)
        fee.is_paid = False
        fee.paid_date = None
        fee.save()
        
        serializer = self.get_serializer(fee)
        return Response(serializer.data)
