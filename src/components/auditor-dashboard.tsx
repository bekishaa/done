
"use client";

import { useMemo, useState, useTransition } from "react";
import { DollarSign, AlertTriangle, Loader2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/use-auth";
import { useToast } from "@/hooks/use-toast";
import { StatsCards } from "./stats-cards";
import { SalesKpiCards } from "./sales-kpi-cards";
import {
  getTodayRange,
  getLast7DaysRange,
  getLast30DaysRange,
  getTicketDate,
  isDateInRange,
  getDateRangeFromFilter,
} from "@/lib/date-utils";
import { calculateTodayMetrics, calculateMonthlyMetrics, getDataQualityWarnings } from "@/lib/metrics-utils";
import type { Customer, Ticket } from "@/lib/types";
import { fixMissingPaymentModesAction } from "@/app/actions";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface AuditorDashboardProps {
  customers: Customer[];
  tickets: Ticket[];
  onDataChange?: () => void;
}

export function AuditorDashboard({ customers, tickets, onDataChange }: AuditorDashboardProps) {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isPending, startTransition] = useTransition();
  const [dateFilter, setDateFilter] = useState<"all" | "today" | "week" | "month">("all");
  const [salesFilter, setSalesFilter] = useState<string>("all");
  const mockBranches = [
    { id: '1', name: 'Headquarters' },
    { id: '2', name: 'Bole Branch' },
  ];
  const getBranchName = (branchId?: string) => {
    try {
      const stored = typeof window !== 'undefined' ? localStorage.getItem('rr.branches') : null;
      const branches = stored ? JSON.parse(stored) : mockBranches;
      const b = branches.find((x: any) => x.id === branchId);
      return b?.name || 'Bole Branch';
    } catch {
      return 'Bole Branch';
    }
  };

  // KPI calculations (exclude voided)
  const nonVoided = tickets.filter(t => t.auditStatus !== 'Voided');
  const salesUsers = useMemo(
    () => Array.from(new Set(nonVoided.map(t => t.preparedBy))).filter(Boolean) as string[],
    [nonVoided]
  );

  // Use centralized date utilities
  const todayRange = getTodayRange();
  const last7DaysRange = getLast7DaysRange();
  const last30DaysRange = getLast30DaysRange();

  const filteredTickets = useMemo(() => {
    const range = getDateRangeFromFilter(dateFilter);
    return nonVoided.filter(ticket => {
      const matchesSales = salesFilter === "all" || ticket.preparedBy === salesFilter;
      const matchesDate = !range || isDateInRange(getTicketDate(ticket), range);
      return matchesSales && matchesDate;
    });
  }, [nonVoided, dateFilter, salesFilter]);

  const filteredCustomers = useMemo(() => {
    if (salesFilter === "all") {
      return customers;
    }
    return customers.filter(customer => customer.registeredBy === salesFilter);
  }, [customers, salesFilter]);

  const todayRevenue = filteredTickets
    .filter(t => isDateInRange(getTicketDate(t), todayRange))
    .reduce((s, t) => s + t.paymentAmount, 0);
  const weeklyRevenue = filteredTickets
    .filter(t => isDateInRange(getTicketDate(t), last7DaysRange))
    .reduce((s, t) => s + t.paymentAmount, 0);
  const monthlyRevenue = filteredTickets
    .filter(t => isDateInRange(getTicketDate(t), last30DaysRange))
    .reduce((s, t) => s + t.paymentAmount, 0);

  const totalTickets = filteredTickets.length;
  const todayTickets = filteredTickets.filter(t => isDateInRange(getTicketDate(t), todayRange)).length;
  const totalCustomers = filteredCustomers.length;
  const approvedTickets = filteredTickets.filter(t => t.auditStatus === 'Approved').length;

  // Calculate metrics using centralized utilities
  const todayMetrics = calculateTodayMetrics(filteredTickets);
  const monthlyMetrics = calculateMonthlyMetrics(filteredTickets);
  
  const todaysCashRevenue = todayMetrics.revenue.cash;
  const todaysBankRevenue = todayMetrics.revenue.bank;
  const monthlyCashRevenue = monthlyMetrics.revenue.cash;
  const monthlyBankRevenue = monthlyMetrics.revenue.bank;
  
  // Data quality warnings
  const dataQuality = getDataQualityWarnings(nonVoided);

  const handleFixPaymentModes = () => {
    startTransition(async () => {
      try {
        const result = await fixMissingPaymentModesAction();
        if (result.success) {
          onDataChange?.(); // Refresh data to update the warning
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

  return (
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

      {/* Welcome */}
      <Card>
        <CardHeader>
          <CardTitle>Welcome, Branch {String(user?.role)}</CardTitle>
          <CardDescription>Here's an overview of your branch's operation: {getBranchName(user?.branchId)}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-3">
            <div className="space-y-2">
              <CardDescription className="text-xs uppercase tracking-wide">Date Filter</CardDescription>
              <Select value={dateFilter} onValueChange={(value) => setDateFilter(value as typeof dateFilter)}>
                <SelectTrigger>
                  <SelectValue placeholder="Filter by date range" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Dates</SelectItem>
                  <SelectItem value="today">Today</SelectItem>
                  <SelectItem value="week">Last 7 Days</SelectItem>
                  <SelectItem value="month">Last 30 Days</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <CardDescription className="text-xs uppercase tracking-wide">Sales Filter</CardDescription>
              <Select value={salesFilter} onValueChange={(value) => setSalesFilter(value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Filter by sales account" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Accounts</SelectItem>
                  {salesUsers.map(name => (
                    <SelectItem key={name} value={name}>
                      {name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-end">
              <Button
                variant="outline"
                className="w-full"
                onClick={() => {
                  setDateFilter("all");
                  setSalesFilter("all");
                }}
                disabled={dateFilter === "all" && salesFilter === "all"}
              >
                Reset Filters
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Sales KPIs */}
      <SalesKpiCards
        totalTickets={totalTickets}
        totalCustomers={totalCustomers}
        totalApproved={approvedTickets}
        approvalRate={totalTickets > 0 ? (approvedTickets / totalTickets) * 100 : 0}
      />

      {/* Stats Cards */}
      <StatsCards
        todaysRevenue={todayRevenue}
        todaysTickets={todayTickets}
        weeklyRevenue={weeklyRevenue}
        monthlyRevenue={monthlyRevenue}
      />

      {/* Cash and Bank Revenue Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
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
    </div>
  );
}
