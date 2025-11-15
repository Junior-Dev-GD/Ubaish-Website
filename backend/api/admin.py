from django.contrib import admin
from django.utils.html import format_html
from .models import User, Document, Fee


@admin.register(User)
class UserAdmin(admin.ModelAdmin):
    list_display = (
        "username", "email", "role", "owes_fees", 
        "total_debt_display", "student_id", "graduation_year", 
        "date_joined"
    )
    list_filter = ("role", "owes_fees", "is_active", "date_joined")
    search_fields = ("username", "email", "student_id", "first_name", "last_name")
    fieldsets = (
        (None, {"fields": ("username", "password")}),
        ("Personal Info", {
            "fields": ("first_name", "last_name", "email", "phone_number")
        }),
        ("Academic Info", {
            "fields": ("student_id", "graduation_year", "role")
        }),
        ("Financial", {
            "fields": ("owes_fees",)
        }),
        ("Permissions", {
            "fields": ("is_active", "is_staff", "is_superuser", "groups", "user_permissions"),
        }),
        ("Important dates", {"fields": ("last_login", "date_joined")}),
    )
    readonly_fields = ("date_joined", "last_login")
    filter_horizontal = ("groups", "user_permissions")

    def total_debt_display(self, obj):
        """Display total debt with color coding"""
        debt = obj.total_debt
        if debt > 0:
            return format_html(
                '<span style="color: red; font-weight: bold;">${:.2f}</span>',
                debt
            )
        return format_html('<span style="color: green;">$0.00</span>')
    total_debt_display.short_description = "Total Debt"


@admin.register(Fee)
class FeeAdmin(admin.ModelAdmin):
    list_display = (
        "id", "user", "description", "amount", 
        "is_paid", "due_date", "paid_date", "created_at"
    )
    list_filter = ("is_paid", "created_at", "due_date")
    search_fields = ("user__username", "user__email", "description")
    readonly_fields = ("created_at", "updated_at", "created_by")
    date_hierarchy = "created_at"
    
    fieldsets = (
        (None, {
            "fields": ("user", "description", "amount")
        }),
        ("Payment Status", {
            "fields": ("is_paid", "due_date", "paid_date")
        }),
        ("Metadata", {
            "fields": ("created_by", "created_at", "updated_at"),
            "classes": ("collapse",)
        }),
    )

    def save_model(self, request, obj, form, change):
        if not change:  # Only set created_by on creation
            obj.created_by = request.user
        super().save_model(request, obj, form, change)


@admin.register(Document)
class DocumentAdmin(admin.ModelAdmin):
    list_display = (
        "id", "title", "document_type", "owner", 
        "file_size_display", "is_verified", "uploaded_at"
    )
    list_filter = ("document_type", "is_verified", "uploaded_at")
    search_fields = ("title", "owner__username", "owner__email")
    readonly_fields = (
        "uploaded_at", "updated_at", "verified_by", 
        "verified_at", "file_size", "file_preview"
    )
    date_hierarchy = "uploaded_at"
    
    fieldsets = (
        (None, {
            "fields": ("owner", "title", "document_type", "file")
        }),
        ("Verification", {
            "fields": ("is_verified", "verified_by", "verified_at")
        }),
        ("Metadata", {
            "fields": ("file_size", "file_preview", "uploaded_at", "updated_at"),
            "classes": ("collapse",)
        }),
    )

    def file_size_display(self, obj):
        """Display file size in human-readable format"""
        if obj.file_size:
            size = obj.file_size
            for unit in ['B', 'KB', 'MB', 'GB']:
                if size < 1024.0:
                    return f"{size:.2f} {unit}"
                size /= 1024.0
            return f"{size:.2f} TB"
        return "N/A"
    file_size_display.short_description = "File Size"

    def file_preview(self, obj):
        """Show file link in admin"""
        if obj.file:
            return format_html(
                '<a href="{}" target="_blank">View File</a>',
                obj.file.url
            )
        return "No file"
    file_preview.short_description = "File"

    def save_model(self, request, obj, form, change):
        if change and 'is_verified' in form.changed_data and obj.is_verified:
            from django.utils import timezone
            obj.verified_by = request.user
            obj.verified_at = timezone.now()
        super().save_model(request, obj, form, change)
