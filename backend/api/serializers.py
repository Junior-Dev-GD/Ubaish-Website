from rest_framework import serializers
from .models import User, Document, Fee
from django.contrib.auth.password_validation import validate_password
from django.contrib.auth import authenticate


class UserSerializer(serializers.ModelSerializer):
    total_debt = serializers.DecimalField(
        max_digits=10, 
        decimal_places=2, 
        read_only=True
    )
    
    class Meta:
        model = User
        fields = (
            "id", "username", "email", "role", "owes_fees", 
            "total_debt", "phone_number", "graduation_year", 
            "student_id", "first_name", "last_name", 
            "date_joined", "created_at"
        )
        read_only_fields = ("id", "date_joined", "created_at", "owes_fees", "total_debt")


class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(
        write_only=True, 
        required=True, 
        validators=[validate_password],
        style={'input_type': 'password'}
    )
    password_confirm = serializers.CharField(
        write_only=True, 
        required=True,
        style={'input_type': 'password'}
    )

    class Meta:
        model = User
        fields = (
            "username", "email", "password", "password_confirm", 
            "role", "phone_number", "graduation_year", "student_id",
            "first_name", "last_name"
        )

    def validate(self, attrs):
        if attrs['password'] != attrs['password_confirm']:
            raise serializers.ValidationError({
                "password": "Passwords do not match."
            })
        return attrs

    def create(self, validated_data):
        validated_data.pop('password_confirm')
        password = validated_data.pop('password')
        user = User.objects.create_user(
            password=password,
            **validated_data
        )
        return user


class LoginSerializer(serializers.Serializer):
    username = serializers.CharField()
    password = serializers.CharField(
        write_only=True,
        style={'input_type': 'password'}
    )

    def validate(self, attrs):
        username = attrs.get('username')
        password = attrs.get('password')

        if username and password:
            user = authenticate(
                request=self.context.get('request'),
                username=username,
                password=password
            )
            if not user:
                raise serializers.ValidationError(
                    'Unable to log in with provided credentials.'
                )
            if not user.is_active:
                raise serializers.ValidationError(
                    'User account is disabled.'
                )
            attrs['user'] = user
        else:
            raise serializers.ValidationError(
                'Must include "username" and "password".'
            )
        return attrs


class FeeSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)
    user_id = serializers.IntegerField(write_only=True, required=False)
    created_by = UserSerializer(read_only=True)

    class Meta:
        model = Fee
        fields = (
            "id", "user", "user_id", "description", "amount", 
            "is_paid", "due_date", "paid_date", "created_at", 
            "updated_at", "created_by"
        )
        read_only_fields = ("id", "created_at", "updated_at", "created_by")

    def create(self, validated_data):
        validated_data['created_by'] = self.context['request'].user
        return super().create(validated_data)


class DocumentSerializer(serializers.ModelSerializer):
    owner = UserSerializer(read_only=True)
    file_size = serializers.IntegerField(read_only=True)
    verified_by = UserSerializer(read_only=True)
    file_url = serializers.SerializerMethodField()

    class Meta:
        model = Document
        fields = (
            "id", "title", "document_type", "file", "file_url", 
            "file_size", "owner", "uploaded_at", "updated_at",
            "is_verified", "verified_by", "verified_at"
        )
        read_only_fields = (
            "id", "owner", "uploaded_at", "updated_at", 
            "file_size", "verified_by", "verified_at"
        )

    def get_file_url(self, obj):
        if obj.file:
            request = self.context.get('request')
            if request:
                return request.build_absolute_uri(obj.file.url)
        return None

    def create(self, validated_data):
        validated_data['owner'] = self.context['request'].user
        return super().create(validated_data)