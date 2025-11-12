from django.shortcuts import render
from rest_framework import viewsets, status
from rest_framework.decorators import action, api_view, permission_classes
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, AllowAny
from .models import Document, User
from .serializers import DocumentSerializer, RegisterSerializer, UserSerializer
from .permissions import IsOwnerOrAdmin, DebtClearForDownload
from django.shortcuts import get_object_or_404
from django.http import FileResponse

@api_view(["POST"])
@permission_classes([AllowAny])
def register(request):
    serializer = RegisterSerializer(data=request.data)
    serializer.is_valid(raise_exception=True)
    user = serializer.save()
    return Response(UserSerializer(user).data, status=status.HTTP_201_CREATED)

class DocumentViewSet(viewsets.ModelViewSet):
    queryset = Document.objects.all().select_related("owner")
    serializer_class = DocumentSerializer
    permission_classes = (IsAuthenticated,)

    def perform_create(self, serializer):
        serializer.save(owner=self.request.user)

    def get_permissions(self):
        if self.action in ["retrieve", "list", "create"]:
            return [IsAuthenticated()]
        return [IsAuthenticated(), IsOwnerOrAdmin()]

    @action(detail=True, methods=["get"], url_path="download", permission_classes=[IsAuthenticated, DebtClearForDownload])
    def download(self, request, pk=None):
        doc = get_object_or_404(Document, pk=pk)
        # DebtClearForDownload enforces rules
        return FileResponse(open(doc.file.path, "rb"), filename=doc.file.name, as_attachment=True)
