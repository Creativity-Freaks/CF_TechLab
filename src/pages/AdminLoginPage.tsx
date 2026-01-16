import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Header } from '@/components/Header';
import Footer from '@/components/Footer';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/use-toast';
import { signIn, useSession } from '@/hooks/useAuth';
import { Navigate, useLocation, useNavigate } from 'react-router-dom';

export default function AdminLoginPage() {
  const { loading, isAdmin } = useSession();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const nav = useNavigate();
  const loc = useLocation();

  if (!loading && isAdmin) {
    return <Navigate to="/admin" replace />;
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    try {
      await signIn(email, password);
      toast({ title: 'Signed in', description: 'Welcome back.' });
      const state = loc.state as { from?: string } | null;
      const from = (state && state.from) ? state.from : '/admin';
      nav(from, { replace: true });
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Login failed';
      toast({ title: 'Error', description: msg });
    } finally { setSubmitting(false); }
  }

  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <title>Admin – Login</title>
        <meta name="robots" content="noindex,nofollow" />
        {import.meta.env.VITE_SITE_URL && (
          <link rel="canonical" href={`${import.meta.env.VITE_SITE_URL}/admin/login`} />
        )}
      </Helmet>
      <Header />
      <main className="pt-24 pb-20 px-4 max-w-md mx-auto">
        <h1 className="text-3xl font-bold mb-6">Admin Login</h1>
        <form onSubmit={submit} className="space-y-4">
          <Input value={email} onChange={e=>setEmail(e.target.value)} placeholder="Email" type="email" />
          <Input value={password} onChange={e=>setPassword(e.target.value)} placeholder="Password" type="password" />
          <Button type="submit" disabled={submitting || loading} className="w-full">{submitting ? 'Signing in…' : 'Sign In'}</Button>
          <p className="text-xs text-muted-foreground">Only whitelisted admin emails can access the dashboard.</p>
        </form>
      </main>
      <Footer />
    </div>
  );
}
