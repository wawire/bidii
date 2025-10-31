-- Create users profile table
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  full_name TEXT,
  company_name TEXT,
  phone TEXT,
  role TEXT CHECK (role IN ('admin', 'manager', 'estimator', 'customer')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create customers table
CREATE TABLE IF NOT EXISTS public.customers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  address TEXT,
  city TEXT,
  state TEXT,
  zip_code TEXT,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create leads table
CREATE TABLE IF NOT EXISTS public.leads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  customer_id UUID REFERENCES public.customers(id) ON DELETE SET NULL,
  project_name TEXT NOT NULL,
  description TEXT,
  status TEXT CHECK (status IN ('new', 'contacted', 'qualified', 'estimate_sent', 'won', 'lost')) DEFAULT 'new',
  estimated_value DECIMAL(10, 2),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create site visits table
CREATE TABLE IF NOT EXISTS public.site_visits (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  lead_id UUID NOT NULL REFERENCES public.leads(id) ON DELETE CASCADE,
  visit_date TIMESTAMP WITH TIME ZONE NOT NULL,
  notes TEXT,
  photos_url TEXT[],
  measurements TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create estimates table
CREATE TABLE IF NOT EXISTS public.estimates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  lead_id UUID NOT NULL REFERENCES public.leads(id) ON DELETE CASCADE,
  estimate_number TEXT NOT NULL UNIQUE,
  status TEXT CHECK (status IN ('draft', 'sent', 'accepted', 'rejected')) DEFAULT 'draft',
  total_amount DECIMAL(10, 2) NOT NULL,
  labor_cost DECIMAL(10, 2),
  material_cost DECIMAL(10, 2),
  tax_amount DECIMAL(10, 2),
  notes TEXT,
  valid_until DATE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create estimate line items table
CREATE TABLE IF NOT EXISTS public.estimate_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  estimate_id UUID NOT NULL REFERENCES public.estimates(id) ON DELETE CASCADE,
  description TEXT NOT NULL,
  quantity DECIMAL(10, 2) NOT NULL,
  unit_price DECIMAL(10, 2) NOT NULL,
  total_price DECIMAL(10, 2) NOT NULL,
  category TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create jobs table
CREATE TABLE IF NOT EXISTS public.jobs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  estimate_id UUID NOT NULL REFERENCES public.estimates(id) ON DELETE CASCADE,
  job_number TEXT NOT NULL UNIQUE,
  status TEXT CHECK (status IN ('scheduled', 'in_progress', 'completed', 'on_hold', 'cancelled')) DEFAULT 'scheduled',
  start_date DATE,
  end_date DATE,
  actual_start_date DATE,
  actual_end_date DATE,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create materials table
CREATE TABLE IF NOT EXISTS public.materials (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  job_id UUID NOT NULL REFERENCES public.jobs(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  quantity DECIMAL(10, 2) NOT NULL,
  unit TEXT,
  cost_per_unit DECIMAL(10, 2) NOT NULL,
  total_cost DECIMAL(10, 2) NOT NULL,
  supplier TEXT,
  delivery_date DATE,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create invoices table
CREATE TABLE IF NOT EXISTS public.invoices (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  job_id UUID NOT NULL REFERENCES public.jobs(id) ON DELETE CASCADE,
  invoice_number TEXT NOT NULL UNIQUE,
  status TEXT CHECK (status IN ('draft', 'sent', 'paid', 'overdue', 'cancelled')) DEFAULT 'draft',
  total_amount DECIMAL(10, 2) NOT NULL,
  tax_amount DECIMAL(10, 2),
  paid_amount DECIMAL(10, 2) DEFAULT 0,
  due_date DATE NOT NULL,
  paid_date DATE,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create payments table
CREATE TABLE IF NOT EXISTS public.payments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  invoice_id UUID NOT NULL REFERENCES public.invoices(id) ON DELETE CASCADE,
  amount DECIMAL(10, 2) NOT NULL,
  payment_method TEXT CHECK (payment_method IN ('cash', 'check', 'credit_card', 'bank_transfer', 'other')),
  payment_date TIMESTAMP WITH TIME ZONE NOT NULL,
  reference_number TEXT,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.site_visits ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.estimates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.estimate_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.materials ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.invoices ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for profiles
CREATE POLICY "profiles_select_own" ON public.profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "profiles_insert_own" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);
CREATE POLICY "profiles_update_own" ON public.profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "profiles_delete_own" ON public.profiles FOR DELETE USING (auth.uid() = id);

-- Create RLS policies for customers
CREATE POLICY "customers_select_own" ON public.customers FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "customers_insert_own" ON public.customers FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "customers_update_own" ON public.customers FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "customers_delete_own" ON public.customers FOR DELETE USING (auth.uid() = user_id);

-- Create RLS policies for leads
CREATE POLICY "leads_select_own" ON public.leads FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "leads_insert_own" ON public.leads FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "leads_update_own" ON public.leads FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "leads_delete_own" ON public.leads FOR DELETE USING (auth.uid() = user_id);

-- Create RLS policies for site_visits
CREATE POLICY "site_visits_select_own" ON public.site_visits FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "site_visits_insert_own" ON public.site_visits FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "site_visits_update_own" ON public.site_visits FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "site_visits_delete_own" ON public.site_visits FOR DELETE USING (auth.uid() = user_id);

-- Create RLS policies for estimates
CREATE POLICY "estimates_select_own" ON public.estimates FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "estimates_insert_own" ON public.estimates FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "estimates_update_own" ON public.estimates FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "estimates_delete_own" ON public.estimates FOR DELETE USING (auth.uid() = user_id);

-- Create RLS policies for estimate_items
CREATE POLICY "estimate_items_select_own" ON public.estimate_items FOR SELECT 
  USING (estimate_id IN (SELECT id FROM public.estimates WHERE auth.uid() = user_id));
CREATE POLICY "estimate_items_insert_own" ON public.estimate_items FOR INSERT 
  WITH CHECK (estimate_id IN (SELECT id FROM public.estimates WHERE auth.uid() = user_id));
CREATE POLICY "estimate_items_update_own" ON public.estimate_items FOR UPDATE 
  USING (estimate_id IN (SELECT id FROM public.estimates WHERE auth.uid() = user_id));
CREATE POLICY "estimate_items_delete_own" ON public.estimate_items FOR DELETE 
  USING (estimate_id IN (SELECT id FROM public.estimates WHERE auth.uid() = user_id));

-- Create RLS policies for jobs
CREATE POLICY "jobs_select_own" ON public.jobs FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "jobs_insert_own" ON public.jobs FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "jobs_update_own" ON public.jobs FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "jobs_delete_own" ON public.jobs FOR DELETE USING (auth.uid() = user_id);

-- Create RLS policies for materials
CREATE POLICY "materials_select_own" ON public.materials FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "materials_insert_own" ON public.materials FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "materials_update_own" ON public.materials FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "materials_delete_own" ON public.materials FOR DELETE USING (auth.uid() = user_id);

-- Create RLS policies for invoices
CREATE POLICY "invoices_select_own" ON public.invoices FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "invoices_insert_own" ON public.invoices FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "invoices_update_own" ON public.invoices FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "invoices_delete_own" ON public.invoices FOR DELETE USING (auth.uid() = user_id);

-- Create RLS policies for payments
CREATE POLICY "payments_select_own" ON public.payments FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "payments_insert_own" ON public.payments FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "payments_update_own" ON public.payments FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "payments_delete_own" ON public.payments FOR DELETE USING (auth.uid() = user_id);
