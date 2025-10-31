-- Profiles RLS Policies
CREATE POLICY "profiles_select_own" ON public.profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "profiles_insert_own" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);
CREATE POLICY "profiles_update_own" ON public.profiles FOR UPDATE USING (auth.uid() = id);

-- Customers RLS Policies - Managers and admins can view all, customers see their own
CREATE POLICY "customers_select_all" ON public.customers FOR SELECT USING (
  (SELECT role FROM public.profiles WHERE id = auth.uid()) IN ('manager', 'admin', 'billing', 'procurement')
  OR created_by = auth.uid()
);
CREATE POLICY "customers_insert" ON public.customers FOR INSERT WITH CHECK (
  (SELECT role FROM public.profiles WHERE id = auth.uid()) IN ('manager', 'admin')
);
CREATE POLICY "customers_update" ON public.customers FOR UPDATE USING (
  (SELECT role FROM public.profiles WHERE id = auth.uid()) IN ('manager', 'admin')
);

-- Leads RLS Policies
CREATE POLICY "leads_select_all" ON public.leads FOR SELECT USING (
  (SELECT role FROM public.profiles WHERE id = auth.uid()) IN ('manager', 'admin', 'billing', 'procurement')
  OR created_by = auth.uid()
);
CREATE POLICY "leads_insert" ON public.leads FOR INSERT WITH CHECK (
  (SELECT role FROM public.profiles WHERE id = auth.uid()) IN ('manager', 'admin')
);
CREATE POLICY "leads_update" ON public.leads FOR UPDATE USING (
  (SELECT role FROM public.profiles WHERE id = auth.uid()) IN ('manager', 'admin')
);

-- Site Visits RLS Policies
CREATE POLICY "site_visits_select_all" ON public.site_visits FOR SELECT USING (
  (SELECT role FROM public.profiles WHERE id = auth.uid()) IN ('manager', 'admin', 'billing', 'procurement')
);
CREATE POLICY "site_visits_insert" ON public.site_visits FOR INSERT WITH CHECK (
  (SELECT role FROM public.profiles WHERE id = auth.uid()) IN ('manager', 'admin')
);
CREATE POLICY "site_visits_update" ON public.site_visits FOR UPDATE USING (
  (SELECT role FROM public.profiles WHERE id = auth.uid()) IN ('manager', 'admin')
);

-- Estimates RLS Policies
CREATE POLICY "estimates_select_all" ON public.estimates FOR SELECT USING (
  (SELECT role FROM public.profiles WHERE id = auth.uid()) IN ('manager', 'admin', 'billing', 'procurement')
  OR created_by = auth.uid()
);
CREATE POLICY "estimates_insert" ON public.estimates FOR INSERT WITH CHECK (
  (SELECT role FROM public.profiles WHERE id = auth.uid()) IN ('manager', 'admin')
);
CREATE POLICY "estimates_update" ON public.estimates FOR UPDATE USING (
  (SELECT role FROM public.profiles WHERE id = auth.uid()) IN ('manager', 'admin')
);

-- Jobs RLS Policies
CREATE POLICY "jobs_select_all" ON public.jobs FOR SELECT USING (
  (SELECT role FROM public.profiles WHERE id = auth.uid()) IN ('manager', 'admin', 'billing', 'procurement')
);
CREATE POLICY "jobs_insert" ON public.jobs FOR INSERT WITH CHECK (
  (SELECT role FROM public.profiles WHERE id = auth.uid()) IN ('manager', 'admin')
);
CREATE POLICY "jobs_update" ON public.jobs FOR UPDATE USING (
  (SELECT role FROM public.profiles WHERE id = auth.uid()) IN ('manager', 'admin')
);

-- Materials RLS Policies
CREATE POLICY "materials_select_all" ON public.materials FOR SELECT USING (
  (SELECT role FROM public.profiles WHERE id = auth.uid()) IN ('manager', 'admin', 'billing', 'procurement')
);
CREATE POLICY "materials_insert" ON public.materials FOR INSERT WITH CHECK (
  (SELECT role FROM public.profiles WHERE id = auth.uid()) IN ('manager', 'admin', 'procurement')
);
CREATE POLICY "materials_update" ON public.materials FOR UPDATE USING (
  (SELECT role FROM public.profiles WHERE id = auth.uid()) IN ('manager', 'admin', 'procurement')
);

-- Invoices RLS Policies
CREATE POLICY "invoices_select_all" ON public.invoices FOR SELECT USING (
  (SELECT role FROM public.profiles WHERE id = auth.uid()) IN ('manager', 'admin', 'billing')
);
CREATE POLICY "invoices_insert" ON public.invoices FOR INSERT WITH CHECK (
  (SELECT role FROM public.profiles WHERE id = auth.uid()) IN ('manager', 'admin', 'billing')
);
CREATE POLICY "invoices_update" ON public.invoices FOR UPDATE USING (
  (SELECT role FROM public.profiles WHERE id = auth.uid()) IN ('manager', 'admin', 'billing')
);

-- Payments RLS Policies
CREATE POLICY "payments_select_all" ON public.payments FOR SELECT USING (
  (SELECT role FROM public.profiles WHERE id = auth.uid()) IN ('manager', 'admin', 'billing')
);
CREATE POLICY "payments_insert" ON public.payments FOR INSERT WITH CHECK (
  (SELECT role FROM public.profiles WHERE id = auth.uid()) IN ('manager', 'admin', 'billing')
);
