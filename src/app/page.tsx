

"use client";

import { useState, useEffect, useCallback, useMemo } from 'react';
import { LayoutDashboard, Ticket, Settings, LogOut, Building, Users, User, Loader2, Moon, Sun, UserRound, Lock, UserPlus, FileBarChart, CheckCircle2 } from 'lucide-react';
import { SalesDashboard } from '@/components/sales-dashboard';
import { SuperAdminDashboard } from '@/components/super-admin-dashboard';
import { AdminDashboard } from '@/components/admin-dashboard';
import { AuditorDashboard } from '@/components/auditor-dashboard';
import { OperationDashboard }from '@/components/operation-dashboard';
import { TicketForm } from '@/components/ticket-form';
import { TicketDashboard } from '@/components/ticket-dashboard';
import { CustomerRegistrationForm } from '@/components/customer-registration-form';
import { CustomerList } from '@/components/customer-list';
import { SalesReports } from '@/components/sales-reports';
import { AuditorApproval } from '@/components/auditor-approval';
import { CustomerManagement } from '@/components/customer-management';
import type { Ticket as TicketType, Customer as CustomerType, User as UserType } from '@/lib/types';
import { fetchTickets, fetchCustomers, fetchUsers, updateUserAction } from '@/app/actions';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from '@/components/ui/button';
import {
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarFooter,
  SidebarProvider,
  SidebarTrigger,
  SidebarInset,
} from "@/components/ui/sidebar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useAuth } from '@/hooks/use-auth';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';

