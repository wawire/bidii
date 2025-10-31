# Bidii - Django Python Version

A comprehensive Django-based web application for managing renovation and construction business operations.

## Features

- **Customer Management** - Track and manage customer information
- **Lead Tracking** - Monitor leads through the sales pipeline
- **Site Visits** - Document job site visits with photos and measurements
- **Estimates** - Create detailed project estimates with line items
- **Job Scheduling** - Schedule and track job progress
- **Materials Tracking** - Track materials, suppliers, and costs
- **Invoicing** - Generate and manage invoices
- **Payment Processing** - Record and track payments
- **Reports & Analytics** - View business insights and statistics
- **Admin Interface** - Powerful Django admin panel for data management

## Technology Stack

- **Backend**: Django 5.2.7
- **Database**: SQLite (development) / PostgreSQL (production)
- **Frontend**: Bootstrap 5.3.0, Bootstrap Icons
- **API**: Django REST Framework 3.16.1
- **Authentication**: Django's built-in authentication system

## Prerequisites

Before running this project, make sure you have:

- **Python 3.11 or higher** installed on your machine
- **pip** (Python package manager)
- **Git** (for cloning the repository)

### Check Your Python Version

```bash
python3 --version
```

If you don't have Python 3.11+, download it from [python.org](https://www.python.org/downloads/)

## Installation & Setup

Follow these steps to run the project on your local machine:

### Step 1: Navigate to the Django Project Directory

```bash
cd django_app
```

### Step 2: Create a Virtual Environment

A virtual environment keeps your project dependencies isolated from other Python projects.

**On macOS/Linux:**
```bash
python3 -m venv venv
source venv/bin/activate
```

**On Windows:**
```bash
python -m venv venv
venv\Scripts\activate
```

You should see `(venv)` appear at the beginning of your command line, indicating the virtual environment is active.

### Step 3: Install Dependencies

With the virtual environment activated, install all required packages:

```bash
pip install -r requirements.txt
```

This will install:
- Django 5.2.7
- Django REST Framework
- Django CORS Headers
- Pillow (for image handling)
- psycopg2-binary (PostgreSQL support)
- python-dotenv

### Step 4: Run Database Migrations

Django uses migrations to set up your database schema:

```bash
python manage.py migrate
```

This creates all necessary database tables in the SQLite database (db.sqlite3).

### Step 5: Create a Superuser (Admin Account)

Create an admin account to access the Django admin panel:

```bash
python manage.py createsuperuser
```

