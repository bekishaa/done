
"use client";

import { useState, useTransition, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
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
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  BarChart,
  Bar,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { 
  Building, 
  Users, 
  User, 
  Activity, 
  PlusCircle, 
  Loader2, 
  Ticket, 
  MoreHorizontal, 
  Trash2,
  BarChart3,
  DollarSign,
  FileText,
  CheckSquare,
  Edit,
  UserCheck
} from "lucide-react";

import { useToast } from "@/hooks/use-toast";
import { CustomerList } from "./customer-list";
import { CustomerManagement } from "./customer-management";
import { AuditorApproval } from "./auditor-approval";
import { TicketDashboard } from "./ticket-dashboard";
import { getTodayRange, getLast7DaysRange, getLast30DaysRange, getTicketDate, getTodayDateString, isDateInRange } from "@/lib/date-utils";
import { calculateTodayMetrics, calculateMonthlyMetrics, calculateTotalMetrics, getDataQualityWarnings } from "@/lib/metrics-utils";
import type { Customer, Ticket as TicketType, Role, User as UserType } from "@/lib/types";
import { 
  assignTicketRange, 
  backupDatabase, 
  createUser, 
  deleteUserAction, 
  updateUserAction,
  unlockUserAction,
  fetchSalesTransactions, 
  fetchUsers
} from "@/app/actions";

// In a real app, this data would come from your database/API
const mockBranches = [
    { id: '1', name: 'Headquarters', location: 'Addis Ababa', isActive: true },
    { id: '2', name: 'Bole Branch', location: 'Bole, Addis Ababa', isActive: true },
];

const userFormSchema = z.object({
  name: z.string().min(2, "Name is required"),
  phone: z.string().min(7, "Please enter a valid phone number."),
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters."),
  role: z.enum(['admin', 'sales', 'auditor', 'operation'], { required_error: "Role is required" }), // Superadmin cannot be created from UI
  branchId: z.string({ required_error: "Branch is required" }),
});

const branchFormSchema = z.object({
  name: z.string().min(3, "Branch name is required"),
  location: z.string().min(3, "Location is required"),
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
type BranchFormValues = z.infer<typeof branchFormSchema>;
type TicketRangeFormValues = z.infer<typeof ticketRangeSchema>;

interface SuperAdminDashboardProps {
  customers: Customer[];
  tickets: TicketType[];
  users: UserType[];
  onDataChange: () => void;
  activeTab?: string;
}

export function SuperAdminDashboard({ customers, tickets, users, onDataChange, activeTab = 'dashboard' }: SuperAdminDashboardProps) {
  const { toast } = useToast();
  const [isPending, startTransition] = useTransition();
  
  const [isUserDialogOpen, setIsUserDialogOpen] = useState(false);
  const [isUserEditDialogOpen, setIsUserEditDialogOpen] = useState(false);
  const [userToEdit, setUserToEdit] = useState<UserType | null>(null);
  const [isBranchDialogOpen, setIsBranchDialogOpen] = useState(false);
  const [isBranchEditDialogOpen, setIsBranchEditDialogOpen] = useState(false);
  const [isRangeDialogOpen, setIsRangeDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState<UserType | null>(null);
  const [branchToEdit, setBranchToEdit] = useState<{ id: string; name: string; location: string; isActive: boolean } | null>(null);
  
  // Performance dashboard state
  const [salesUsers, setSalesUsers] = useState<UserType[]>([]);
  const [selectedSalesPerson, setSelectedSalesPerson] = useState<string>("all");
  const [selectedBranchId, setSelectedBranchId] = useState<string>("all");
  const [performanceData, setPerformanceData] = useState<{
    totalRevenue: number;
    totalTickets: number;
    sentTickets: number;
    approvedTickets: number;
    pendingTickets: number;
    rejectedTickets: number;
    totalCustomers: number;
    activeCustomers: number;
    dailyPerformance: Array<{ date: string; tickets: number; revenue: number; approved: number; pending: number }>;
    averageTicketValue: number;
    approvalRate: number;
    cashRevenue: number;
    bankRevenue: number;
  } | null>(null);
  const [branchPerformance, setBranchPerformance] = useState<{ branchId: string; branchName: string; totalRevenue: number; totalTickets: number; cashRevenue: number; bankRevenue: number }[]>([]);
  
  const [branches, setBranches] = useState(() => {
    if (typeof window === 'undefined') return mockBranches;
    try {
      const stored = localStorage.getItem('rr.branches');
      return stored ? JSON.parse(stored) : mockBranches;
    } catch {
      return mockBranches;
    }
  });

  // Persist branches to localStorage whenever they change
  useEffect(() => {
    try {
      localStorage.setItem('rr.branches', JSON.stringify(branches));
    } catch {
      // ignore storage errors
    }
  }, [branches]);
  
  const salesUsersList = users.filter(u => u.role === 'sales');
  const roles: Role[] = ['admin', 'sales', 'auditor', 'operation'];

  const userForm = useForm<UserFormValues>({
    resolver: zodResolver(userFormSchema),
    defaultValues: { name: "", phone: "", email: "", password: "", role: undefined, branchId: "" },
  });

  const userEditFormSchema = userFormSchema.extend({ password: z.string().optional() });
  const userEditForm = useForm<z.infer<typeof userEditFormSchema>>({
    resolver: zodResolver(userEditFormSchema),
    defaultValues: { name: "", phone: "", email: "", password: "", role: undefined, branchId: "" },
  });
  
  const branchForm = useForm<BranchFormValues>({
    resolver: zodResolver(branchFormSchema),
    defaultValues: { name: "", location: "" },
  });

  const branchEditForm = useForm<BranchFormValues>({
    resolver: zodResolver(branchFormSchema),
    defaultValues: { name: "", location: "" },
  });
  
  const ticketRangeForm = useForm<TicketRangeFormValues>({
    resolver: zodResolver(ticketRangeSchema),
    defaultValues: { userId: "", start: "" as any, end: "" as any },
  });


  const handleCreateUser = (values: UserFormValues) => {
    startTransition(async () => {
      try {
        const { name, email, role, password, branchId } = values;
        await createUser({ name, email, role, password, branchId });
        onDataChange();
        toast({ title: "User Created", description: `Account for ${values.name} created.` });
        setIsUserDialogOpen(false);
        userForm.reset();
      } catch (e: any) {
        toast({ title: "Creation Failed", description: e?.message || "Could not create user.", variant: "destructive" });
      }
    });
  };

  const openEditUser = (user: UserType) => {
    setUserToEdit(user);
    userEditForm.reset({ 
      name: user.name, 
      phone: (user as any).phone || "", 
      email: user.email, 
      password: "", 
      role: user.role as any, 
      branchId: user.branchId 
    });
    setIsUserEditDialogOpen(true);
  };

  const handleUpdateUser = (values: z.infer<typeof userEditFormSchema>) => {
    if (!userToEdit) return;
    startTransition(async () => {
      try {
        const updateData: any = {
          name: values.name,
          email: values.email,
          role: values.role,
          branchId: values.branchId,
        };
        if (values.phone) updateData.phone = values.phone;
        if (values.password) updateData.password = values.password;
        
        await updateUserAction(userToEdit.id, updateData);
        onDataChange();
        toast({ title: "User Updated", description: `Account for ${values.name} updated successfully.` });
        setIsUserEditDialogOpen(false);
        setUserToEdit(null);
        userEditForm.reset();
      } catch (e: any) {
        toast({ title: "Update Failed", description: e?.message || "Could not update user.", variant: "destructive" });
      }
    });
  };
  
  const handleCreateBranch = (values: BranchFormValues) => {
    startTransition(() => {
      const newBranch = { ...values, id: String(branches.length + 1), isActive: true };
      setBranches(prev => [...prev, newBranch]);
      toast({
          title: "Branch Created",
          description: `The ${values.name} branch has been successfully created.`,
      });
      setIsBranchDialogOpen(false);
      branchForm.reset();
    });
  };

  const openEditBranch = (branch: { id: string; name: string; location: string; isActive: boolean }) => {
    setBranchToEdit(branch);
    branchEditForm.reset({ name: branch.name, location: branch.location });
    setIsBranchEditDialogOpen(true);
  };

  const handleUpdateBranch = (values: BranchFormValues) => {
    if (!branchToEdit) return;
    startTransition(() => {
      setBranches(prev => prev.map(b => b.id === branchToEdit.id ? { ...b, name: values.name, location: values.location } : b));
      toast({ title: "Branch Updated", description: `${values.name} updated successfully.` });
      setIsBranchEditDialogOpen(false);
      setBranchToEdit(null);
    });
  };

  const toggleBranchActive = (branchId: string) => {
    startTransition(() => {
      setBranches(prev => {
        const next = prev.map(b => b.id === branchId ? { ...b, isActive: !b.isActive } : b);
        const b = next.find(x => x.id === branchId);
        toast({ title: "Branch Status Updated", description: `${b?.name || 'Branch'} ${b?.isActive ? 'activated' : 'deactivated'}.` });
        return next;
      });
    });
  };

  const handleAssignRange = (values: TicketRangeFormValues) => {
    startTransition(async () => {
      try {
        await assignTicketRange({ userId: values.userId, start: values.start, end: values.end });
        onDataChange();
        toast({ title: "Range Assigned", description: `Ticket range ${values.start}-${values.end} assigned.` });
        setIsRangeDialogOpen(false);
        ticketRangeForm.reset();
      } catch (e: any) {
        toast({ title: "Assignment Failed", description: e?.message || "Could not assign range.", variant: "destructive" });
      }
    });
  }
  
  const getBranchName = (branchId: string) => {
    return branches.find(b => b.id === branchId)?.name || "Unknown Branch";
  }

  const handleUserStatusChange = (userId: string, isActive: boolean) => {
    startTransition(async () => {
      await updateUserAction(userId, { isActive });
      onDataChange();
      toast({ title: "User Status Updated", description: `User ${isActive ? "activated" : "deactivated"}.` });
    });
  };

  const [resetUser, setResetUser] = useState<UserType | null>(null);
  const [newPassword, setNewPassword] = useState<string>("");

  const handlePasswordReset = (user: UserType) => {
    setResetUser(user);
    setNewPassword("");
  };

  const submitPasswordReset = () => {
    if (!resetUser) return;
    startTransition(async () => {
      await updateUserAction(resetUser.id, { password: newPassword || "password123" });
      onDataChange();
      toast({ title: "Password Updated", description: `Password changed for ${resetUser.name}.` });
      setResetUser(null);
      setNewPassword("");
    });
  };

  const confirmDeleteUser = (user: UserType) => {
    setUserToDelete(user);
    setIsDeleteDialogOpen(true);
  };

  const handleDeleteUser = () => {
    if (!userToDelete) return;
    startTransition(async () => {
      await deleteUserAction(userToDelete.id);
      onDataChange();
      toast({ title: "User Deleted", description: `User ${userToDelete.name} deleted.` });
      setIsDeleteDialogOpen(false);
      setUserToDelete(null);
    });
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

  const handleBackup = () => {
    startTransition(async () => {
      try {
        const res = await backupDatabase();
        toast({ title: "Backup Complete", description: `Saved to ${res.path}` });
      } catch (e: any) {
        toast({ title: "Backup Failed", description: e?.message || 'Unable to back up.', variant: 'destructive' });
      }
    });
  }

  // Load sales users
  useEffect(() => {
    const loadSalesUsers = async () => {
      try {
        // Super admin can see all users
        const users = await fetchUsers({ role: 'superadmin' });
        const sales = users.filter(u => u.role === 'sales').map(user => ({
          ...user,
          password: user.password ?? undefined
        }));
        setSalesUsers(sales);
      } catch (error) {
        console.error('Failed to load sales users:', error);
      }
    };
    loadSalesUsers();
  }, []);

  // Load performance data when filters change
  useEffect(() => {
    loadPerformanceData();
  }, [selectedSalesPerson, selectedBranchId, tickets, users, branches]);

  const loadPerformanceData = async () => {
    try {
      // Apply salesperson and/or branch filters
      let filteredTickets = tickets;
      let filteredCustomers = customers;

      if (selectedSalesPerson !== "all") {
        filteredTickets = filteredTickets.filter(t => t.preparedBy === selectedSalesPerson);
        filteredCustomers = filteredCustomers.filter(c => c.registeredBy === selectedSalesPerson);
      }
      if (selectedBranchId !== "all") {
        const branchUserNames = users.filter(u => u.branchId === selectedBranchId).map(u => u.name);
        const nameSet = new Set(branchUserNames);
        filteredTickets = filteredTickets.filter(t => nameSet.has(t.preparedBy));
        filteredCustomers = filteredCustomers.filter(c => nameSet.has(c.registeredBy));
      }

      const nonVoidedFiltered = filteredTickets.filter(t => t.auditStatus !== 'Voided');
      const totalRevenue = nonVoidedFiltered.reduce((sum, t) => sum + t.paymentAmount, 0);
      const totalTickets = nonVoidedFiltered.length;
      const sentTickets = nonVoidedFiltered.filter(t => t.status === 'Sent').length;
      const approvedTickets = nonVoidedFiltered.filter(t => t.auditStatus === 'Approved').length;
      const pendingTickets = nonVoidedFiltered.filter(t => t.auditStatus === 'Pending').length;
      const rejectedTickets = nonVoidedFiltered.filter(t => t.auditStatus === 'Rejected').length;
      const cashRevenue = nonVoidedFiltered
        .filter(t => (t as any).modeOfPayment !== 'BANK')
        .reduce((sum, t) => sum + t.paymentAmount, 0);
      const bankRevenue = nonVoidedFiltered
        .filter(t => (t as any).modeOfPayment === 'BANK')
        .reduce((sum, t) => sum + t.paymentAmount, 0);

      // Calculate daily performance for the last 30 days
      const last30Days = Array.from({ length: 30 }, (_, i) => {
        const date = new Date();
        date.setDate(date.getDate() - i);
        return date.toISOString().split('T')[0];
      });

      const dailyPerformance = last30Days.map(date => {
        const dayTickets = filteredTickets.filter(t => {
          const d = new Date((t as any).createdAt || t.date);
          return d.toISOString().split('T')[0] === date;
        });
        const dayNonVoided = dayTickets.filter(t => t.auditStatus !== 'Voided');
        return {
          date,
          tickets: dayNonVoided.length,
          revenue: dayNonVoided.reduce((sum, t) => sum + t.paymentAmount, 0),
          approved: dayNonVoided.filter(t => t.auditStatus === 'Approved').length,
          pending: dayNonVoided.filter(t => t.auditStatus === 'Pending').length,
        };
      }).reverse();

      setPerformanceData({
        totalRevenue,
        totalTickets,
        sentTickets,
        approvedTickets,
        pendingTickets,
        rejectedTickets,
        totalCustomers: filteredCustomers.length,
        activeCustomers: filteredCustomers.filter(c => c.isActive).length,
        dailyPerformance,
        averageTicketValue: totalTickets > 0 ? totalRevenue / totalTickets : 0,
        approvalRate: totalTickets > 0 ? (approvedTickets / totalTickets) * 100 : 0,
        cashRevenue,
        bankRevenue,
      });

      // Branch aggregates for charts (overall, ignoring current filters)
      const aggregates = branches.map(b => {
        const branchUserNames = users.filter(u => u.branchId === b.id).map(u => u.name);
        const nameSet = new Set(branchUserNames);
        const bt = tickets.filter(t => nameSet.has(t.preparedBy));
        const btNonVoided = bt.filter(t => t.auditStatus !== 'Voided');
        const cashRevenue = btNonVoided
          .filter(t => (t as any).modeOfPayment !== 'BANK')
          .reduce((s, t) => s + t.paymentAmount, 0);
        const bankRevenue = btNonVoided
          .filter(t => (t as any).modeOfPayment === 'BANK')
          .reduce((s, t) => s + t.paymentAmount, 0);
        return {
          branchId: b.id,
          branchName: b.name,
          totalRevenue: btNonVoided.reduce((s, t) => s + t.paymentAmount, 0),
          totalTickets: btNonVoided.length,
          cashRevenue,
          bankRevenue,
        };
      });
      setBranchPerformance(aggregates);
    } catch (error) {
      console.error('Failed to load performance data:', error);
    }
  };


  const getSelectedSalesPersonName = () => {
    if (selectedSalesPerson === "all") return "All Sales Personnel";
    const user = salesUsers.find(u => u.name === selectedSalesPerson);
    return user ? user.name : selectedSalesPerson;
  };

  const getSelectedBranchName = () => {
    if (selectedBranchId === "all") return "All Branches";
    return branches.find(b => b.id === selectedBranchId)?.name || selectedBranchId;
  };
  
  // Map sidebar menu items to tab values
  const getTabValue = () => {
    if (activeTab === 'branches') return 'branches';
    if (activeTab === 'users') return 'users';
    if (activeTab === 'customers') return 'customers';
    if (activeTab === 'customer-management') return 'customer-management';
    if (activeTab === 'transactions') return 'transactions';
    return 'dashboard'; // default
  };

  const currentTab = getTabValue();

  return (
    <>
      {currentTab === 'dashboard' && (
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Performance Filters</CardTitle>
              <CardDescription>Slice performance by branch, salesperson, and payment mode.</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-4 md:grid-cols-3">
              <div className="space-y-2">
                <p className="text-sm font-medium text-muted-foreground">Sales Performance</p>
                <Select value={selectedSalesPerson} onValueChange={(value) => setSelectedSalesPerson(value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="All Sales Personnel" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Sales Personnel</SelectItem>
                    {salesUsers.length
                      ? salesUsers.map((user) => (
                          <SelectItem key={user.id} value={user.name}>
                            {user.name}
                          </SelectItem>
                        ))
                      : salesUsersList.map((user) => (
                          <SelectItem key={user.id} value={user.name}>
                            {user.name}
                          </SelectItem>
                        ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <p className="text-sm font-medium text-muted-foreground">Branch Performance</p>
                <Select value={selectedBranchId} onValueChange={(value) => setSelectedBranchId(value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="All Branches" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Branches</SelectItem>
                    {branches.map((branch) => (
                      <SelectItem key={branch.id} value={branch.id}>
                        {branch.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <p className="text-sm font-medium text-muted-foreground">Current View</p>
                <div className="rounded-lg border bg-muted/50 p-3 text-sm">
                  <p className="font-semibold">{getSelectedSalesPersonName()}</p>
                  <p className="text-muted-foreground">{getSelectedBranchName()}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Welcome, Super Admin!</CardTitle>
              <CardDescription>System-wide overview across all branches.</CardDescription>
            </CardHeader>
          </Card>

          {(() => {
            const nonVoided = tickets.filter(t => t.auditStatus !== 'Voided');
            const totalRevenue = performanceData?.totalRevenue ?? nonVoided.reduce((s, t) => s + t.paymentAmount, 0);
            const totalTickets = performanceData?.totalTickets ?? nonVoided.length;
            const approvedTickets = performanceData?.approvedTickets ?? tickets.filter(t => t.auditStatus === 'Approved').length;
            const approvalRate = performanceData?.approvalRate ?? (totalTickets > 0 ? (approvedTickets / totalTickets) * 100 : 0);
            const activeCustomers = performanceData?.activeCustomers ?? customers.filter(c => c.isActive).length;
            const inactiveCustomers = customers.length - activeCustomers;
            
            // Use centralized date utilities
            const todayRange = getTodayRange();
            const last7DaysRange = getLast7DaysRange();
            const last30DaysRange = getLast30DaysRange();
            const todayString = getTodayDateString();
            
            const todayRevenue = nonVoided
              .filter(t => isDateInRange(getTicketDate(t), todayRange))
              .reduce((s, t) => s + t.paymentAmount, 0);
            const weeklyRevenue = nonVoided
              .filter(t => isDateInRange(getTicketDate(t), last7DaysRange))
              .reduce((s, t) => s + t.paymentAmount, 0);
            const monthlyRevenue = nonVoided
              .filter(t => isDateInRange(getTicketDate(t), last30DaysRange))
              .reduce((s, t) => s + t.paymentAmount, 0);
            const todayTickets = nonVoided.filter(t => t.date === todayString).length;

            // Calculate metrics using centralized utilities
            const todayMetrics = calculateTodayMetrics(nonVoided);
            const monthlyMetrics = calculateMonthlyMetrics(nonVoided);
            
            const todaysCashRevenue = performanceData?.cashRevenue ?? todayMetrics.revenue.cash;
            const todaysBankRevenue = performanceData?.bankRevenue ?? todayMetrics.revenue.bank;
            const monthlyCashRevenue = monthlyMetrics.revenue.cash;
            const monthlyBankRevenue = monthlyMetrics.revenue.bank;

            return (
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-muted-foreground">Total Revenue</p>
                        <p className="text-2xl font-bold">ETB {totalRevenue.toFixed(2)}</p>
                      </div>
                      <DollarSign className="h-5 w-5 text-green-600" />
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-muted-foreground">Daily Revenue</p>
                        <p className="text-2xl font-bold">ETB {todayRevenue.toFixed(2)}</p>
                      </div>
                      <DollarSign className="h-5 w-5 text-emerald-500" />
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-muted-foreground">Weekly Revenue</p>
                        <p className="text-2xl font-bold">ETB {weeklyRevenue.toFixed(2)}</p>
                      </div>
                      <DollarSign className="h-5 w-5 text-teal-500" />
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-muted-foreground">Last 30 days</p>
                        <p className="text-2xl font-bold">ETB {monthlyRevenue.toFixed(2)}</p>
                      </div>
                      <DollarSign className="h-5 w-5 text-cyan-500" />
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-muted-foreground">Total Tickets</p>
                        <p className="text-2xl font-bold">{totalTickets}</p>
                      </div>
                      <FileText className="h-5 w-5 text-blue-500" />
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-muted-foreground">Today Tickets</p>
                        <p className="text-2xl font-bold">{todayTickets}</p>
                      </div>
                      <FileText className="h-5 w-5 text-indigo-500" />
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-muted-foreground">Total Customers</p>
                        <p className="text-2xl font-bold">{customers.length}</p>
                      </div>
                      <Users className="h-5 w-5 text-muted-foreground" />
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-muted-foreground">Approved</p>
                        <p className="text-2xl font-bold">{approvedTickets}</p>
                      </div>
                      <CheckSquare className="h-5 w-5 text-green-500" />
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-muted-foreground">Approval Rate</p>
                        <p className="text-2xl font-bold">{approvalRate.toFixed(1)}%</p>
                      </div>
                      <Activity className="h-5 w-5 text-purple-500" />
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-muted-foreground">Branches</p>
                        <p className="text-2xl font-bold">{branches.length}</p>
                      </div>
                      <Building className="h-5 w-5 text-muted-foreground" />
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-muted-foreground">Active Customers</p>
                        <p className="text-2xl font-bold">{activeCustomers}</p>
                      </div>
                      <User className="h-5 w-5 text-green-600" />
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-muted-foreground">Inactive Customers</p>
                        <p className="text-2xl font-bold">{inactiveCustomers}</p>
                      </div>
                      <User className="h-5 w-5 text-red-600" />
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-muted-foreground">Users</p>
                        <p className="text-2xl font-bold">{users.length}</p>
                      </div>
                      <Users className="h-5 w-5 text-muted-foreground" />
                    </div>
                  </CardContent>
                </Card>
              </div>
            );
          })()}

          {/* Cash and Bank Revenue Cards */}
          {(() => {
            const filteredNonVoided = tickets.filter(t => t.auditStatus !== 'Voided');
            const todayRange = getTodayRange();
            const last30DaysRange = getLast30DaysRange();
            
            const todaysTickets = filteredNonVoided.filter(t => 
              isDateInRange(getTicketDate(t), todayRange)
            );

            // Calculate monthly tickets for cash/bank breakdown
            const monthlyTickets = filteredNonVoided.filter(t => 
              isDateInRange(getTicketDate(t), last30DaysRange)
            );

            let todaysCashRevenue = 0;
            let todaysBankRevenue = 0;
            
            // Calculate monthly cash and bank collections
            let monthlyCashRevenue = 0;
            let monthlyBankRevenue = 0;
            
            try {
              todaysCashRevenue = todaysTickets
                .filter(t => {
                  const modeOfPayment = (t as any).modeOfPayment;
                  return !modeOfPayment || modeOfPayment === 'CASH' || modeOfPayment === null || modeOfPayment === undefined;
                })
                .reduce((s, t) => s + (t.paymentAmount || 0), 0);
              
              todaysBankRevenue = todaysTickets
                .filter(t => {
                  const modeOfPayment = (t as any).modeOfPayment;
                  return modeOfPayment === 'BANK';
                })
                .reduce((s, t) => s + (t.paymentAmount || 0), 0);

              monthlyCashRevenue = monthlyTickets
                .filter(t => {
                  const modeOfPayment = (t as any).modeOfPayment;
                  return !modeOfPayment || modeOfPayment === 'CASH' || modeOfPayment === null || modeOfPayment === undefined;
                })
                .reduce((s, t) => s + (t.paymentAmount || 0), 0);
              
              monthlyBankRevenue = monthlyTickets
                .filter(t => {
                  const modeOfPayment = (t as any).modeOfPayment;
                  return modeOfPayment === 'BANK';
                })
                .reduce((s, t) => s + (t.paymentAmount || 0), 0);
            } catch (error) {
              console.error('[Super Admin Dashboard] Error calculating cash/bank totals:', error);
            }

            return (
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Today's Cash Revenue</CardTitle>
                    <DollarSign className="h-4 w-4 text-green-600" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">ETB {todaysCashRevenue.toFixed(2)}</div>
                    <p className="text-xs text-muted-foreground">Cash payments today</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Today's Bank Revenue</CardTitle>
                    <DollarSign className="h-4 w-4 text-blue-600" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">ETB {todaysBankRevenue.toFixed(2)}</div>
                    <p className="text-xs text-muted-foreground">Bank payments today</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Monthly Cash Collection</CardTitle>
                    <DollarSign className="h-4 w-4 text-green-600" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">ETB {monthlyCashRevenue.toFixed(2)}</div>
                    <p className="text-xs text-muted-foreground">Cash payments (last 30 days)</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Monthly Bank Collection</CardTitle>
                    <DollarSign className="h-4 w-4 text-blue-600" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">ETB {monthlyBankRevenue.toFixed(2)}</div>
                    <p className="text-xs text-muted-foreground">Bank payments (last 30 days)</p>
                  </CardContent>
                </Card>
              </div>
            );
          })()}

          <div className="grid gap-4 lg:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Revenue - Last 30 Days</CardTitle>
                <CardDescription>Daily totals across all branches</CardDescription>
              </CardHeader>
              <CardContent>
                <ChartContainer config={{ revenue: { label: 'Revenue', color: 'hsl(var(--chart-1))' } }}>
                  <LineChart data={(performanceData?.dailyPerformance || []).map((d: any) => ({ date: d.date, revenue: d.revenue }))}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" hide />
                    <YAxis />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Legend />
                    <Line type="monotone" dataKey="revenue" stroke="var(--color-revenue)" strokeWidth={2} dot={false} />
                  </LineChart>
                </ChartContainer>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Tickets - Last 30 Days</CardTitle>
                <CardDescription>Number of tickets created per day</CardDescription>
              </CardHeader>
              <CardContent>
                <ChartContainer config={{ tickets: { label: 'Tickets', color: 'hsl(var(--chart-2))' } }}>
                  <BarChart data={(performanceData?.dailyPerformance || []).map((d: any) => ({ date: d.date, tickets: d.tickets }))}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" hide />
                    <YAxis />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Legend />
                    <Bar dataKey="tickets" fill="var(--color-tickets)" />
                  </BarChart>
                </ChartContainer>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Branch Performance Overview</CardTitle>
              <CardDescription>Total revenue and payment mix per branch.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 lg:grid-cols-2">
                {branchPerformance.map((branch) => (
                  <Card key={branch.branchId} className="border-dashed">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-base">{branch.branchName}</CardTitle>
                      <CardDescription>Total Tickets: {branch.totalTickets}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-muted-foreground">Total Revenue</span>
                          <span className="font-semibold">ETB {branch.totalRevenue.toFixed(2)}</span>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-muted-foreground">Cash</span>
                          <span className="font-semibold text-green-600">ETB {branch.cashRevenue.toFixed(2)}</span>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-muted-foreground">Bank</span>
                          <span className="font-semibold text-blue-600">ETB {branch.bankRevenue.toFixed(2)}</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {currentTab === 'branches' && (
        <Card>
          <CardHeader  className="flex flex-row items-center justify-between">
             <div>
              <CardTitle>Branch Management</CardTitle>
              <CardDescription>Create, view, and manage all company branches.</CardDescription>
            </div>
            <Dialog open={isBranchDialogOpen} onOpenChange={setIsBranchDialogOpen}>
              <DialogTrigger asChild><Button><PlusCircle className="mr-2 h-4 w-4" />New Branch</Button></DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>Create New Branch</DialogTitle>
                  <DialogDescription>Fill out the form below to create a new branch.</DialogDescription>
                </DialogHeader>
                <Form {...branchForm}>
                  <form onSubmit={branchForm.handleSubmit(handleCreateBranch)} className="space-y-4 py-4">
                    <FormField control={branchForm.control} name="name" render={({ field }) => (<FormItem><FormLabel>Branch Name</FormLabel><FormControl><Input placeholder="Bole Branch" {...field} /></FormControl><FormMessage /></FormItem>)} />
                     <FormField control={branchForm.control} name="location" render={({ field }) => (<FormItem><FormLabel>Location</FormLabel><FormControl><Input placeholder="Bole, Addis Ababa" {...field} /></FormControl><FormMessage /></FormItem>)} />
                    <DialogFooter>
                      <Button type="submit" disabled={isPending}>
                        {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        Create Branch
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
                  <TableHead>Branch Name</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {branches.map((branch) => (
                  <TableRow key={branch.id}>
                    <TableCell className="font-medium">{branch.name}</TableCell>
                    <TableCell>{branch.location}</TableCell>
                    <TableCell>
                      <Badge variant={branch.isActive ? "default" : "destructive"}>{branch.isActive ? 'Active' : 'Inactive'}</Badge>
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
                          <DropdownMenuItem onClick={() => openEditBranch(branch)}>Edit Branch</DropdownMenuItem>
                          <DropdownMenuItem onClick={() => toggleBranchActive(branch.id)}>
                            {branch.isActive ? 'Deactivate' : 'Activate'}
                          </DropdownMenuItem>
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

      {currentTab === 'users' && (
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>User Management</CardTitle>
              <CardDescription>Create users and assign ticket number ranges to sales staff.</CardDescription>
            </div>
            <div className="flex gap-2">
                <Button variant="outline" onClick={handleBackup}>Backup Database</Button>
                <Dialog open={isRangeDialogOpen} onOpenChange={setIsRangeDialogOpen}>
                  <DialogTrigger asChild><Button variant="secondary"><Ticket className="mr-2 h-4 w-4" />Assign Range</Button></DialogTrigger>
                  <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                      <DialogTitle>Assign Ticket Number Range</DialogTitle>
                      <DialogDescription>Select a sales user and assign a start and end ticket number.</DialogDescription>
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
                      <DialogDescription>Fill out the form below to create a new user account. An initial password will be set.</DialogDescription>
                    </DialogHeader>
                     <Form {...userForm}>
                      <form onSubmit={userForm.handleSubmit(handleCreateUser)} className="space-y-4 py-4">
                        <FormField control={userForm.control} name="name" render={({ field }) => (<FormItem><FormLabel>Full Name</FormLabel><FormControl><Input placeholder="John Doe" {...field} /></FormControl><FormMessage /></FormItem>)} />
                        <FormField control={userForm.control} name="phone" render={({ field }) => (<FormItem><FormLabel>Phone Number</FormLabel><FormControl><Input type="tel" placeholder="0912 345 678" {...field} /></FormControl><FormMessage /></FormItem>)} />
                         <FormField control={userForm.control} name="email" render={({ field }) => (<FormItem><FormLabel>Email Address</FormLabel><FormControl><Input type="email" placeholder="name@company.com" {...field} /></FormControl><FormMessage /></FormItem>)} />
                         <FormField control={userForm.control} name="password" render={({ field }) => (<FormItem><FormLabel>Password</FormLabel><FormControl><Input type="password" placeholder="••••••••" {...field} /></FormControl><FormMessage /></FormItem>)} />
                         <FormField control={userForm.control} name="role" render={({ field }) => (<FormItem><FormLabel>Role</FormLabel><Select onValueChange={field.onChange} defaultValue={field.value}><FormControl><SelectTrigger><SelectValue placeholder="Select a role" /></SelectTrigger></FormControl><SelectContent>{roles.map(role => (<SelectItem key={role} value={role} className="capitalize">{role}</SelectItem>))}</SelectContent></Select><FormMessage /></FormItem>)} />
                         <FormField control={userForm.control} name="branchId" render={({ field }) => (<FormItem><FormLabel>Branch</FormLabel><Select onValueChange={field.onChange} defaultValue={field.value}><FormControl><SelectTrigger><SelectValue placeholder="Select a branch" /></SelectTrigger></FormControl><SelectContent>{branches.map(branch => (<SelectItem key={branch.id} value={branch.id}>{branch.name}</SelectItem>))}</SelectContent></Select><FormMessage /></FormItem>)} />
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
                  <TableHead>Role</TableHead>
                  <TableHead>Branch</TableHead>
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
                    <TableCell><Badge variant="secondary" className="capitalize">{user.role}</Badge></TableCell>
                    <TableCell>{getBranchName(user.branchId)}</TableCell>
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
                          <DropdownMenuItem onClick={() => openEditUser(user)}>
                            <Edit className="mr-2 h-4 w-4" />
                            Edit User
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
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
                          <DropdownMenuSeparator />
                           <DropdownMenuItem className="text-destructive" onClick={() => confirmDeleteUser(user)}>
                             <Trash2 className="mr-2 h-4 w-4" />
                            Delete User
                          </DropdownMenuItem>
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
        <CustomerList 
          customers={customers} 
          tickets={tickets}
          users={users.map(u => ({ name: u.name, branchId: u.branchId }))}
          branches={branches}
          showPaymentFilters={true}
          showDateFilter={true}
        />
      )}

      {currentTab === 'customer-management' && (
        <CustomerManagement 
          customers={customers} 
          tickets={tickets}
          users={users.map(u => ({ name: u.name, branchId: u.branchId }))}
          branches={branches}
          onDataChange={onDataChange}
          userRole="superadmin"
        />
      )}

      {currentTab === 'transactions' && (
        <TicketDashboard 
          tickets={tickets} 
          initialDateFilter="all"
          showDateFilter={true}
          showPaymentFilters={true}
        />
      )}

    <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you sure you want to delete this user?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete the account for{" "}
            <span className="font-bold">{userToDelete?.name}</span>.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={handleDeleteUser} className="bg-destructive hover:bg-destructive/90" disabled={isPending}>
            {isPending ? "Deleting..." : "Delete"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>

    {/* Edit Branch Dialog */}
    <Dialog open={isBranchEditDialogOpen} onOpenChange={setIsBranchEditDialogOpen}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit Branch</DialogTitle>
          <DialogDescription>Update branch details.</DialogDescription>
        </DialogHeader>
        <Form {...branchEditForm}>
          <form onSubmit={branchEditForm.handleSubmit(handleUpdateBranch)} className="space-y-4 py-4">
            <FormField control={branchEditForm.control} name="name" render={({ field }) => (<FormItem><FormLabel>Branch Name</FormLabel><FormControl><Input placeholder="Bole Branch" {...field} /></FormControl><FormMessage /></FormItem>)} />
            <FormField control={branchEditForm.control} name="location" render={({ field }) => (<FormItem><FormLabel>Location</FormLabel><FormControl><Input placeholder="Bole, Addis Ababa" {...field} /></FormControl><FormMessage /></FormItem>)} />
            <DialogFooter>
              <Button type="submit" disabled={isPending}>
                {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Save Changes
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>

    {/* Set New Password Dialog */}
    <Dialog open={!!resetUser} onOpenChange={(o) => { if (!o) setResetUser(null); }}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Set New Password</DialogTitle>
          <DialogDescription>Enter a new password for {resetUser?.name}.</DialogDescription>
        </DialogHeader>
        <div className="py-4">
          <Input type="password" placeholder="New password" value={newPassword} onChange={e => setNewPassword(e.target.value)} />
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setResetUser(null)}>Cancel</Button>
          <Button onClick={submitPasswordReset} disabled={isPending}>
            {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Save
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>

    {/* Edit User Dialog */}
    <Dialog open={isUserEditDialogOpen} onOpenChange={setIsUserEditDialogOpen}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit User</DialogTitle>
          <DialogDescription>Update user account information. Leave password blank to keep current password.</DialogDescription>
        </DialogHeader>
        <Form {...userEditForm}>
          <form onSubmit={userEditForm.handleSubmit(handleUpdateUser)} className="space-y-4 py-4">
            <FormField control={userEditForm.control} name="name" render={({ field }) => (<FormItem><FormLabel>Full Name</FormLabel><FormControl><Input placeholder="John Doe" {...field} /></FormControl><FormMessage /></FormItem>)} />
            <FormField control={userEditForm.control} name="phone" render={({ field }) => (<FormItem><FormLabel>Phone Number</FormLabel><FormControl><Input type="tel" placeholder="0912 345 678" {...field} /></FormControl><FormMessage /></FormItem>)} />
            <FormField control={userEditForm.control} name="email" render={({ field }) => (<FormItem><FormLabel>Email Address</FormLabel><FormControl><Input type="email" placeholder="name@company.com" {...field} /></FormControl><FormMessage /></FormItem>)} />
            <FormField control={userEditForm.control} name="password" render={({ field }) => (<FormItem><FormLabel>Password (Optional)</FormLabel><FormControl><Input type="password" placeholder="Leave blank to keep current" {...field} value={field.value ?? ""} /></FormControl><FormMessage /></FormItem>)} />
            <FormField control={userEditForm.control} name="role" render={({ field }) => (<FormItem><FormLabel>Role</FormLabel><Select onValueChange={field.onChange} value={field.value}><FormControl><SelectTrigger><SelectValue placeholder="Select a role" /></SelectTrigger></FormControl><SelectContent>{roles.map(role => (<SelectItem key={role} value={role} className="capitalize">{role}</SelectItem>))}</SelectContent></Select><FormMessage /></FormItem>)} />
            <FormField control={userEditForm.control} name="branchId" render={({ field }) => (<FormItem><FormLabel>Branch</FormLabel><Select onValueChange={field.onChange} value={field.value}><FormControl><SelectTrigger><SelectValue placeholder="Select a branch" /></SelectTrigger></FormControl><SelectContent>{branches.map(branch => (<SelectItem key={branch.id} value={branch.id}>{branch.name}</SelectItem>))}</SelectContent></Select><FormMessage /></FormItem>)} />
            <DialogFooter>
              <Button variant="outline" onClick={() => { setIsUserEditDialogOpen(false); setUserToEdit(null); }}>Cancel</Button>
              <Button type="submit" disabled={isPending}>
                {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Save Changes
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
    </>
  );
}