export default function Home() {
  const [generatedHtml, setGeneratedHtml] = useState<string | null>(null);
  const [isTicketViewerOpen, setIsTicketViewerOpen] = useState(false);
  const { user, loading, logout } = useAuth();
  const router = useRouter();
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [settingsTab, setSettingsTab] = useState<'profile' | 'password' | 'prefs'>('profile');
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [isDark, setIsDark] = useState<boolean>(false);

  const [tickets, setTickets] = useState<TicketType[]>([]);
  const [customers, setCustomers] = useState<CustomerType[]>([]);
  const [users, setUsers] = useState<UserType[]>([]);
  const [dataLoading, setDataLoading] = useState(true);
  const [activeMenuItem, setActiveMenuItem] = useState<string>('dashboard');
  
  // Force a re-render when data changes in our mock DB
  const [dataVersion, setDataVersion] = useState(0);
  const forceRerender = useCallback(() => setDataVersion(v => v + 1), []);

  // Use stable user values for dependencies to prevent infinite loops
  const userId = user?.id ?? null;
  const userRole = user?.role ?? null;
  const userName = user?.name ?? null;
  const userContext = useMemo(() => {
    if (!user) return null;
    return { role: user.role, name: user.name, branchId: user.branchId };
  }, [userRole, userName, user?.branchId]);

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);
  
  useEffect(() => {
    if (userId && userRole && userName) {
      const fetchData = async () => {
        setDataLoading(true);
        try {
          const context = { role: userRole, name: userName, branchId: user?.branchId };
          
          // Add timeout to prevent hanging forever (increased to 30 seconds)
          const fetchWithTimeout = <T,>(promise: Promise<T>, timeoutMs: number = 30000): Promise<T> => {
            return Promise.race([
              promise,
              new Promise<T>((_, reject) => 
                setTimeout(() => reject(new Error(`Request timed out after ${timeoutMs}ms`)), timeoutMs)
              )
            ]);
          };
          
          // Fetch data with individual error handling to prevent one failure from blocking others
          const fetchDataWithFallback = async <T,>(
            fetchFn: () => Promise<T>,
            fallback: T,
            name: string
          ): Promise<T> => {
            try {
              return await fetchWithTimeout(fetchFn());
            } catch (error) {
              console.error(`[Home] Error fetching ${name}:`, error);
              return fallback;
            }
          };
          
          const [allTickets, allCustomers, allUsers] = await Promise.all([
            fetchDataWithFallback(() => fetchTickets(context), [], 'tickets'),
            fetchDataWithFallback(() => fetchCustomers(context), [], 'customers'),
            fetchDataWithFallback(() => fetchUsers(context), [], 'users'),
          ]);
          setCustomers(allCustomers || []);
          setTickets(allTickets || []);
          setUsers(allUsers || []);
        } catch (error) {
          console.error('[Home] Error fetching data:', error);
          // Set empty arrays on error so the page can still load
          setCustomers([]);
          setTickets([]);
          setUsers([]);
        } finally {
          setDataLoading(false);
        }
      };
      fetchData();
    } else {
      // If no user, set loading to false immediately
      setDataLoading(false);
    }
  }, [userId, userRole, userName]);
  
  // Separate effect to refetch data when dataVersion changes (triggered by forceRerender)
  useEffect(() => {
    if (userId && userRole && userName && dataVersion > 0) {
      const fetchData = async () => {
        try {
          const context = { role: userRole, name: userName, branchId: user?.branchId };
          
          // Add timeout to prevent hanging forever (increased to 30 seconds)
          const fetchWithTimeout = <T,>(promise: Promise<T>, timeoutMs: number = 30000): Promise<T> => {
            return Promise.race([
              promise,
              new Promise<T>((_, reject) => 
                setTimeout(() => reject(new Error(`Request timed out after ${timeoutMs}ms`)), timeoutMs)
              )
            ]);
          };
          
          // Fetch data with individual error handling to prevent one failure from blocking others
          const fetchDataWithFallback = async <T,>(
            fetchFn: () => Promise<T>,
            fallback: T,
            name: string
          ): Promise<T> => {
            try {
              return await fetchWithTimeout(fetchFn());
            } catch (error) {
              console.error(`[Home] Error fetching ${name}:`, error);
              return fallback;
            }
          };
          
          const [allTickets, allCustomers, allUsers] = await Promise.all([
            fetchDataWithFallback(() => fetchTickets(context), [], 'tickets'),
            fetchDataWithFallback(() => fetchCustomers(context), [], 'customers'),
            fetchDataWithFallback(() => fetchUsers(context), [], 'users'),
          ]);
          setCustomers(allCustomers || []);
          setTickets(allTickets || []);
          setUsers(allUsers || []);
        } catch (error) {
          console.error('[Home] Error refetching data:', error);
        }
      };
      fetchData();
    }
  }, [dataVersion, userId, userRole, userName]);

  // Avatar and theme boot
  useEffect(() => {
    const theme = localStorage.getItem('theme');
    const dark = theme === 'dark';
    setIsDark(dark);
    document.documentElement.classList.toggle('dark', dark);
  }, []);

  useEffect(() => {
    if (user?.email) {
      const stored = localStorage.getItem(`avatarUrl:${user.email}`);
      if (stored) setAvatarUrl(stored);
    }
  }, [user]);

  // All hooks must be defined before any conditional returns
  const handleTicketGenerated = useCallback((newTicket: TicketType, htmlContent: string) => {
    setGeneratedHtml(htmlContent);
    setIsTicketViewerOpen(true);
    forceRerender(); // Re-render to show the new ticket in the list
  }, [forceRerender]);
  
  const handleDataChange = useCallback(() => {
    forceRerender();
  }, [forceRerender]);

  const handleLogout = useCallback(async () => {
    await logout(); // logout now handles redirect internally with window.location
  }, [logout]);

  const handleToggleTheme = useCallback(() => {
    const next = !isDark;
    setIsDark(next);
    document.documentElement.classList.toggle('dark', next);
    localStorage.setItem('theme', next ? 'dark' : 'light');
  }, [isDark]);

  if (loading || dataLoading || !user) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  const handlePrint = () => {
    const iframe = document.getElementById('ticket-iframe') as HTMLIFrameElement;
    if (iframe) {
      iframe.contentWindow?.print();
    }
  };
  
  const renderDashboard = () => {
    switch (user?.role) {
      case 'superadmin':
        return <SuperAdminDashboard tickets={tickets} customers={customers} users={users} onDataChange={handleDataChange} activeTab={activeMenuItem} />;
      case 'admin':
        return <AdminDashboard tickets={tickets} customers={customers} allUsers={users} onDataChange={handleDataChange} activeTab={activeMenuItem} />;
      case 'sales':
        return <SalesDashboard onTicketGenerated={handleTicketGenerated} tickets={tickets} customers={customers} onDataChange={handleDataChange} />;
      case 'auditor':
        return <AuditorDashboard tickets={tickets} customers={customers} onDataChange={handleDataChange} />;
      case 'operation':
        return <OperationDashboard tickets={tickets} customers={customers} onDataChange={handleDataChange} />;
      default:
        // Default dashboard for other roles
        return (
          <Card>
              <CardHeader>
                <CardTitle>Welcome, {String(user?.role).charAt(0).toUpperCase() + String(user?.role).slice(1)}!</CardTitle>
                <CardDescription>Your dashboard is under construction. Please check back later.</CardDescription>
              </CardHeader>
              <CardContent>
                <p>Features specific to the '{user?.role}' role will be available here soon.</p>
              </CardContent>
            </Card>
        );
    }
  }

  const renderSidebarMenu = () => {
    const role = user?.role;

    // Sales role menu
    if (role === 'sales') {
      return (
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton 
              href="#" 
              isActive={activeMenuItem === 'dashboard'}
              onClick={(e) => { e.preventDefault(); setActiveMenuItem('dashboard'); }}
            >
              <LayoutDashboard />
              Dashboard
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton 
              href="#"
              isActive={activeMenuItem === 'generate-ticket'}
              onClick={(e) => { e.preventDefault(); setActiveMenuItem('generate-ticket'); }}
            >
              <Ticket />
              Generate Ticket
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton 
              href="#"
              isActive={activeMenuItem === 'register-customer'}
              onClick={(e) => { e.preventDefault(); setActiveMenuItem('register-customer'); }}
            >
              <UserPlus />
              Register Customer
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton 
              href="#"
              isActive={activeMenuItem === 'customer-list'}
              onClick={(e) => { e.preventDefault(); setActiveMenuItem('customer-list'); }}
            >
              <Users />
              Customer List
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton 
              href="#"
              isActive={activeMenuItem === 'reports'}
              onClick={(e) => { e.preventDefault(); setActiveMenuItem('reports'); }}
            >
              <FileBarChart />
              Reports
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton 
              href="#"
              isActive={activeMenuItem === 'auditor'}
              onClick={(e) => { e.preventDefault(); setActiveMenuItem('auditor'); }}
            >
              <CheckCircle2 />
              Auditor
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      );
    }

    // Superadmin role menu
    if (role === 'superadmin') {
      return (
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton 
              href="#" 
              isActive={activeMenuItem === 'dashboard'}
              onClick={(e) => { e.preventDefault(); setActiveMenuItem('dashboard'); }}
            >
              <LayoutDashboard />
              Dashboard
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton 
              href="#"
              isActive={activeMenuItem === 'branches'}
              onClick={(e) => { e.preventDefault(); setActiveMenuItem('branches'); }}
            >
              <Building />
              Branches
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton 
              href="#"
              isActive={activeMenuItem === 'users'}
              onClick={(e) => { e.preventDefault(); setActiveMenuItem('users'); }}
            >
              <Users />
              Users
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton 
              href="#"
              isActive={activeMenuItem === 'customers'}
              onClick={(e) => { e.preventDefault(); setActiveMenuItem('customers'); }}
            >
              <User />
              Customers
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton 
              href="#"
              isActive={activeMenuItem === 'customer-management'}
              onClick={(e) => { e.preventDefault(); setActiveMenuItem('customer-management'); }}
            >
              <Users />
              Customer Management
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton 
              href="#"
              isActive={activeMenuItem === 'transactions'}
              onClick={(e) => { e.preventDefault(); setActiveMenuItem('transactions'); }}
            >
              <Ticket />
              Recent Transactions
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      );
    }

    // Admin role menu
    if (role === 'admin') {
      return (
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton 
              href="#" 
              isActive={activeMenuItem === 'dashboard'}
              onClick={(e) => { e.preventDefault(); setActiveMenuItem('dashboard'); }}
            >
              <LayoutDashboard />
              Dashboard
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton 
              href="#"
              isActive={activeMenuItem === 'users'}
              onClick={(e) => { e.preventDefault(); setActiveMenuItem('users'); }}
            >
              <Users />
              Users
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton 
              href="#"
              isActive={activeMenuItem === 'customers'}
              onClick={(e) => { e.preventDefault(); setActiveMenuItem('customers'); }}
            >
              <User />
              Customers
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton 
              href="#"
              isActive={activeMenuItem === 'ticket-ranges'}
              onClick={(e) => { e.preventDefault(); setActiveMenuItem('ticket-ranges'); }}
            >
              <Ticket />
              Ticket Ranges
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      );
    }

    // Auditor role menu
    if (role === 'auditor') {
      return (
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton 
              href="#" 
              isActive={activeMenuItem === 'dashboard'}
              onClick={(e) => { e.preventDefault(); setActiveMenuItem('dashboard'); }}
            >
              <LayoutDashboard />
              Dashboard
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton 
              href="#"
              isActive={activeMenuItem === 'audit-tickets'}
              onClick={(e) => { e.preventDefault(); setActiveMenuItem('audit-tickets'); }}
            >
              <CheckCircle2 />
              Audit Tickets
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton 
              href="#"
              isActive={activeMenuItem === 'customers'}
              onClick={(e) => { e.preventDefault(); setActiveMenuItem('customers'); }}
            >
              <Users />
              Customers
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton 
              href="#"
              isActive={activeMenuItem === 'tickets'}
              onClick={(e) => { e.preventDefault(); setActiveMenuItem('tickets'); }}
            >
              <Ticket />
              Tickets
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      );
    }

    // Operation role menu
    if (role === 'operation') {
      return (
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton 
              href="#" 
              isActive={activeMenuItem === 'dashboard'}
              onClick={(e) => { e.preventDefault(); setActiveMenuItem('dashboard'); }}
            >
              <LayoutDashboard />
              Dashboard
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton 
              href="#"
              isActive={activeMenuItem === 'customers'}
              onClick={(e) => { e.preventDefault(); setActiveMenuItem('customers'); }}
            >
              <Users />
              Customers
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton 
              href="#"
              isActive={activeMenuItem === 'tickets'}
              onClick={(e) => { e.preventDefault(); setActiveMenuItem('tickets'); }}
            >
              <Ticket />
              Tickets
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      );
    }

    // Default menu for unknown roles
    return (
      <SidebarMenu>
        <SidebarMenuItem>
          <SidebarMenuButton 
            href="#" 
            isActive={activeMenuItem === 'dashboard'}
            onClick={(e) => { e.preventDefault(); setActiveMenuItem('dashboard'); }}
          >
            <LayoutDashboard />
            Dashboard
          </SidebarMenuButton>
        </SidebarMenuItem>
      </SidebarMenu>
    );
  }

  return (
    <SidebarProvider>
      <Sidebar>
        <SidebarHeader>
          <div className="flex items-center gap-2">
            <img 
              src="/images/logo.png" 
              alt="Gihon SACCOS Logo" 
              className="h-10 w-10 object-contain"
            />
            <h1 className="text-xl font-semibold text-sidebar-foreground">Gihon SACCOS</h1>
          </div>
        </SidebarHeader>
        <SidebarContent>
          {renderSidebarMenu()}
        </SidebarContent>
        <SidebarFooter>
           <SidebarMenu>
             <SidebarMenuItem>
              <SidebarMenuButton href="#" onClick={(e) => { e.preventDefault(); setIsSettingsOpen(true); }}>
                <Settings />
                Settings
              </SidebarMenuButton>
            </SidebarMenuItem>
             <SidebarMenuItem>
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <SidebarMenuButton>
                             <Avatar className="size-7">
                                <AvatarImage src={avatarUrl || `https://i.pravatar.cc/150?u=${user.email}`} />
                                <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                            </Avatar>
                            <span>{user.name}</span>
                        </SidebarMenuButton>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-56 mb-2 ml-2" side="top" align="start">
                        <DropdownMenuLabel>{user.email}</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onSelect={handleLogout}>
                            <LogOut className="mr-2 h-4 w-4" />
                            <span>Log out</span>
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarFooter>
      </Sidebar>
      <SidebarInset>
        <header className="flex flex-col gap-4 p-4 border-b">
            <div className="flex items-center justify-between">
                <SidebarTrigger />
                <h2 className="text-2xl font-bold">Dashboard</h2>
                <div className="flex items-center gap-3">
              <Button variant="ghost" size="icon" onClick={handleToggleTheme}>
                {isDark ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
                <span className="sr-only">Toggle theme</span>
              </Button>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="px-2">
                    <Avatar className="size-8">
                      <AvatarImage src={avatarUrl || `https://i.pravatar.cc/150?u=${user.email}`} />
                      <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-64">
                  <div className="px-3 py-2">
                    <div className="font-semibold leading-tight">{user.name}</div>
                    <div className="text-xs text-muted-foreground capitalize">{String(user.role)}</div>
                  </div>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onSelect={() => { setSettingsTab('profile'); setIsSettingsOpen(true); }}>
                    <UserRound className="mr-2 h-4 w-4" /> My Profile
                  </DropdownMenuItem>
                  <DropdownMenuItem onSelect={() => { setSettingsTab('password'); setIsSettingsOpen(true); }}>
                    <Lock className="mr-2 h-4 w-4" /> Change Password
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onSelect={handleLogout}>
                    <LogOut className="mr-2 h-4 w-4" /> Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
                </div>
            </div>
            {/* Main Menu Tabs */}
            <Tabs value={activeMenuItem} onValueChange={setActiveMenuItem} className="w-full">
              <TabsList className="w-full justify-start overflow-x-auto">
                {user?.role === 'sales' && (
                  <>
                    <TabsTrigger value="dashboard">
                      <LayoutDashboard className="mr-2 h-4 w-4" />
                      Dashboard
                    </TabsTrigger>
                    <TabsTrigger value="generate-ticket">
                      <Ticket className="mr-2 h-4 w-4" />
                      Generate Ticket
                    </TabsTrigger>
                    <TabsTrigger value="register-customer">
                      <UserPlus className="mr-2 h-4 w-4" />
                      Register Customer
                    </TabsTrigger>
                    <TabsTrigger value="customer-list">
                      <Users className="mr-2 h-4 w-4" />
                      Customer List
                    </TabsTrigger>
                    <TabsTrigger value="reports">
                      <FileBarChart className="mr-2 h-4 w-4" />
                      Reports
                    </TabsTrigger>
                    <TabsTrigger value="auditor">
                      <CheckCircle2 className="mr-2 h-4 w-4" />
                      Auditor
                    </TabsTrigger>
                  </>
                )}
                {user?.role === 'superadmin' && (
                  <>
                    <TabsTrigger value="dashboard">
                      <LayoutDashboard className="mr-2 h-4 w-4" />
                      Dashboard
                    </TabsTrigger>
                    <TabsTrigger value="branches">
                      <Building className="mr-2 h-4 w-4" />
                      Branches
                    </TabsTrigger>
                    <TabsTrigger value="users">
                      <Users className="mr-2 h-4 w-4" />
                      Users
                    </TabsTrigger>
                    <TabsTrigger value="customers">
                      <User className="mr-2 h-4 w-4" />
                      Customers
                    </TabsTrigger>
                    <TabsTrigger value="customer-management">
                      <Users className="mr-2 h-4 w-4" />
                      Customer Management
                    </TabsTrigger>
                    <TabsTrigger value="transactions">
                      <Ticket className="mr-2 h-4 w-4" />
                      Recent Transactions
                    </TabsTrigger>
                  </>
                )}
                {user?.role === 'admin' && (
                  <>
                    <TabsTrigger value="dashboard">
                      <LayoutDashboard className="mr-2 h-4 w-4" />
                      Dashboard
                    </TabsTrigger>
                    <TabsTrigger value="users">
                      <Users className="mr-2 h-4 w-4" />
                      Users
                    </TabsTrigger>
                    <TabsTrigger value="customers">
                      <User className="mr-2 h-4 w-4" />
                      Customers
                    </TabsTrigger>
                    <TabsTrigger value="ticket-ranges">
                      <Ticket className="mr-2 h-4 w-4" />
                      Ticket Ranges
                    </TabsTrigger>
                  </>
                )}
                {user?.role === 'auditor' && (
                  <>
                    <TabsTrigger value="dashboard">
                      <LayoutDashboard className="mr-2 h-4 w-4" />
                      Dashboard
                    </TabsTrigger>
                    <TabsTrigger value="audit-tickets">
                      <CheckCircle2 className="mr-2 h-4 w-4" />
                      Audit Tickets
                    </TabsTrigger>
                    <TabsTrigger value="customers">
                      <Users className="mr-2 h-4 w-4" />
                      Customers
                    </TabsTrigger>
                    <TabsTrigger value="tickets">
                      <Ticket className="mr-2 h-4 w-4" />
                      Tickets
                    </TabsTrigger>
                  </>
                )}
                {user?.role === 'operation' && (
                  <>
                    <TabsTrigger value="dashboard">
                      <LayoutDashboard className="mr-2 h-4 w-4" />
                      Dashboard
                    </TabsTrigger>
                    <TabsTrigger value="customers">
                      <Users className="mr-2 h-4 w-4" />
                      Customers
                    </TabsTrigger>
                    <TabsTrigger value="tickets">
                      <Ticket className="mr-2 h-4 w-4" />
                      Tickets
                    </TabsTrigger>
                  </>
                )}
              </TabsList>
            </Tabs>
        </header>
        <main className="container mx-auto p-4 md:p-8">
          {/* Sales role menu items */}
          {user?.role === 'sales' && (
            <>
              {activeMenuItem === 'dashboard' && renderDashboard()}
              {activeMenuItem === 'generate-ticket' && (
                <TicketForm onTicketGenerated={handleTicketGenerated} customers={customers} />
              )}
              {activeMenuItem === 'register-customer' && (
                <CustomerRegistrationForm onDataChange={handleDataChange} />
              )}
              {activeMenuItem === 'customer-list' && (
                <CustomerList customers={customers} tickets={tickets} />
              )}
              {activeMenuItem === 'reports' && (
                <SalesReports tickets={tickets} customers={customers} />
              )}
              {activeMenuItem === 'auditor' && (
                <AuditorApproval onDataChange={handleDataChange} />
              )}
            </>
          )}

          {/* Superadmin role menu items */}
          {user?.role === 'superadmin' && (
            <>
              {renderDashboard()}
            </>
          )}

          {/* Admin role menu items */}
          {user?.role === 'admin' && (
            <>
              {renderDashboard()}
            </>
          )}

          {/* Auditor role menu items */}
          {user?.role === 'auditor' && (
            <>
              {activeMenuItem === 'dashboard' && renderDashboard()}
              {activeMenuItem === 'audit-tickets' && (
                <AuditorApproval onDataChange={handleDataChange} />
              )}
              {activeMenuItem === 'customers' && (
                <CustomerList customers={customers} tickets={tickets} showPaymentFilters={true} showDateFilter={true} />
              )}
              {activeMenuItem === 'tickets' && (
                <TicketDashboard tickets={tickets} showDateFilter={true} showPaymentFilters={true} />
              )}
            </>
          )}

          {/* Operation role menu items */}
          {user?.role === 'operation' && (
            <>
              {activeMenuItem === 'dashboard' && renderDashboard()}
              {activeMenuItem === 'customers' && (
                <CustomerList customers={customers} tickets={tickets} />
              )}
              {activeMenuItem === 'tickets' && (
                <TicketDashboard tickets={tickets} />
              )}
            </>
          )}

          {/* Default for unknown roles */}
          {!['sales', 'superadmin', 'admin', 'auditor', 'operation'].includes(user?.role || '') && (
            activeMenuItem === 'dashboard' && renderDashboard()
          )}
        </main>
      </SidebarInset>

      <Dialog open={isTicketViewerOpen} onOpenChange={setIsTicketViewerOpen}>
        <DialogContent className="max-w-4xl h-[90vh] flex flex-col">
          <DialogHeader>
            <DialogTitle>Generated Ticket</DialogTitle>
            <DialogDescription>
              This is a preview of your ticket. You can print it or save it as a PDF from your browser's print dialog.
            </DialogDescription>
          </DialogHeader>
          <div className="flex-grow border rounded-md overflow-hidden">
             {generatedHtml && (
                <iframe
                  id="ticket-iframe"
                  srcDoc={generatedHtml}
                  className="w-full h-full border-0"
                  />
              )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsTicketViewerOpen(false)}>Close</Button>
            <Button onClick={handlePrint}>Print / Save as PDF</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Settings Dialog */}
      <Dialog open={isSettingsOpen} onOpenChange={setIsSettingsOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Account Settings</DialogTitle>
            <DialogDescription>Manage your profile, password, and preferences.</DialogDescription>
          </DialogHeader>
          <Tabs value={settingsTab} onValueChange={(v) => setSettingsTab(v as any)}>
            <TabsList className="grid grid-cols-3 mb-4">
              <TabsTrigger value="profile">My Profile</TabsTrigger>
              <TabsTrigger value="password">Change Password</TabsTrigger>
              <TabsTrigger value="prefs">Preferences</TabsTrigger>
            </TabsList>

            <TabsContent value="profile">
              <Card>
                <CardHeader>
                  <CardTitle>My Profile</CardTitle>
                  <CardDescription>View your profile and update your avatar.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center gap-4">
                    <Avatar className="h-16 w-16">
                      <AvatarImage src={avatarUrl || `https://i.pravatar.cc/150?u=${user.email}`} />
                      <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (!file) return;
                          const reader = new FileReader();
                          reader.onload = () => {
                            const url = String(reader.result || '');
                            setAvatarUrl(url);
                            if (user?.email) localStorage.setItem(`avatarUrl:${user.email}`, url);
                          };
                          reader.readAsDataURL(file);
                        }}
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <div className="text-muted-foreground">Full Name</div>
                      <div className="font-medium">{user.name}</div>
                    </div>
                    <div>
                      <div className="text-muted-foreground">Username</div>
                      <div className="font-medium">{user.name.toLowerCase().replace(/\s+/g, '')}</div>
                    </div>
                    <div>
                      <div className="text-muted-foreground">Email</div>
                      <div className="font-medium">{user.email}</div>
                    </div>
                    <div>
                      <div className="text-muted-foreground">Phone</div>
                      <div className="font-medium">{(user as any).phone || '—'}</div>
                    </div>
                    <div>
                      <div className="text-muted-foreground">Role</div>
                      <div className="font-medium">{String(user.role)}</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="password">
              <Card>
                <CardHeader>
                  <CardTitle>Change Password</CardTitle>
                  <CardDescription>Update your account password. Choose a strong, unique password.</CardDescription>
                </CardHeader>
                <CardContent>
                  <ChangePasswordForm userId={user.id} currentPassword={(user as any).password} onChanged={() => {
                    const stored = localStorage.getItem('user');
                    if (stored) {
                      const u = JSON.parse(stored);
                      u.password = undefined;
                      localStorage.setItem('user', JSON.stringify(u));
                    }
                  }} />
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="prefs">
              <Card>
                <CardHeader>
                  <CardTitle>Preferences</CardTitle>
                  <CardDescription>Appearance and session options.</CardDescription>
                </CardHeader>
                <CardContent className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    {isDark ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
                    <div>
                      <div className="font-medium">Dark Mode</div>
                      <div className="text-sm text-muted-foreground">Toggle between light and dark themes.</div>
                    </div>
                  </div>
                  <Button variant="outline" onClick={handleToggleTheme}>{isDark ? 'Disable' : 'Enable'}</Button>
                </CardContent>
              </Card>
            </TabsContent>

            <div className="flex items-center justify-end gap-2 mt-4">
              <Button variant="outline" onClick={() => setIsSettingsOpen(false)}>Close</Button>
              <Button variant="destructive" onClick={handleLogout}>
                <LogOut className="mr-2 h-4 w-4" />
                Log out
              </Button>
            </div>
          </Tabs>
        </DialogContent>
      </Dialog>
    </SidebarProvider>
  );
}

