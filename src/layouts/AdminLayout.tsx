import React from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import {
  SidebarProvider,
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarSeparator,
  SidebarRail,
  SidebarInset,
  SidebarTrigger,
} from '@/components/ui/sidebar';
import { Button } from '@/components/ui/button';
import { signOut } from '@/hooks/useAuth';
import { LayoutDashboard, FolderGit2, MessagesSquare, Wrench, Users, LogOut } from 'lucide-react';

export default function AdminLayout() {
  const loc = useLocation();
  const isActive = (p: string) => (loc.pathname === p) || (p !== '/admin' && loc.pathname.startsWith(p));

  return (
    <SidebarProvider>
      <Sidebar variant="inset" collapsible="icon">
        <SidebarHeader>
          <div className="flex items-center gap-2 px-2">
            <SidebarTrigger />
            <span className="text-sm font-semibold">Admin</span>
          </div>
        </SidebarHeader>
        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupLabel>Dashboard</SidebarGroupLabel>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild isActive={isActive('/admin')}>
                  <Link to="/admin"><LayoutDashboard /> <span>Overview</span></Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroup>
          <SidebarSeparator />
          <SidebarGroup>
            <SidebarGroupLabel>Manage</SidebarGroupLabel>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild isActive={isActive('/admin/projects')}>
                  <Link to="/admin/projects"><FolderGit2 /> <span>Projects</span></Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild isActive={isActive('/admin/services')}>
                  <Link to="/admin/services"><Wrench /> <span>Services</span></Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild isActive={isActive('/admin/testimonials')}>
                  <Link to="/admin/testimonials"><MessagesSquare /> <span>Testimonials</span></Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild isActive={isActive('/admin/users')}>
                  <Link to="/admin/users"><Users /> <span>Users</span></Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroup>
        </SidebarContent>
        <SidebarFooter>
          <div className="px-2 py-1">
            <Button variant="outline" className="w-full justify-start gap-2" onClick={() => { signOut(); }}>
              <LogOut className="w-4 h-4" />
              Sign out
            </Button>
          </div>
        </SidebarFooter>
        <SidebarRail />
      </Sidebar>
      <SidebarInset>
        {/* Render the page inside the inset content area */}
        <Outlet />
      </SidebarInset>
    </SidebarProvider>
  );
}
