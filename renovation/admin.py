from django.contrib import admin
from .models import (
    Profile, Customer, Lead, SiteVisit, Estimate,
    EstimateItem, Job, Material, Invoice, Payment
)


@admin.register(Profile)
class ProfileAdmin(admin.ModelAdmin):
    list_display = ['full_name', 'email', 'role', 'company_name', 'created_at']
    list_filter = ['role', 'created_at']
    search_fields = ['full_name', 'email', 'company_name']


@admin.register(Customer)
class CustomerAdmin(admin.ModelAdmin):
    list_display = ['name', 'email', 'phone', 'city', 'state', 'created_at']
    list_filter = ['state', 'created_at']
    search_fields = ['name', 'email', 'phone', 'city']


@admin.register(Lead)
class LeadAdmin(admin.ModelAdmin):
    list_display = ['project_name', 'customer', 'status', 'estimated_value', 'created_at']
    list_filter = ['status', 'created_at']
    search_fields = ['project_name', 'description', 'customer__name']


@admin.register(SiteVisit)
class SiteVisitAdmin(admin.ModelAdmin):
    list_display = ['lead', 'visit_date', 'created_at']
    list_filter = ['visit_date', 'created_at']
    search_fields = ['lead__project_name', 'notes']


@admin.register(Estimate)
class EstimateAdmin(admin.ModelAdmin):
    list_display = ['estimate_number', 'lead', 'status', 'total_amount', 'valid_until', 'created_at']
    list_filter = ['status', 'created_at']
    search_fields = ['estimate_number', 'lead__project_name']


@admin.register(EstimateItem)
class EstimateItemAdmin(admin.ModelAdmin):
    list_display = ['estimate', 'description', 'quantity', 'unit_price', 'total_price', 'category']
    list_filter = ['category', 'created_at']
    search_fields = ['description', 'estimate__estimate_number']


@admin.register(Job)
class JobAdmin(admin.ModelAdmin):
    list_display = ['job_number', 'estimate', 'status', 'start_date', 'end_date', 'created_at']
    list_filter = ['status', 'start_date', 'created_at']
    search_fields = ['job_number', 'estimate__estimate_number']


@admin.register(Material)
class MaterialAdmin(admin.ModelAdmin):
    list_display = ['name', 'job', 'quantity', 'unit', 'cost_per_unit', 'total_cost', 'supplier']
    list_filter = ['supplier', 'created_at']
    search_fields = ['name', 'job__job_number', 'supplier']


@admin.register(Invoice)
class InvoiceAdmin(admin.ModelAdmin):
    list_display = ['invoice_number', 'job', 'status', 'total_amount', 'paid_amount', 'due_date', 'created_at']
    list_filter = ['status', 'due_date', 'created_at']
    search_fields = ['invoice_number', 'job__job_number']


@admin.register(Payment)
class PaymentAdmin(admin.ModelAdmin):
    list_display = ['invoice', 'amount', 'payment_method', 'payment_date', 'reference_number']
    list_filter = ['payment_method', 'payment_date', 'created_at']
    search_fields = ['invoice__invoice_number', 'reference_number']
