from django.shortcuts import render, redirect, get_object_or_404
from django.contrib.auth import login, authenticate, logout
from django.contrib.auth.decorators import login_required
from django.contrib.auth.forms import UserCreationForm, AuthenticationForm
from django.contrib import messages
from django.db.models import Sum, Count
from .models import (
    Profile, Customer, Lead, SiteVisit, Estimate,
    EstimateItem, Job, Material, Invoice, Payment
)


# Home and Authentication Views
def home(request):
    """Landing page"""
    if request.user.is_authenticated:
        return redirect('dashboard')
    return render(request, 'home.html')


def register_view(request):
    """User registration"""
    if request.method == 'POST':
        form = UserCreationForm(request.POST)
        if form.is_valid():
            user = form.save()
            # Create profile for the user
            Profile.objects.create(
                user=user,
                email=user.username + '@example.com',  # Placeholder email
                role='customer'
            )
            login(request, user)
            messages.success(request, 'Account created successfully!')
            return redirect('dashboard')
    else:
        form = UserCreationForm()
    return render(request, 'auth/register.html', {'form': form})


def login_view(request):
    """User login"""
    if request.method == 'POST':
        form = AuthenticationForm(request, data=request.POST)
        if form.is_valid():
            username = form.cleaned_data.get('username')
            password = form.cleaned_data.get('password')
            user = authenticate(username=username, password=password)
            if user is not None:
                login(request, user)
                messages.success(request, f'Welcome back, {username}!')
                return redirect('dashboard')
    else:
        form = AuthenticationForm()
    return render(request, 'auth/login.html', {'form': form})


def logout_view(request):
    """User logout"""
    logout(request)
    messages.info(request, 'You have been logged out.')
    return redirect('home')


# Dashboard Views
@login_required
def dashboard(request):
    """Main dashboard with statistics"""
    # Get user's data statistics
    total_customers = Customer.objects.filter(user=request.user).count()
    total_leads = Lead.objects.filter(user=request.user).count()
    active_jobs = Job.objects.filter(user=request.user, status='in_progress').count()
    total_revenue = Invoice.objects.filter(
        user=request.user,
        status='paid'
    ).aggregate(Sum('paid_amount'))['paid_amount__sum'] or 0

    # Recent leads
    recent_leads = Lead.objects.filter(user=request.user)[:5]

    # Recent jobs
    recent_jobs = Job.objects.filter(user=request.user)[:5]

    context = {
        'total_customers': total_customers,
        'total_leads': total_leads,
        'active_jobs': active_jobs,
        'total_revenue': total_revenue,
        'recent_leads': recent_leads,
        'recent_jobs': recent_jobs,
    }
    return render(request, 'dashboard/index.html', context)


# Customer Views
@login_required
def customer_list(request):
    """List all customers"""
    customers = Customer.objects.filter(user=request.user)
    return render(request, 'customers/list.html', {'customers': customers})


@login_required
def customer_detail(request, customer_id):
    """Customer detail view"""
    customer = get_object_or_404(Customer, id=customer_id, user=request.user)
    leads = customer.leads.all()
    return render(request, 'customers/detail.html', {
        'customer': customer,
        'leads': leads
    })


# Lead Views
@login_required
def lead_list(request):
    """List all leads"""
    leads = Lead.objects.filter(user=request.user)
    return render(request, 'leads/list.html', {'leads': leads})


@login_required
def lead_detail(request, lead_id):
    """Lead detail view"""
    lead = get_object_or_404(Lead, id=lead_id, user=request.user)
    site_visits = lead.site_visits.all()
    estimates = lead.estimates.all()
    return render(request, 'leads/detail.html', {
        'lead': lead,
        'site_visits': site_visits,
        'estimates': estimates
    })


# Estimate Views
@login_required
def estimate_list(request):
    """List all estimates"""
    estimates = Estimate.objects.filter(user=request.user)
    return render(request, 'estimates/list.html', {'estimates': estimates})


@login_required
def estimate_detail(request, estimate_id):
    """Estimate detail view"""
    estimate = get_object_or_404(Estimate, id=estimate_id, user=request.user)
    items = estimate.items.all()
    return render(request, 'estimates/detail.html', {
        'estimate': estimate,
        'items': items
    })


# Job Views
@login_required
def job_list(request):
    """List all jobs"""
    jobs = Job.objects.filter(user=request.user)
    return render(request, 'jobs/list.html', {'jobs': jobs})


@login_required
def job_detail(request, job_id):
    """Job detail view"""
    job = get_object_or_404(Job, id=job_id, user=request.user)
    materials = job.materials.all()
    invoices = job.invoices.all()
    return render(request, 'jobs/detail.html', {
        'job': job,
        'materials': materials,
        'invoices': invoices
    })


# Invoice Views
@login_required
def invoice_list(request):
    """List all invoices"""
    invoices = Invoice.objects.filter(user=request.user)
    return render(request, 'invoices/list.html', {'invoices': invoices})


@login_required
def invoice_detail(request, invoice_id):
    """Invoice detail view"""
    invoice = get_object_or_404(Invoice, id=invoice_id, user=request.user)
    payments = invoice.payments.all()
    return render(request, 'invoices/detail.html', {
        'invoice': invoice,
        'payments': payments
    })


# Reports View
@login_required
def reports(request):
    """Reports and analytics"""
    # Lead status breakdown
    lead_stats = Lead.objects.filter(user=request.user).values('status').annotate(count=Count('id'))

    # Job status breakdown
    job_stats = Job.objects.filter(user=request.user).values('status').annotate(count=Count('id'))

    # Invoice status breakdown
    invoice_stats = Invoice.objects.filter(user=request.user).values('status').annotate(count=Count('id'))

    context = {
        'lead_stats': lead_stats,
        'job_stats': job_stats,
        'invoice_stats': invoice_stats,
    }
    return render(request, 'reports/index.html', context)
