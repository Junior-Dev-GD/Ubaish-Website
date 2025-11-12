from django.db import models
from django.contrib.auth.models import AbstractUser

class User(AbstractUser):
    class Roles(models.TextChoices):
        STUDENT = "STUDENT"
        ALUMNI = "ALUMNI"
        ADMIN = "ADMIN"

    role = models.CharField(max_length=10, choices=Roles.choices, default=Roles.STUDENT)
    owes_fees = models.BooleanField(default=False)

    def __str__(self):
        return f"{self.username} ({self.role})"

class Document(models.Model):
    owner = models.ForeignKey("api.User", related_name="documents", on_delete=models.CASCADE)
    title = models.CharField(max_length=255)
    file = models.FileField(upload_to="documents/")
    uploaded_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.title} ({self.owner_id})"
