
"use client";

import { useState, useTransition, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogTrigger
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { 
  Users, 
  User, 
  Activity, 
  PlusCircle, 
  Loader2, 
  Ticket, 
  MoreHorizontal, 
  DollarSign,
  FileText,
  UserCheck,
  UserX,
  Edit,
  TrendingUp,
  Calendar,
  Filter,
  CheckSquare,
  AlertTriangle
} from "lucide-react";

import { useAuth } from "@/hooks/use-auth";
import { useToast } from "@/hooks/use-toast";
import { CustomerManagement } from "./customer-management";
import { getTodayRange, getLast7DaysRange, getLast30DaysRange, getTicketDate, getTodayDateString, isDateInRange } from "@/lib/date-utils";
import { calculateTodayMetrics, calculateMonthlyMetrics, calculateTotalMetrics, getDataQualityWarnings } from "@/lib/metrics-utils";
import type { Customer, Ticket as TicketType, Role, User as UserType } from "@/lib/types";
import { createAndSendTicket, createUser, updateUserAction, deleteUserAction, assignTicketRange, unlockUserAction, fixMissingPaymentModesAction } from "@/app/actions";

// In a real app, this data would come from your database/API
const mockBranches = [
    { id: '1', name: 'Headquarters', location: 'Addis Ababa' },
    { id: '2', name: 'Bole Branch', location: 'Bole, Addis Ababa' },
];

const userFormSchema = z.object({
  name: z.string().min(2, "Name is required"),
  phone: z.string().min(7, "Please enter a valid phone number."),
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters."),
  role: z.enum(['sales', 'auditor', 'operation'], { required_error: "Role is required" }), // Admins can create other non-admin roles
});

const ticketRangeSchema = z.object({
    userId: z.string({ required_error: "Please select a sales user."}),
    start: z.coerce.number().min(1, "Start number must be at least 1."),
    end: z.coerce.number().min(1, "End number must be at least 1."),
}).refine(data => data.end > data.start, {
    message: "End number must be greater than the start number.",
    path: ["end"],
});

type UserFormValues = z.infer<typeof userFormSchema>;
type TicketRangeFormValues = z.infer<typeof ticketRangeSchema>;

interface AdminDashboardProps {
  customers: Customer[];
  tickets: TicketType[];
  allUsers: UserType[];
  onDataChange: () => void;
  activeTab?: string;
}

export function AdminDashboard({ customers, tickets, allUsers, onDataChange, activeTab = 'dashboard' }: AdminDashboardProps) {
  const { user: currentUser } = useAuth();
  const { toast } = useToast();
  const [isPending, startTransition] = useTransition();
  
  const [isUserDialogOpen, setIsUserDialogOpen] = useState(false);
  const [isRangeDialogOpen, setIsRangeDialogOpen] = useState(false);
  const [isPasswordResetDialogOpen, setIsPasswordResetDialogOpen] = useState(false);
  const [userToReset, setUserToReset] = useState<UserType | null>(null);
  const [newPassword, setNewPassword] = useState<string>("");
  
  // Filter states
  const [selectedSalesPerson, setSelectedSalesPerson] = useState<string>("all");
  const [dateRange, setDateRange] = useState<string>("7"); // 7, 30, 90 days
  const [showFilters, setShowFilters] = useState(false);
  
  const users = currentUser ? allUsers.filter(u => u.branchId === currentUser.branchId) : [];
  const salesUsers = users.filter(u => u.role === 'sales');
  const roles: Role[] = ['sales', 'auditor', 'operation'];


  const userForm = useForm<UserFormValues>({
    resolver: zodResolver(userFormSchema),
    defaultValues: { name: "", phone: "", email: "", password: "", role: undefined },
  });
  
  const ticketRangeForm = useForm<TicketRangeFormValues>({
    resolver: zodResolver(ticketRangeSchema),
    defaultValues: { userId: "", start: "" as any, end: "" as any },
  });

  const handleCreateUser = (values: UserFormValues) => {
    if (!currentUser) return;
    startTransition(async () => {
      try {
        const { name, email, role, password } = values;
        await createUser({ name, email, role, password, branchId: currentUser.branchId });
        onDataChange();
        toast({ 
          title: "User Created", 
          description: `Account for ${values.name} has been successfully created.` 
        });
        setIsUserDialogOpen(false);
        userForm.reset();
      } catch (e: any) {
        toast({ 
          title: "Creation Failed", 
          description: e?.message || "Could not create user.", 
          variant: "destructive" 
        });
      }
    });
  };

  const handleAssignRange = (values: TicketRangeFormValues) => {
    startTransition(async () => {
      try {
        await assignTicketRange({ userId: values.userId, start: values.start, end: values.end });
        onDataChange();
        const user = users.find(u => u.id === values.userId);
        toast({ title: "Range Assigned", description: `Ticket range ${values.start}-${values.end} assigned to ${user?.name || 'user'}.` });
        setIsRangeDialogOpen(false);
        ticketRangeForm.reset();
      } catch (e: any) {
        toast({ title: "Assignment Failed", description: e?.message || "Could not assign range.", variant: "destructive" });
      }
    });
  }
  
  const getBranchName = (branchId: string) => {
    return mockBranches.find(b => b.id === branchId)?.name || "Unknown Branch";
  }

  const handleUserStatusChange = (userId: string, isActive: boolean) => {
    startTransition(async () => {
      try {
        await updateUserAction(userId, { isActive });
        onDataChange();
        toast({ title: "User Status Updated", description: `User ${isActive ? "activated" : "deactivated"}.` });
      } catch (e: any) {
        toast({ title: "Update Failed", description: e?.message || "Could not update user status.", variant: "destructive" });
      }
    });
  };

  const handlePasswordReset = (user: UserType) => {
    setUserToReset(user);
    setNewPassword("");
    setIsPasswordResetDialogOpen(true);
  };

  const handleUnlockUser = (userId: string, userName: string) => {
    startTransition(async () => {
      try {
        const result = await unlockUserAction(userId);
        if (result.success) {
          onDataChange();
          toast({ 
            title: "User Unlocked", 
            description: `Account for ${userName} has been unlocked successfully.` 
          });
        } else {
          toast({ 
            title: "Unlock Failed", 
            description: result.error || "Could not unlock user.", 
            variant: "destructive" 
          });
        }
      } catch (e: any) {
        toast({ 
          title: "Unlock Failed", 
          description: e?.message || "Could not unlock user.", 
          variant: "destructive" 
        });
      }
    });
  };

  const handleFixPaymentModes = () => {
    startTransition(async () => {
      try {
        const result = await fixMissingPaymentModesAction();
        if (result.success) {
          onDataChange(); // Refresh data to update the warning
          toast({ 
            title: "Payment Modes Fixed", 
            description: result.message || `Updated ${result.updated} ticket(s). ${result.cashCount} set to CASH, ${result.bankCount} set to BANK.` 
          });
        } else {
          toast({ 
            title: "Fix Failed", 
            description: result.error || "Could not fix payment modes.", 
            variant: "destructive" 
          });
        }
      } catch (e: any) {
        toast({ 
          title: "Fix Failed", 
          description: e?.message || "Could not fix payment modes.", 
          variant: "destructive" 
        });
      }
    });
  };

  const submitPasswordReset = () => {
    if (!userToReset) return;
    startTransition(async () => {
      try {
        await updateUserAction(userToReset.id, { password: newPassword || "password123" });
        onDataChange();
        toast({ title: "Password Updated", description: `Password changed for ${userToReset.name}.` });
        setIsPasswordResetDialogOpen(false);
        setUserToReset(null);
        setNewPassword("");
      } catch (e: any) {
        toast({ title: "Update Failed", description: e?.message || "Could not update password.", variant: "destructive" });
      }
    });
  };
  
  // Calculate dashboard metrics with filtering
  const today = new Date();
  const todayString = today.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
  
  // Filter tickets based on selected criteria
  const getFilteredTickets = () => {
    let filteredTickets = tickets;
    
    // Filter by salesperson
    if (selectedSalesPerson !== "all") {
      filteredTickets = filteredTickets.filter(t => t.preparedBy === selectedSalesPerson);
    }
    
    // Filter by date range
    const daysBack = parseInt(dateRange);
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - daysBack);
    
    filteredTickets = filteredTickets.filter(t => {
      const ticketDate = new Date(t.createdAt);
      return ticketDate >= cutoffDate;
    });
    
    return filteredTickets;
  };
  
  const filteredTickets = getFilteredTickets();
  
  // Calculate all metrics (use unfiltered tickets for main metrics)
  const nonVoided = tickets.filter(t => t.auditStatus !== 'Voided');
  const totalRevenue = nonVoided.reduce((s, t) => s + t.paymentAmount, 0);
  
  // Use centralized date utilities
  const todayRange = getTodayRange();
  const last7DaysRange = getLast7DaysRange();
  const last30DaysRange = getLast30DaysRange();
  
  const dailyRevenue = nonVoided
    .filter(t => isDateInRange(getTicketDate(t), todayRange))
    .reduce((s, t) => s + t.paymentAmount, 0);
    
  const weeklyRevenue = nonVoided
    .filter(t => isDateInRange(getTicketDate(t), last7DaysRange))
    .reduce((s, t) => s + t.paymentAmount, 0);
    
  const monthlyRevenue = nonVoided
    .filter(t => isDateInRange(getTicketDate(t), last30DaysRange))
    .reduce((s, t) => s + t.paymentAmount, 0);
    
  const totalTickets = nonVoided.length;
  const dailyTickets = nonVoided.filter(t => t.date === todayString).length;
  const approvedTickets = tickets.filter(t => t.auditStatus === 'Approved').length;
  const approvalRate = totalTickets > 0 ? (approvedTickets / totalTickets) * 100 : 0;
  const totalCustomers = customers.length;
  const activeCustomers = customers.filter(c => (c as any).isActive).length;
  const inactiveCustomers = customers.filter(c => !(c as any).isActive).length;
  const totalUsers = users.length;

  // Calculate metrics using centralized utilities
  const totalMetrics = calculateTotalMetrics(nonVoided);
  const todayMetrics = calculateTodayMetrics(nonVoided);
  const monthlyMetrics = calculateMonthlyMetrics(nonVoided);
  
  const totalCashCollect = totalMetrics.revenue.cash;
  const totalBankCollect = totalMetrics.revenue.bank;
  const todaysCashRevenue = todayMetrics.revenue.cash;
  const todaysBankRevenue = todayMetrics.revenue.bank;
  const monthlyCashRevenue = monthlyMetrics.revenue.cash;
  const monthlyBankRevenue = monthlyMetrics.revenue.bank;
  
  // Data quality warnings
  const dataQuality = getDataQualityWarnings(nonVoided);
  
  // Chart data preparation
  const getChartData = () => {
    const days = parseInt(dateRange);
    const chartData = [];
    
    for (let i = days - 1; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dateString = date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      });
      
      const dayTickets = filteredTickets.filter(t => t.date === dateString);
      const dayTicketsNonVoided = dayTickets.filter(t => (t as any).auditStatus !== 'Voided');
      const dayRevenue = dayTicketsNonVoided.reduce((sum, ticket) => sum + ticket.paymentAmount, 0);
      
      chartData.push({
        date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        tickets: dayTicketsNonVoided.length,
        revenue: dayRevenue
      });
    }
    
    return chartData;
  };
  
  const chartData = getChartData();

  // Map sidebar menu items to tab values
  const getTabValue = () => {
    if (activeTab === 'users') return 'users';
    if (activeTab === 'customers') return 'customers';
    if (activeTab === 'ticket-ranges') return 'ticket-ranges';
    return 'dashboard'; // default
  };

  const currentTab = getTabValue();

  return (
    <>
      {currentTab === 'dashboard' && (
        <div className="space-y-6">
          {/* Data Quality Warning */}
          {dataQuality.hasWarnings && (
            <Alert variant="destructive">
              <AlertTriangle className="h-4 w-4" />
              <AlertTitle>Data Quality Warning</AlertTitle>
              <AlertDescription className="flex items-center justify-between">
                <span>
                  {dataQuality.missingPaymentMode} ticket(s) are missing payment mode information. 
                  These tickets are being treated as CASH payments. Please update them to ensure accurate reporting.
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleFixPaymentModes}
                  disabled={isPending}
                  className="ml-4"
                >
                  {isPending ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Fixing...
                    </>
                  ) : (
                    "Fix Now"
                  )}
                </Button>
              </AlertDescription>
            </Alert>
          )}

          <Card>
            <CardHeader>
              <CardTitle>Welcome, Branch Admin!</CardTitle>
              <CardDescription>Here's an overview of your branch's operation: {getBranchName(currentUser?.branchId || '')}.</CardDescription>
            </CardHeader>
          </Card>
          
          {/* Filters */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <Filter className="h-5 w-5" />
                  Dashboard Filters
                </CardTitle>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => setShowFilters(!showFilters)}
                >
                  {showFilters ? 'Hide Filters' : 'Show Filters'}
                </Button>
              </div>
            </CardHeader>
            {showFilters && (
              <CardContent>
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Sales Person</label>
                    <Select value={selectedSalesPerson} onValueChange={setSelectedSalesPerson}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select sales person" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Sales People</SelectItem>
                        {salesUsers.map(user => (
                          <SelectItem key={user.id} value={user.name}>
                            {user.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Date Range</label>
                    <Select value={dateRange} onValueChange={setDateRange}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select date range" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="7">Last 7 days</SelectItem>
                        <SelectItem value="30">Last 30 days</SelectItem>
                        <SelectItem value="90">Last 90 days</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            )}
          </Card>
          
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
                <DollarSign className="h-4 w-4 text-green-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">ETB {totalRevenue.toFixed(2)}</div>
                <p className="text-xs text-muted-foreground">All time</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Daily Revenue</CardTitle>
                <DollarSign className="h-4 w-4 text-emerald-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">ETB {dailyRevenue.toFixed(2)}</div>
                <p className="text-xs text-muted-foreground">Today's revenue</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Weekly Revenue</CardTitle>
                <DollarSign className="h-4 w-4 text-teal-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">ETB {weeklyRevenue.toFixed(2)}</div>
                <p className="text-xs text-muted-foreground">Last 7 days</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Monthly Revenue</CardTitle>
                <DollarSign className="h-4 w-4 text-cyan-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">ETB {monthlyRevenue.toFixed(2)}</div>
                <p className="text-xs text-muted-foreground">Last 30 days</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Tickets</CardTitle>
                <FileText className="h-4 w-4 text-blue-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{totalTickets}</div>
                <p className="text-xs text-muted-foreground">All tickets</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Today Tickets</CardTitle>
                <FileText className="h-4 w-4 text-indigo-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{dailyTickets}</div>
                <p className="text-xs text-muted-foreground">Today's tickets</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Customers</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{totalCustomers}</div>
                <p className="text-xs text-muted-foreground">All customers</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Approved</CardTitle>
                <CheckSquare className="h-4 w-4 text-green-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{approvedTickets}</div>
                <p className="text-xs text-muted-foreground">Approved tickets</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Approval Rate</CardTitle>
                <Activity className="h-4 w-4 text-purple-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{approvalRate.toFixed(1)}%</div>
                <p className="text-xs text-muted-foreground">Approval percentage</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Branch Users</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{totalUsers}</div>
                <p className="text-xs text-muted-foreground">Branch users</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Active Customers</CardTitle>
                <UserCheck className="h-4 w-4 text-green-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{activeCustomers}</div>
                <p className="text-xs text-muted-foreground">Active customers</p>
              </CardContent>
            </Card>

            <Card className="border-2 border-blue-200">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Bank Collect</CardTitle>
                <DollarSign className="h-4 w-4 text-blue-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-blue-600">ETB {totalBankCollect.toFixed(2)}</div>
                <p className="text-xs text-muted-foreground">Bank payments (all time)</p>
              </CardContent>
            </Card>

            <Card className="border-2 border-green-200">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Cash Collect</CardTitle>
                <DollarSign className="h-4 w-4 text-green-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">ETB {totalCashCollect.toFixed(2)}</div>
                <p className="text-xs text-muted-foreground">Cash payments (all time)</p>
              </CardContent>
            </Card>

            <Card className="border-2 border-green-200">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Today's Cash Collection</CardTitle>
                <DollarSign className="h-4 w-4 text-green-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">ETB {todaysCashRevenue.toFixed(2)}</div>
                <p className="text-xs text-muted-foreground">Cash payments today</p>
              </CardContent>
            </Card>

            <Card className="border-2 border-blue-200">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Today's Bank Collection</CardTitle>
                <DollarSign className="h-4 w-4 text-blue-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-blue-600">ETB {todaysBankRevenue.toFixed(2)}</div>
                <p className="text-xs text-muted-foreground">Bank payments today</p>
              </CardContent>
            </Card>

            <Card className="border-2 border-green-200">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Monthly Cash Collection</CardTitle>
                <DollarSign className="h-4 w-4 text-green-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">ETB {monthlyCashRevenue.toFixed(2)}</div>
                <p className="text-xs text-muted-foreground">Cash payments (last 30 days)</p>
              </CardContent>
            </Card>

            <Card className="border-2 border-blue-200">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Monthly Bank Collection</CardTitle>
                <DollarSign className="h-4 w-4 text-blue-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-blue-600">ETB {monthlyBankRevenue.toFixed(2)}</div>
                <p className="text-xs text-muted-foreground">Bank payments (last 30 days)</p>
              </CardContent>
            </Card>
          </div>
          
          {/* Charts Section */}
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  Revenue Trend
                </CardTitle>
                <CardDescription>Daily revenue over the selected period</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-64 flex items-end justify-between gap-2">
                  {chartData.map((data, index) => {
                    const maxRevenue = Math.max(...chartData.map(d => d.revenue));
                    const height = maxRevenue > 0 ? (data.revenue / maxRevenue) * 200 : 0;
                    
                    return (
                      <div key={index} className="flex flex-col items-center gap-2 flex-1">
                        <div 
                          className="bg-primary rounded-t w-full transition-all duration-300 hover:bg-primary/80"
                          style={{ height: `${height}px` }}
                          title={`${data.date}: ETB ${data.revenue.toFixed(2)}`}
                        />
                        <span className="text-xs text-muted-foreground">{data.date}</span>
                        <span className="text-xs font-medium">ETB {data.revenue.toFixed(0)}</span>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Tickets Trend
                </CardTitle>
                <CardDescription>Daily tickets over the selected period</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-64 flex items-end justify-between gap-2">
                  {chartData.map((data, index) => {
                    const maxTickets = Math.max(...chartData.map(d => d.tickets));
                    const height = maxTickets > 0 ? (data.tickets / maxTickets) * 200 : 0;
                    
                    return (
                      <div key={index} className="flex flex-col items-center gap-2 flex-1">
                        <div 
                          className="bg-green-500 rounded-t w-full transition-all duration-300 hover:bg-green-600"
                          style={{ height: `${height}px` }}
                          title={`${data.date}: ${data.tickets} tickets`}
                        />
                        <span className="text-xs text-muted-foreground">{data.date}</span>
                        <span className="text-xs font-medium">{data.tickets}</span>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </div>
          
          {/* Summary Statistics */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Period Summary
              </CardTitle>
              <CardDescription>Key statistics for the selected period</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-4">
                <div className="text-center p-4 bg-muted rounded-lg">
                  <div className="text-2xl font-bold text-primary">ETB {filteredTickets.filter(t => (t as any).auditStatus !== 'Voided').reduce((sum, t) => sum + t.paymentAmount, 0).toFixed(2)}</div>
                  <div className="text-sm text-muted-foreground">Total Revenue</div>
                </div>
                <div className="text-center p-4 bg-muted rounded-lg">
                  <div className="text-2xl font-bold text-green-600">{filteredTickets.filter(t => (t as any).auditStatus !== 'Voided').length}</div>
                  <div className="text-sm text-muted-foreground">Total Tickets</div>
                </div>
                <div className="text-center p-4 bg-muted rounded-lg">
                  <div className="text-2xl font-bold text-blue-600">
                    {filteredTickets.filter(t => (t as any).auditStatus !== 'Voided').length > 0 ? (
                      filteredTickets.filter(t => (t as any).auditStatus !== 'Voided').reduce((sum, t) => sum + t.paymentAmount, 0) /
                      filteredTickets.filter(t => (t as any).auditStatus !== 'Voided').length
                    ).toFixed(2) : '0.00'}
                  </div>
                  <div className="text-sm text-muted-foreground">Avg. Ticket Value</div>
                </div>
                <div className="text-center p-4 bg-muted rounded-lg">
                  <div className="text-2xl font-bold text-purple-600">
                    {filteredTickets.filter(t => (t as any).auditStatus !== 'Voided').length > 0 ? (
                      filteredTickets.filter(t => (t as any).auditStatus === 'Approved').length /
                      filteredTickets.filter(t => (t as any).auditStatus !== 'Voided').length * 100
                    ).toFixed(1) : '0.0'}%
                  </div>
                  <div className="text-sm text-muted-foreground">Approval Rate</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {currentTab === 'users' && (
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>User Management</CardTitle>
              <CardDescription>Create users and assign ticket number ranges to sales staff for your branch.</CardDescription>
            </div>
            <div className="flex gap-2">
                <Dialog open={isRangeDialogOpen} onOpenChange={setIsRangeDialogOpen}>
                  <DialogTrigger asChild><Button variant="secondary"><Ticket className="mr-2 h-4 w-4" />Assign Range</Button></DialogTrigger>
                  <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                      <DialogTitle>Assign Ticket Number Range</DialogTitle>
                      <DialogDescription>Select a sales user from your branch and assign a start and end ticket number.</DialogDescription>
                    </DialogHeader>
                    <Form {...ticketRangeForm}>
                      <form onSubmit={ticketRangeForm.handleSubmit(handleAssignRange)} className="space-y-4 py-4">
                        <FormField control={ticketRangeForm.control} name="userId" render={({ field }) => (
                            <FormItem>
                              <FormLabel>Sales User</FormLabel>
                              <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl><SelectTrigger><SelectValue placeholder="Select a sales user" /></SelectTrigger></FormControl>
                                <SelectContent>
                                  {salesUsers.map(user => (<SelectItem key={user.id} value={user.id}>{user.name} ({user.email})</SelectItem>))}
                                </SelectContent>
                              </Select><FormMessage />
                            </FormItem>
                        )}/>
                        <div className="grid grid-cols-2 gap-4">
                           <FormField control={ticketRangeForm.control} name="start" render={({ field }) => (<FormItem><FormLabel>Start Number</FormLabel><FormControl><Input type="number" placeholder="1001" {...field} value={field.value ?? ""} /></FormControl><FormMessage /></FormItem>)} />
                           <FormField control={ticketRangeForm.control} name="end" render={({ field }) => (<FormItem><FormLabel>End Number</FormLabel><FormControl><Input type="number" placeholder="2000" {...field} value={field.value ?? ""} /></FormControl><FormMessage /></FormItem>)} />
                        </div>
                        <DialogFooter>
                          <Button type="submit" disabled={isPending}>
                            {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            Assign Range
                          </Button>
                        </DialogFooter>
                      </form>
                    </Form>
                  </DialogContent>
                </Dialog>
                <Dialog open={isUserDialogOpen} onOpenChange={setIsUserDialogOpen}>
                  <DialogTrigger asChild><Button><PlusCircle className="mr-2 h-4 w-4" />New User</Button></DialogTrigger>
                  <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                      <DialogTitle>Create New User</DialogTitle>
                      <DialogDescription>Fill out the form below to create a new user account for your branch. An initial password will be set.</DialogDescription>
                    </DialogHeader>
                     <Form {...userForm}>
                      <form onSubmit={userForm.handleSubmit(handleCreateUser)} className="space-y-4 py-4">
                        <FormField control={userForm.control} name="name" render={({ field }) => (<FormItem><FormLabel>Full Name</FormLabel><FormControl><Input placeholder="John Doe" {...field} /></FormControl><FormMessage /></FormItem>)} />
                        <FormField control={userForm.control} name="phone" render={({ field }) => (<FormItem><FormLabel>Phone Number</FormLabel><FormControl><Input type="tel" placeholder="0912 345 678" {...field} /></FormControl><FormMessage /></FormItem>)} />
                         <FormField control={userForm.control} name="email" render={({ field }) => (<FormItem><FormLabel>Email Address</FormLabel><FormControl><Input type="email" placeholder="name@company.com" {...field} /></FormControl><FormMessage /></FormItem>)} />
                         <FormField control={userForm.control} name="password" render={({ field }) => (<FormItem><FormLabel>Password</FormLabel><FormControl><Input type="password" placeholder="••••••••" {...field} /></FormControl><FormMessage /></FormItem>)} />
                         <FormField control={userForm.control} name="role" render={({ field }) => (<FormItem><FormLabel>Role</FormLabel><Select onValueChange={field.onChange} defaultValue={field.value}><FormControl><SelectTrigger><SelectValue placeholder="Select a role" /></SelectTrigger></FormControl><SelectContent>{roles.map(role => (<SelectItem key={role} value={role} className="capitalize">{role}</SelectItem>))}</SelectContent></Select><FormMessage /></FormItem>)} />
                        <DialogFooter>
                          <Button type="submit" disabled={isPending}>
                            {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            Create User
                          </Button>
                        </DialogFooter>
                      </form>
                    </Form>
                  </DialogContent>
                </Dialog>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Phone</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Ticket Range</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {users.map((user) => (
                  <TableRow key={user.id}>
                     <TableCell className="font-medium flex items-center gap-2">
                        {user.name}
                        <Badge variant={user.isActive ? "default" : "destructive"} className="border-none">
                            {user.isActive ? "Active" : "Inactive"}
                        </Badge>
                        {(user as any).isLocked && (
                          <Badge variant="destructive" className="border-none">
                            Locked
                          </Badge>
                        )}
                    </TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>{(user as any).phone || 'N/A'}</TableCell>
                    <TableCell><Badge variant="secondary" className="capitalize">{user.role}</Badge></TableCell>
                    <TableCell className="font-mono">
                        {user.role === 'sales' && user.ticketNumberStart && user.ticketNumberEnd
                          ? `${String(user.currentTicketNumber).padStart(6,'0')} / ${String(user.ticketNumberEnd).padStart(6,'0')}`
                          : 'N/A'}
                    </TableCell>
                     <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0">
                            <span className="sr-only">Open menu</span>
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          {(user as any).isLocked && (
                            <>
                              <DropdownMenuItem onClick={() => handleUnlockUser(user.id, user.name)}>
                                <UserCheck className="mr-2 h-4 w-4" />
                                Unlock Account
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                            </>
                          )}
                          <DropdownMenuItem onClick={() => handleUserStatusChange(user.id, !user.isActive)}>
                            {user.isActive ? "Deactivate User" : "Activate User"}
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handlePasswordReset(user)}>
                            Reset Password
                          </DropdownMenuItem>
                          {user.role === 'sales' && (
                            <DropdownMenuItem onClick={() => setIsRangeDialogOpen(true)}>
                              Assign Ticket Range
                            </DropdownMenuItem>
                          )}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}

      {currentTab === 'customers' && (
        <CustomerManagement 
          customers={customers} 
          tickets={tickets} 
          onDataChange={onDataChange}
          userRole={currentUser?.role}
        />
      )}

      {currentTab === 'ticket-ranges' && (
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Ticket Ranges Management</CardTitle>
              <CardDescription>View and manage ticket number ranges assigned to sales staff in your branch.</CardDescription>
            </div>
            <Dialog open={isRangeDialogOpen} onOpenChange={setIsRangeDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Ticket className="mr-2 h-4 w-4" />
                  Assign Range
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>Assign Ticket Number Range</DialogTitle>
                  <DialogDescription>Select a sales user from your branch and assign a start and end ticket number.</DialogDescription>
                </DialogHeader>
                <Form {...ticketRangeForm}>
                  <form onSubmit={ticketRangeForm.handleSubmit(handleAssignRange)} className="space-y-4 py-4">
                    <FormField control={ticketRangeForm.control} name="userId" render={({ field }) => (
                      <FormItem>
                        <FormLabel>Sales User</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select a sales user" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {salesUsers.map(user => (
                              <SelectItem key={user.id} value={user.id}>
                                {user.name} ({user.email})
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}/>
                    <div className="grid grid-cols-2 gap-4">
                      <FormField control={ticketRangeForm.control} name="start" render={({ field }) => (
                        <FormItem>
                          <FormLabel>Start Number</FormLabel>
                          <FormControl>
                            <Input type="number" placeholder="1001" {...field} value={field.value ?? ""} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )} />
                      <FormField control={ticketRangeForm.control} name="end" render={({ field }) => (
                        <FormItem>
                          <FormLabel>End Number</FormLabel>
                          <FormControl>
                            <Input type="number" placeholder="2000" {...field} value={field.value ?? ""} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )} />
                    </div>
                    <DialogFooter>
                      <Button type="submit" disabled={isPending}>
                        {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        Assign Range
                      </Button>
                    </DialogFooter>
                  </form>
                </Form>
              </DialogContent>
            </Dialog>
          </CardHeader>
          <CardContent className="space-y-4">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Sales User</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Assigned Range</TableHead>
                  <TableHead>Current Number</TableHead>
                  <TableHead>Generated</TableHead>
                  <TableHead>Remaining</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {salesUsers.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center text-muted-foreground py-8">
                      No sales users found in your branch.
                    </TableCell>
                  </TableRow>
                ) : (
                  salesUsers.map((user) => {
                    const hasRange = user.ticketNumberStart !== undefined && user.ticketNumberEnd !== undefined && user.currentTicketNumber !== undefined;
                    const generated = hasRange ? Math.max(0, (user.currentTicketNumber || 0) - (user.ticketNumberStart || 0)) : 0;
                    const remaining = hasRange ? Math.max(0, (user.ticketNumberEnd || 0) - (user.currentTicketNumber || 0) + 1) : 0;
                    const range = hasRange ? `${String(user.ticketNumberStart).padStart(5, '0')}-${String(user.ticketNumberEnd).padStart(5, '0')}` : 'Not Assigned';
                    
                    return (
                      <TableRow key={user.id}>
                        <TableCell className="font-medium">{user.name}</TableCell>
                        <TableCell>{user.email}</TableCell>
                        <TableCell className="font-mono">{range}</TableCell>
                        <TableCell className="font-mono">
                          {hasRange ? String(user.currentTicketNumber).padStart(6, '0') : 'N/A'}
                        </TableCell>
                        <TableCell className="text-green-600 font-semibold">{generated}</TableCell>
                        <TableCell className="text-primary font-semibold">{remaining}</TableCell>
                        <TableCell>
                          <Badge variant={hasRange ? "default" : "secondary"}>
                            {hasRange ? "Active" : "No Range"}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    );
                  })
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}
    
    {/* Password Reset Dialog */}
    <Dialog open={isPasswordResetDialogOpen} onOpenChange={setIsPasswordResetDialogOpen}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Reset Password</DialogTitle>
          <DialogDescription>Enter a new password for {userToReset?.name}.</DialogDescription>
        </DialogHeader>
        <div className="py-4">
          <Input 
            type="password" 
            placeholder="New password" 
            value={newPassword} 
            onChange={e => setNewPassword(e.target.value)} 
          />
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setIsPasswordResetDialogOpen(false)}>Cancel</Button>
          <Button onClick={submitPasswordReset} disabled={isPending}>
            {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Save
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
    </>
  );
}

    