// --- Change Password Form ---
function ChangePasswordForm({ userId, currentPassword, onChanged }: { userId: string; currentPassword?: string; onChanged: () => void }) {
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isPending, setIsPending] = useState(false);
  const { user } = useAuth();
  const { push } = useRouter();
  const { /* not used here */ } = useState(null as any);

  const meetsPolicy = (pwd: string) => {
    return (
      pwd.length >= 8 &&
      /[A-Z]/.test(pwd) &&
      /[a-z]/.test(pwd) &&
      /\d/.test(pwd) &&
      /[!@#$%^&*]/.test(pwd)
    );
  };

  const onSubmit = async () => {
    if (!oldPassword || !newPassword || !confirmPassword) return;
    if (currentPassword && oldPassword !== currentPassword) {
      alert('Old password is incorrect');
      return;
    }
    if (newPassword !== confirmPassword) {
      alert('New passwords do not match');
      return;
    }
    if (!meetsPolicy(newPassword)) {
      alert('Password does not meet the policy');
      return;
    }
    setIsPending(true);
    try {
      await updateUserAction(userId, { password: newPassword });
      // Update local storage user to keep session consistent
      const stored = localStorage.getItem('user');
      if (stored) {
        const u = JSON.parse(stored);
        if (u && u.id === userId) {
          u.password = newPassword;
          localStorage.setItem('user', JSON.stringify(u));
        }
      }
      alert('Password changed successfully');
      setOldPassword("");
      setNewPassword("");
      setConfirmPassword("");
      onChanged();
    } finally {
      setIsPending(false);
    }
  };

  return (
    <div className="space-y-3">
      <div>
        <div className="text-sm text-muted-foreground">Old Password</div>
        <input type="password" className="w-full border rounded-md px-3 py-2" placeholder="Enter your current password" value={oldPassword} onChange={e => setOldPassword(e.target.value)} />
      </div>
      <div>
        <div className="text-sm text-muted-foreground">New Password</div>
        <input type="password" className="w-full border rounded-md px-3 py-2" placeholder="Enter new password" value={newPassword} onChange={e => setNewPassword(e.target.value)} />
        <div className="text-xs text-muted-foreground mt-1">Password policy: Min 8 chars; include uppercase, lowercase, number, and special (!@#$%^&*).</div>
      </div>
      <div>
        <div className="text-sm text-muted-foreground">Confirm New Password</div>
        <input type="password" className="w-full border rounded-md px-3 py-2" placeholder="Confirm new password" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} />
      </div>
      <div className="flex justify-end gap-2 pt-2">
        <Button variant="outline" onClick={() => { setOldPassword(""); setNewPassword(""); setConfirmPassword(""); }}>Cancel</Button>
        <Button onClick={onSubmit} disabled={isPending}>{isPending ? 'Changing...' : 'Change Password'}</Button>
      </div>
    </div>
  );
}
