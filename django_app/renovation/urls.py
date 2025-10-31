from django.urls import path
from . import views

urlpatterns = [
    # Authentication
    path('auth/login/', views.login_view, name='login'),
    path('auth/register/', views.register_view, name='register'),
    path('auth/logout/', views.logout_view, name='logout'),

    # Dashboard
    path('dashboard/', views.dashboard, name='dashboard'),

    # Customers
    path('customers/', views.customer_list, name='customer_list'),
    path('customers/<uuid:customer_id>/', views.customer_detail, name='customer_detail'),

    # Leads
    path('leads/', views.lead_list, name='lead_list'),
    path('leads/<uuid:lead_id>/', views.lead_detail, name='lead_detail'),

    # Estimates
    path('estimates/', views.estimate_list, name='estimate_list'),
    path('estimates/<uuid:estimate_id>/', views.estimate_detail, name='estimate_detail'),

    # Jobs
    path('jobs/', views.job_list, name='job_list'),
    path('jobs/<uuid:job_id>/', views.job_detail, name='job_detail'),

    # Invoices
    path('invoices/', views.invoice_list, name='invoice_list'),
    path('invoices/<uuid:invoice_id>/', views.invoice_detail, name='invoice_detail'),

    # Reports
    path('reports/', views.reports, name='reports'),
]
