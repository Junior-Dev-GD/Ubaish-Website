from rest_framework import serializers
from .models import User, Document
from django.contrib.auth.password_validation import validate_password

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ("id", "username", "email", "role", "owes_fees")

class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, required=True, validators=[validate_password])

    class Meta:
        model = User
        fields = ("username", "email", "password", "role")

    def create(self, validated_data):
        user = User.objects.create_user(
            username=validated_data["username"],
            email=validated_data.get("email"),
            password=validated_data["password"],
            role=validated_data.get("role", User.Roles.STUDENT),
        )
        return user

class DocumentSerializer(serializers.ModelSerializer):
    owner = UserSerializer(read_only=True)

    class Meta:
        model = Document
        fields = ("id", "title", "file", "owner", "uploaded_at")
        read_only_fields = ("owner", "uploaded_at")