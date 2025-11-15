from django.db import models
from django.contrib.auth.models import AbstractUser
from django.core.validators import MinValueValidator
from decimal import Decimal
from django.utils import timezone


class User(AbstractUser):
    class Roles(models.TextChoices):
        STUDENT = "STUDENT"
        ALUMNI = "ALUMNI"
        ADMIN = "ADMIN"

    role = models.CharField(max_length=10, choices=Roles.choices, default=Roles.STUDENT)
    owes_fees = models.BooleanField(default=False)
    phone_number = models.CharField(max_length=20, blank=True, null=True)
    graduation_year = models.IntegerField(blank=True, null=True)
    student_id = models.CharField(max_length=50, unique=True, blank=True, null=True)
    created_at = models.DateTimeField(default=timezone.now)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.username} ({self.role})"

    @property
    def total_debt(self):
        """Calculate total outstanding debt"""
        from django.db.models import Sum
        result = self.fees.filter(is_paid=False).aggregate(
            total=Sum('amount')
        )
        return result['total'] if result['total'] is not None else Decimal('0.00')

    def has_outstanding_debt(self):
        """Check if user has any outstanding debt"""
        return self.fees.filter(is_paid=False).exists()


class Fee(models.Model):
    """Track individual fees/debts for users"""
    user = models.ForeignKey(
        User, 
        related_name="fees", 
        on_delete=models.CASCADE
    )
    description = models.CharField(max_length=255)
    amount = models.DecimalField(
        max_digits=10, 
        decimal_places=2, 
        validators=[MinValueValidator(Decimal('0.01'))]
    )
    is_paid = models.BooleanField(default=False)
    due_date = models.DateField(blank=True, null=True)
    paid_date = models.DateField(blank=True, null=True)
    created_at = models.DateTimeField(default=timezone.now)
    updated_at = models.DateTimeField(auto_now=True)
    created_by = models.ForeignKey(
        User,
        related_name="fees_created",
        on_delete=models.SET_NULL,
        null=True,
        blank=True
    )

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        status = "Paid" if self.is_paid else "Outstanding"
        return f"{self.user.username} - {self.description} ({status})"

    def save(self, *args, **kwargs):
        # Check if this is a new fee or if payment status changed
        is_new = self.pk is None
        if not is_new:
            try:
                old_instance = Fee.objects.get(pk=self.pk)
                payment_changed = old_instance.is_paid != self.is_paid
            except Fee.DoesNotExist:
                payment_changed = True
        else:
            payment_changed = True
        
        super().save(*args, **kwargs)
        
        # Update user's owes_fees flag only if payment status changed
        if payment_changed:
            self.user.owes_fees = self.user.has_outstanding_debt()
            self.user.save(update_fields=['owes_fees'])


class Document(models.Model):
    class DocumentType(models.TextChoices):
        TRANSCRIPT = "TRANSCRIPT", "Transcript"
        CERTIFICATE = "CERTIFICATE", "Certificate"
        DIPLOMA = "DIPLOMA", "Diploma"
        OTHER = "OTHER", "Other"

    owner = models.ForeignKey(
        User, 
        related_name="documents", 
        on_delete=models.CASCADE
    )
    title = models.CharField(max_length=255)
    document_type = models.CharField(
        max_length=20,
        choices=DocumentType.choices,
        default=DocumentType.OTHER
    )
    file = models.FileField(upload_to="documents/%Y/%m/%d/")
    file_size = models.PositiveIntegerField(blank=True, null=True)
    uploaded_at = models.DateTimeField(default=timezone.now)
    updated_at = models.DateTimeField(auto_now=True)
    is_verified = models.BooleanField(default=False)
    verified_by = models.ForeignKey(
        User,
        related_name="verified_documents",
        on_delete=models.SET_NULL,
        null=True,
        blank=True
    )
    verified_at = models.DateTimeField(blank=True, null=True)


    class Meta:
        ordering = ['-uploaded_at']

    def __str__(self):
        return f"{self.title} - {self.owner.username}"

    def save(self, *args, **kwargs):
        if self.file and not self.file_size:
            self.file_size = self.file.size
        super().save(*args, **kwargs)
