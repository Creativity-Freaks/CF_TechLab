import { Helmet } from 'react-helmet-async';
import React, { useEffect, useMemo, useState } from 'react';
import { Header } from '@/components/Header';
import Footer from '@/components/Footer';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useProjectCount, useServices, useTestimonials } from '@/hooks/useData';
import { supabase } from '@/lib/supabase';
import { Link } from 'react-router-dom';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, BarChart, Bar, CartesianGrid } from 'recharts';

export default function AdminDashboardPage() {
  const { data: projectCount } = useProjectCount();
  const { data: services } = useServices();
  const { data: approvedTestimonials } = useTestimonials();
  const [pendingCount, setPendingCount] = useState<number>(0);

  useEffect(() => {
    async function loadPending() {
      if (!supabase) return;
      const { count } = await supabase
        .from('testimonials')
        .select('id', { count: 'exact', head: true })
        .eq('approved', false);
      setPendingCount(count || 0);
    }
    loadPending();
  }, []);

  // Build time-series metrics for last 6 months
  type SeriesPoint = { month: string; projects: number; testimonials: number; services: number };
  const [series, setSeries] = useState<SeriesPoint[]>([]);
  useEffect(() => {
    async function loadSeries() {
      if (!supabase) return;
      const now = new Date();
      const months: string[] = [];
      const buckets: Record<string, { projects: number; testimonials: number; services: number }> = {};
      for (let i = 5; i >= 0; i--) {
        const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
        const key = `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}`;
        months.push(key);
        buckets[key] = { projects: 0, testimonials: 0, services: 0 };
      }
      const fromDate = new Date(now.getFullYear(), now.getMonth() - 5, 1).toISOString();
      const toDate = new Date(now.getFullYear(), now.getMonth()+1, 1).toISOString();
      const [proj, testi, serv] = await Promise.all([
        supabase.from('projects').select('created_at').gte('created_at', fromDate).lt('created_at', toDate),
        supabase.from('testimonials').select('created_at').gte('created_at', fromDate).lt('created_at', toDate).eq('approved', true),
        supabase.from('services').select('created_at').gte('created_at', fromDate).lt('created_at', toDate),
      ]);
      const bucketInc = (rows: { created_at: string }[] | null | undefined, field: 'projects'|'testimonials'|'services') => {
        (rows || []).forEach((r: { created_at: string }) => {
          const d = new Date(r.created_at);
          const key = `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}`;
          if (buckets[key]) buckets[key][field]++;
        });
      };
      if (!proj.error) bucketInc(proj.data as { created_at: string }[] | null, 'projects');
      if (!testi.error) bucketInc(testi.data as { created_at: string }[] | null, 'testimonials');
      if (!serv.error) bucketInc(serv.data as { created_at: string }[] | null, 'services');
      setSeries(months.map(m => ({ month: m, projects: buckets[m].projects, testimonials: buckets[m].testimonials, services: buckets[m].services })));
    }
    loadSeries();
  }, []);

  const totalServices = (services || []).length;
  const totalApprovedTestimonials = (approvedTestimonials || []).length;

  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <title>Admin – Dashboard</title>
        <meta name="robots" content="noindex,nofollow" />
        {import.meta.env.VITE_SITE_URL && (
          <link rel="canonical" href={`${import.meta.env.VITE_SITE_URL}/admin`} />
        )}
      </Helmet>
      <Header />
      <main className="pt-24 pb-20 px-4 max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <Card className="p-5 space-y-2">
            <h3 className="font-semibold">Projects</h3>
            <p className="text-sm text-muted-foreground">Total: {projectCount ?? 0}</p>
            <div className="flex gap-2">
              <Button asChild><Link to="/admin/projects">Manage</Link></Button>
            </div>
          </Card>
          <Card className="p-5 space-y-2">
            <h3 className="font-semibold">Services</h3>
            <p className="text-sm text-muted-foreground">Total: {totalServices}</p>
            <div className="flex gap-2">
              <Button asChild><Link to="/admin/services">Manage</Link></Button>
            </div>
          </Card>
          <Card className="p-5 space-y-2">
            <h3 className="font-semibold">Testimonials</h3>
            <p className="text-sm text-muted-foreground">Approved: {totalApprovedTestimonials}</p>
            <p className="text-sm text-muted-foreground">Pending: {pendingCount}</p>
            <div className="flex gap-2">
              <Button asChild><Link to="/admin/testimonials">Manage</Link></Button>
            </div>
          </Card>
          <Card className="p-5 space-y-2">
            <h3 className="font-semibold">Admins</h3>
            <p className="text-sm text-muted-foreground">Manage roles and access</p>
            <div className="flex gap-2">
              <Button asChild><Link to="/admin/users">Manage</Link></Button>
            </div>
          </Card>
        </div>

        {/* Charts */}
        <section className="mt-10 space-y-6">
          <h2 className="text-xl font-semibold">Activity (Last 6 Months)</h2>
          <div className="grid gap-6 lg:grid-cols-2">
            <Card className="p-5">
              <h3 className="font-medium mb-2">New Items Over Time</h3>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={series}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis allowDecimals={false} />
                    <Tooltip />
                    <Line type="monotone" dataKey="projects" stroke="#6366f1" strokeWidth={2} />
                    <Line type="monotone" dataKey="services" stroke="#22c55e" strokeWidth={2} />
                    <Line type="monotone" dataKey="testimonials" stroke="#f59e0b" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </Card>
            <Card className="p-5">
              <h3 className="font-medium mb-2">Monthly Additions (Bar)</h3>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={series}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis allowDecimals={false} />
                    <Tooltip />
                    <Bar dataKey="projects" fill="#6366f1" />
                    <Bar dataKey="services" fill="#22c55e" />
                    <Bar dataKey="testimonials" fill="#f59e0b" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </Card>
          </div>
        </section>

        {/* Reports */}
        <section className="mt-10">
          <h2 className="text-xl font-semibold mb-3">Reports</h2>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => {
              const rows = [
                ['metric','value'],
                ['projects_total', String(projectCount ?? 0)],
                ['services_total', String(totalServices)],
                ['testimonials_approved', String(totalApprovedTestimonials)],
                ['testimonials_pending', String(pendingCount)],
              ];
              const csv = rows.map(r => r.join(',')).join('\n');
              const blob = new Blob([csv], { type: 'text/csv' });
              const url = URL.createObjectURL(blob);
              const a = document.createElement('a');
              a.href = url; a.download = `admin-summary-${Date.now()}.csv`; a.click();
              URL.revokeObjectURL(url);
            }}>Export Summary CSV</Button>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
