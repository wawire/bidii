# Bidii - Renovation Management System

A comprehensive web application for managing renovation and construction business operations.

## 📁 Project Versions

This repository contains **two versions** of the Bidii application:

### 1. Next.js/React Version (Original)
Located in the root directory - A modern full-stack application built with:
- Next.js 16.0 with React 19.2
- TypeScript
- Supabase (PostgreSQL + Auth)
- Shadcn/UI + Tailwind CSS

### 2. Django/Python Version (New)
Located in the `django_app/` directory - A Django-based application built with:
- Django 5.2.7
- Python 3.11+
- Bootstrap 5.3
- SQLite/PostgreSQL

---

## 🚀 Quick Start

### For Next.js Version
See the Next.js project files in the root directory.

### For Django/Python Version

**Navigate to the Django project:**
```bash
cd django_app
```

**Follow the setup instructions in:**
📄 [django_app/README.md](django_app/README.md)

**Quick setup:**
```bash
# 1. Create virtual environment
python3 -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# 2. Install dependencies
pip install -r requirements.txt

# 3. Run migrations
python manage.py migrate

# 4. Create admin user
python manage.py createsuperuser

# 5. Start server
python manage.py runserver
```

**Access the app at:**
- Main app: http://127.0.0.1:8000/
- Admin panel: http://127.0.0.1:8000/admin/

---

## 🎯 Features

Both versions include:

- ✅ **Customer Management** - Track customer information and history
- ✅ **Lead Tracking** - Monitor leads through the sales pipeline
- ✅ **Site Visits** - Document job site visits with notes and photos
- ✅ **Estimates** - Create detailed project estimates with line items
- ✅ **Job Scheduling** - Schedule and track job progress
- ✅ **Materials Tracking** - Track materials, suppliers, and costs
- ✅ **Invoicing** - Generate and manage invoices
- ✅ **Payment Processing** - Record and track payments
- ✅ **Reports & Analytics** - View business insights and statistics
- ✅ **User Authentication** - Secure login and registration

---

## 📊 Comparison

| Feature | Next.js Version | Django Version |
|---------|----------------|----------------|
| **Frontend** | React 19 + TypeScript | Django Templates + Bootstrap |
| **Backend** | Next.js API Routes | Django Views |
| **Database** | Supabase (PostgreSQL) | SQLite/PostgreSQL |
| **Auth** | Supabase Auth | Django Auth |
| **Admin Panel** | Custom built | Django Admin (built-in) |
| **API** | Custom REST API | Django REST Framework |
| **Styling** | Tailwind CSS + Shadcn/UI | Bootstrap 5 |
| **Deployment** | Vercel | Traditional server |

---

## 📖 Documentation

- **Django Version**: See [django_app/README.md](django_app/README.md) for detailed instructions
- **Next.js Version**: See the original project documentation

---

## 🛠️ Development

### Django Version
```bash
cd django_app
source venv/bin/activate
python manage.py runserver
```

### Next.js Version
```bash
npm install
npm run dev
```

---

## 📝 Database Models

Both versions include these core models:

- **Profile** - User profiles with role-based access (admin, manager, estimator, customer)
- **Customer** - Customer contact and address information
- **Lead** - Project leads with status tracking
- **SiteVisit** - Site visit documentation with photos and measurements
- **Estimate** - Project estimates with cost breakdowns
- **EstimateItem** - Line items for estimates
- **Job** - Construction/renovation job tracking
- **Material** - Materials tracking for jobs
- **Invoice** - Billing documents
- **Payment** - Payment records

---

## 🔐 User Roles

- **Admin** - Full system access
- **Manager** - Manage all business operations
- **Estimator** - Create and manage estimates
- **Customer** - Limited access to own projects

---

## 🚀 Getting Started

**Choose your preferred version:**

1. **Django/Python** - Recommended if you prefer:
   - Python backend
   - Built-in admin panel
   - Simpler deployment
   - Traditional server-side rendering

2. **Next.js/React** - Recommended if you prefer:
   - Modern JavaScript stack
   - Client-side rendering
   - Serverless deployment (Vercel)
   - TypeScript type safety

---

## 📂 Repository Structure

```
bidii/
├── django_app/              # 🐍 Django Python version
│   ├── bidii_project/       # Django settings
│   ├── renovation/          # Main Django app
│   ├── templates/           # HTML templates
│   ├── static/              # CSS, JS, images
│   ├── manage.py           # Django CLI
│   ├── requirements.txt    # Python dependencies
│   └── README.md           # Django setup guide
│
├── app/                    # ⚛️ Next.js app router
├── components/             # React components
├── lib/                    # Utility functions
├── public/                 # Static assets
├── scripts/                # Database scripts
├── package.json            # Node dependencies
└── README.md              # This file
```

---

## 🤝 Contributing

1. Choose which version you want to contribute to
2. Fork the repository
3. Create a feature branch
4. Make your changes
5. Submit a pull request

---

## 📄 License

Proprietary - All rights reserved

---

## 📞 Support

For questions or issues:
- **Django Version**: Check [django_app/README.md](django_app/README.md)
- **Next.js Version**: Refer to Next.js documentation

---

## ✨ Version History

- **v2.0.0** (2025) - Added Django Python version
  - Complete Django conversion
  - Bootstrap-based UI
  - Django admin integration
  - Full feature parity with Next.js version

- **v1.0.0** (2025) - Initial Next.js version
  - React + TypeScript frontend
  - Supabase backend
  - Shadcn/UI components

---

**Note**: Both versions are fully functional and feature-complete. Choose the one that best fits your technology stack and deployment preferences.
