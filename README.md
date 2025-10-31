# Bidii - Renovation Management System

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
- **User Authentication** - Secure user registration and login

## Technology Stack

- **Backend**: Django 5.2.7
- **Database**: PostgreSQL (via psycopg2-binary) / SQLite (development)
- **Frontend**: Bootstrap 5.3.0, Bootstrap Icons
- **API**: Django REST Framework 3.16.1
- **Authentication**: Django's built-in authentication system
- **File Handling**: Pillow for image processing

## Prerequisites

- Python 3.11 or higher
- pip (Python package manager)
- Virtual environment (recommended)
- PostgreSQL (for production) or SQLite (for development)

## Installation

### 1. Clone the repository

```bash
git clone <repository-url>
cd bidii
```

### 2. Create and activate virtual environment

```bash
python3 -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

### 3. Install dependencies

```bash
pip install -r requirements.txt
```

### 4. Configure environment variables (optional)

Create a `.env` file in the project root for production settings:

```env
SECRET_KEY=your-secret-key-here
DEBUG=False
ALLOWED_HOSTS=yourdomain.com,www.yourdomain.com
DATABASE_URL=postgresql://user:password@localhost:5432/bidii
```

### 5. Run migrations

```bash
python manage.py makemigrations
python manage.py migrate
```

### 6. Create a superuser

```bash
python manage.py createsuperuser
```

Follow the prompts to create an admin account.

### 7. Collect static files (for production)

```bash
python manage.py collectstatic
```

## Running the Application

### Development Server

```bash
python manage.py runserver
```

The application will be available at `http://127.0.0.1:8000/`

### Access Points

- **Home Page**: http://127.0.0.1:8000/
- **Admin Panel**: http://127.0.0.1:8000/admin/
- **Login**: http://127.0.0.1:8000/auth/login/
- **Register**: http://127.0.0.1:8000/auth/register/
- **Dashboard**: http://127.0.0.1:8000/dashboard/ (requires login)

## Project Structure

```
bidii/
├── bidii_project/          # Django project settings
│   ├── settings.py         # Main settings file
│   ├── urls.py             # Main URL configuration
│   └── wsgi.py             # WSGI configuration
├── renovation/             # Main application
│   ├── models.py           # Database models
│   ├── views.py            # View functions
│   ├── urls.py             # URL patterns
│   └── admin.py            # Admin configuration
├── templates/              # HTML templates
│   ├── base.html           # Base template
│   ├── home.html           # Landing page
│   ├── auth/               # Authentication templates
│   ├── dashboard/          # Dashboard templates
│   ├── customers/          # Customer templates
│   ├── leads/              # Lead templates
│   ├── estimates/          # Estimate templates
│   ├── jobs/               # Job templates
│   ├── invoices/           # Invoice templates
│   └── reports/            # Report templates
├── static/                 # Static files (CSS, JS, images)
├── media/                  # User-uploaded files
├── manage.py               # Django management script
└── requirements.txt        # Python dependencies
```

## Database Models

The application includes the following core models:

- **Profile** - Extended user profile with role-based access
- **Customer** - Customer contact and address information
- **Lead** - Project leads with status tracking
- **SiteVisit** - Site visit documentation
- **Estimate** - Project estimates with cost breakdowns
- **EstimateItem** - Line items for estimates
- **Job** - Construction/renovation jobs
- **Material** - Materials tracking for jobs
- **Invoice** - Billing documents
- **Payment** - Payment records

## User Roles

- **Admin** - Full system access
- **Manager** - Manage all business operations
- **Estimator** - Create and manage estimates
- **Customer** - Limited access to own projects

## Development

### Creating migrations

After modifying models:

```bash
python manage.py makemigrations
python manage.py migrate
```

### Running tests

```bash
python manage.py test
```

### Creating a new app

```bash
python manage.py startapp app_name
```

## Production Deployment

### Important Settings for Production

1. Set `DEBUG = False` in settings.py
2. Configure `ALLOWED_HOSTS` with your domain
3. Use PostgreSQL instead of SQLite
4. Set up proper SECRET_KEY
5. Configure static files serving (use whitenoise or nginx)
6. Set up HTTPS
7. Configure CORS settings appropriately
8. Use environment variables for sensitive data

### Recommended Production Stack

- **Web Server**: Gunicorn + Nginx
- **Database**: PostgreSQL
- **Static Files**: WhiteNoise or CDN
- **Process Manager**: Systemd or Supervisor
- **Caching**: Redis (optional)

## Security Notes

- Change the SECRET_KEY in production
- Never commit sensitive credentials to version control
- Use HTTPS in production
- Regularly update dependencies
- Implement proper backup procedures
- Configure database backups

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

This project is proprietary software.

## Support

For issues and questions, please contact the development team.

## Version History

- **1.0.0** (2025) - Initial Django conversion
  - Converted from Next.js/Supabase to Django
  - Full feature parity with original application
  - Bootstrap-based responsive UI
  - PostgreSQL database support

## Acknowledgments

- Django framework and community
- Bootstrap for UI components
- Bootstrap Icons for iconography