You'll be prompted to enter:
- Username
- Email address (optional)
- Password (you'll need to type it twice)

**Example:**
```
Username: admin
Email address: admin@example.com
Password: ********
Password (again): ********
```

### Step 6: Start the Development Server

Now you're ready to run the application:

```bash
python manage.py runserver
```

You should see output like:
```
Starting development server at http://127.0.0.1:8000/
Quit the server with CONTROL-C.
```

## Accessing the Application

Once the server is running, open your web browser and visit:

### Main Application
- **Home Page**: http://127.0.0.1:8000/
- **Login**: http://127.0.0.1:8000/auth/login/
- **Register**: http://127.0.0.1:8000/auth/register/
- **Dashboard**: http://127.0.0.1:8000/dashboard/ (after login)

### Admin Panel
- **Admin Interface**: http://127.0.0.1:8000/admin/

Login with the superuser credentials you created in Step 5.

## Project Structure

```
django_app/
├── bidii_project/          # Django project settings
│   ├── settings.py         # Main configuration file
│   ├── urls.py             # Root URL routing
│   └── wsgi.py             # WSGI configuration
├── renovation/             # Main application
│   ├── models.py           # Database models
│   ├── views.py            # View functions
│   ├── urls.py             # App URL patterns
│   ├── admin.py            # Admin configuration
│   └── migrations/         # Database migrations
├── templates/              # HTML templates
│   ├── base.html           # Base template
│   ├── home.html           # Landing page
│   ├── auth/               # Authentication pages
│   ├── dashboard/          # Dashboard pages
│   ├── customers/          # Customer pages
│   ├── leads/              # Lead pages
│   ├── estimates/          # Estimate pages
│   ├── jobs/               # Job pages
│   ├── invoices/           # Invoice pages
│   └── reports/            # Report pages
├── static/                 # CSS, JavaScript, images
├── media/                  # User-uploaded files
├── venv/                   # Virtual environment (don't commit)
├── db.sqlite3              # SQLite database (don't commit)
├── manage.py               # Django management script
├── requirements.txt        # Python dependencies
└── README.md              # This file
```

## Available Features & URLs

After logging in, you can access:

| Feature | URL | Description |
|---------|-----|-------------|
| Dashboard | `/dashboard/` | Overview with statistics |
| Customers | `/customers/` | Manage customers |
| Leads | `/leads/` | Track project leads |
| Estimates | `/estimates/` | Create and manage estimates |
| Jobs | `/jobs/` | Schedule and track jobs |
| Invoices | `/invoices/` | Manage invoices |
| Reports | `/reports/` | View analytics |

## Common Commands

### Start the Server
```bash
python manage.py runserver
```

### Stop the Server
Press `CTRL + C` in the terminal

### Create New Migrations (after changing models)
```bash
python manage.py makemigrations
```

### Apply Migrations
```bash
python manage.py migrate
```

### Create Superuser
```bash
python manage.py createsuperuser
```

### Open Django Shell (for testing)
```bash
python manage.py shell
```

### Check for Issues
```bash
python manage.py check
```

## Troubleshooting

### Issue: "Command not found: python"
**Solution**: Try `python3` instead of `python`

### Issue: "No module named 'django'"
**Solution**: Make sure your virtual environment is activated and run:
```bash
pip install -r requirements.txt
```

### Issue: Virtual environment not activating
**Solution**:
- Make sure you're in the `django_app` directory
- On Windows, you may need to run: `Set-ExecutionPolicy RemoteSigned -Scope CurrentUser`

### Issue: Port 8000 already in use
**Solution**: Use a different port:
```bash
python manage.py runserver 8080
```

### Issue: "CSRF verification failed"
**Solution**: Make sure cookies are enabled in your browser and clear browser cache

## Adding Sample Data

You can add sample data through:

1. **Django Admin Panel** (http://127.0.0.1:8000/admin/)
   - Login with superuser credentials
   - Click on any model (Customers, Leads, etc.)
   - Click "Add" to create new records

2. **Django Shell**
```bash
python manage.py shell
```
Then:
```python
from renovation.models import Customer
from django.contrib.auth.models import User

user = User.objects.first()
customer = Customer.objects.create(
    user=user,
    name="John Doe",
    email="john@example.com",
    phone="555-1234",
    city="New York",
    state="NY"
)
```

## Database Models

The application includes these models:

- **Profile** - Extended user information with roles
- **Customer** - Customer contact details
- **Lead** - Project leads with status tracking
- **SiteVisit** - Site visit documentation
- **Estimate** - Project cost estimates
- **EstimateItem** - Line items for estimates
- **Job** - Scheduled renovation jobs
- **Material** - Materials used in jobs
- **Invoice** - Billing documents
- **Payment** - Payment records

## Next Steps

1. **Explore the Admin Panel** - Add some test data
2. **Create User Accounts** - Register through the web interface
3. **Test Features** - Try creating customers, leads, estimates, etc.
4. **Customize** - Modify templates in the `templates/` folder
5. **Extend** - Add new features in `renovation/views.py` and `renovation/models.py`

## Development Tips

- Keep the virtual environment activated while working
- Changes to Python code require server restart
- Changes to templates are reflected immediately (just refresh browser)
- Use the admin panel for quick data management
- Check `python manage.py check` before committing code

## Production Deployment

For production deployment:

1. Set `DEBUG = False` in settings.py
2. Configure `ALLOWED_HOSTS`
3. Use PostgreSQL instead of SQLite
4. Set up environment variables for sensitive data
5. Use Gunicorn + Nginx for serving
6. Set up HTTPS
7. Configure static file serving
8. Set up automated backups

## Support

For questions or issues:
- Check Django documentation: https://docs.djangoproject.com/
- Check the troubleshooting section above
- Review error messages in the terminal

## License

Proprietary - All rights reserved
