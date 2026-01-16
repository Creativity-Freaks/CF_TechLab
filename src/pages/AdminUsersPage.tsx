import { Helmet } from 'react-helmet-async';
import React, { useMemo, useState } from 'react';
import { Header } from '@/components/Header';
import Footer from '@/components/Footer';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { toast } from '@/components/ui/use-toast';
import { useAdmins } from '@/hooks/useData';
import { useCreateAdmin, useUpdateAdminRole, useDeleteAdmin } from '@/hooks/useMutations';

export default function AdminUsersPage() {
  const { data: admins, isLoading, refetch } = useAdmins();
  const items = admins || [];
  const [email, setEmail] = useState('');
  const [role, setRole] = useState<'admin'|'subadmin'>('subadmin');
  const createAdmin = useCreateAdmin();
  const updateRole = useUpdateAdminRole();
  const deleteAdmin = useDeleteAdmin();

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!email) { toast({ title: 'Missing email', description: 'Enter an email.' }); return; }
    try {
      await createAdmin.mutateAsync({ email, role });
      toast({ title: 'Added', description: `${email} added as ${role}` });
      setEmail(''); setRole('subadmin');
      await refetch();
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Create failed';
      toast({ title: 'Error', description: msg });
    }
  }

  async function changeRole(id: string, newRole: 'admin' | 'subadmin') {
    try {
      await updateRole.mutateAsync({ id, role: newRole });
      toast({ title: 'Updated', description: `Role changed to ${newRole}` });
      await refetch();
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Update failed';
      toast({ title: 'Error', description: msg });
    }
  }

  async function remove(id: string) {
    if (!confirm('Remove this admin?')) return;
    try {
      await deleteAdmin.mutateAsync(id);
      toast({ title: 'Removed', description: 'Access revoked' });
      await refetch();
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Delete failed';
      toast({ title: 'Error', description: msg });
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <title>Admin – Users</title>
        <meta name="robots" content="noindex,nofollow" />
        {import.meta.env.VITE_SITE_URL && (
          <link rel="canonical" href={`${import.meta.env.VITE_SITE_URL}/admin/users`} />
        )}
      </Helmet>
      <Header />
      <main className="pt-24 pb-20 px-4 max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Admin: Users & Roles</h1>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          <section>
            <h2 className="text-xl font-semibold mb-4">Add Admin/Subadmin</h2>
            <form onSubmit={submit} className="space-y-4">
              <Input value={email} onChange={e=>setEmail(e.target.value)} placeholder="Email" type="email" />
              <div className="flex items-center gap-2 text-sm">
                <span className="font-medium">Role</span>
                <button type="button" onClick={()=>setRole('admin')} className={`px-2 py-1 rounded-md border text-xs ${role==='admin' ? 'bg-primary text-primary-foreground' : 'bg-background'}`}>Admin</button>
                <button type="button" onClick={()=>setRole('subadmin')} className={`px-2 py-1 rounded-md border text-xs ${role==='subadmin' ? 'bg-primary text-primary-foreground' : 'bg-background'}`}>Subadmin</button>
              </div>
              <Button type="submit" disabled={createAdmin.isPending}>{createAdmin.isPending ? 'Adding...' : 'Add'}</Button>
              <p className="text-xs text-muted-foreground">Note: Create the user in Supabase Auth or let them sign up; adding here grants dashboard access.</p>
            </form>
          </section>
          <section>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold">Directory</h2>
              <Button variant="outline" onClick={()=>refetch()} disabled={isLoading}>Refresh</Button>
            </div>
            {isLoading && <div className="text-sm text-muted-foreground mb-3">Loading...</div>}
            <div className="grid gap-4">
              {items.map(u => (
                <Card key={u.id} className="p-4 flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold">{u.email}</h3>
                    <p className="text-xs text-muted-foreground">Role: {u.role}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button size="sm" variant="outline" onClick={()=>changeRole(u.id, u.role==='admin' ? 'subadmin' : 'admin')} disabled={updateRole.isPending}>{updateRole.isPending ? 'Working...' : (u.role==='admin' ? 'Make Subadmin' : 'Make Admin')}</Button>
                    <Button size="sm" variant="destructive" onClick={()=>remove(u.id)} disabled={deleteAdmin.isPending}>{deleteAdmin.isPending ? 'Working...' : 'Remove'}</Button>
                  </div>
                </Card>
              ))}
            </div>
          </section>
        </div>
      </main>
      <Footer />
    </div>
  );
}
