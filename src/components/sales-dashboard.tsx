
"use client";

import React from "react";
import { StatsCards } from "@/components/stats-cards";
import { SalesKpiCards } from "@/components/sales-kpi-cards";
import { TicketDashboard } from "@/components/ticket-dashboard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Ticket, DollarSign } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { useIsMobile } from "@/hooks/use-mobile";
import { getTodayDateString, getTodayRange, getLast7DaysRange, getLast30DaysRange, getTicketDate, isDateInRange } from "@/lib/date-utils";
import { calculateTodayMetrics } from "@/lib/metrics-utils";
import type { Ticket as TicketType, Customer as CustomerType } from "@/lib/types";

interface SalesDashboardProps {
  onTicketGenerated: (ticket: TicketType, htmlContent: string) => void;
  tickets: TicketType[];
  customers: CustomerType[];
  onDataChange: () => void;
}

export function SalesDashboard({ onTicketGenerated, tickets, customers, onDataChange }: SalesDashboardProps) {
  const { user } = useAuth();
  const isMobile = useIsMobile();
  
  const today = getTodayDateString();
  const todayRange = getTodayRange();
  const last7DaysRange = getLast7DaysRange();
  const last30DaysRange = getLast30DaysRange();

  // Calculate today's tickets and revenue
  const todaysTickets = tickets.filter(t => {
    return t.date === today && t.auditStatus !== 'Voided';
  });
  const todaysRevenue = todaysTickets.reduce((sum, ticket) => sum + ticket.paymentAmount, 0);

  // Calculate weekly revenue (last 7 days)
  const weeklyTickets = tickets.filter(t => {
    if (t.auditStatus === 'Voided') return false;
    return isDateInRange(getTicketDate(t), last7DaysRange);
  });
  const weeklyRevenue = weeklyTickets.reduce((sum, ticket) => sum + ticket.paymentAmount, 0);

  // Calculate monthly revenue (last 30 days)
  const monthlyTickets = tickets.filter(t => {
    if (t.auditStatus === 'Voided') return false;
    return isDateInRange(getTicketDate(t), last30DaysRange);
  });
  const monthlyRevenue = monthlyTickets.reduce((sum, ticket) => sum + ticket.paymentAmount, 0);

  // KPIs
  const totalTickets = tickets.filter(t => t.auditStatus !== 'Voided').length;
  const totalCustomers = customers.length;
  const totalApproved = tickets.filter(t => t.auditStatus === 'Approved').length;
  const approvalRate = totalTickets > 0 ? (totalApproved / totalTickets) * 100 : 0;

  // Calculate ticket numbers
  const ticketNumberStart = user?.ticketNumberStart;
  const ticketNumberEnd = user?.ticketNumberEnd;
  const currentTicketNumber = user?.currentTicketNumber;
  let remainingTickets = 0;
  let generatedTickets = 0;
  let ticketRange = '';
  
  if (ticketNumberStart !== undefined && ticketNumberEnd !== undefined && currentTicketNumber !== undefined) {
    // currentTicketNumber is the NEXT number to use, so:
    // Generated tickets = currentTicketNumber - ticketNumberStart (tickets already used)
    // Remaining tickets = ticketNumberEnd - currentTicketNumber + 1 (including the current one)
    generatedTickets = Math.max(0, currentTicketNumber - ticketNumberStart);
    remainingTickets = Math.max(0, ticketNumberEnd - currentTicketNumber + 1);
    ticketRange = `${String(ticketNumberStart).padStart(5, '0')}-${String(ticketNumberEnd).padStart(5, '0')}`;
  }

  // Calculate today's metrics using centralized utilities
  const todayMetrics = calculateTodayMetrics(todaysTickets);
  const todaysCashRevenue = todayMetrics.revenue.cash;
  const todaysBankRevenue = todayMetrics.revenue.bank;

  return (
    <div className="space-y-6">
      {/* Remaining Tickets Card */}
      {ticketNumberStart !== undefined && ticketNumberEnd !== undefined && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Ticket className="h-5 w-5" />
              Ticket Range Information
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className={`grid gap-4 ${isMobile ? 'grid-cols-1' : 'grid-cols-1 sm:grid-cols-3'}`}>
              <div>
                <div className="text-sm text-muted-foreground">Assigned Range</div>
                <div className={`font-bold ${isMobile ? 'text-xl' : 'text-2xl'}`}>{ticketRange}</div>
              </div>
              <div>
                <div className="text-sm text-muted-foreground">Generated Tickets</div>
                <div className={`font-bold text-green-600 ${isMobile ? 'text-xl' : 'text-2xl'}`}>{generatedTickets}</div>
              </div>
              <div>
                <div className="text-sm text-muted-foreground">Remaining Tickets</div>
                <div className={`font-bold text-primary ${isMobile ? 'text-xl' : 'text-2xl'}`}>{remainingTickets}</div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Sales KPIs - mobile friendly */}
      <SalesKpiCards
        totalTickets={totalTickets}
        totalCustomers={totalCustomers}
        totalApproved={totalApproved}
        approvalRate={approvalRate}
      />

      <StatsCards
        todaysRevenue={todaysRevenue}
        todaysTickets={todaysTickets.length}
        weeklyRevenue={weeklyRevenue}
        monthlyRevenue={monthlyRevenue}
      />

      {/* Cash and Bank Revenue Cards */}
      <div className={`grid gap-4 ${isMobile ? 'grid-cols-1' : 'grid-cols-1 sm:grid-cols-2'}`}>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className={`font-medium ${isMobile ? 'text-xs' : 'text-sm'}`}>Today's Cash Revenue</CardTitle>
            <DollarSign className={`text-green-600 ${isMobile ? 'h-3 w-3' : 'h-4 w-4'}`} />
          </CardHeader>
          <CardContent>
            <div className={`font-bold ${isMobile ? 'text-xl' : 'text-2xl'}`}>ETB {todaysCashRevenue.toFixed(2)}</div>
            <p className={`text-muted-foreground ${isMobile ? 'text-[10px]' : 'text-xs'}`}>Cash payments today</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className={`font-medium ${isMobile ? 'text-xs' : 'text-sm'}`}>Today's Bank Revenue</CardTitle>
            <DollarSign className={`text-blue-600 ${isMobile ? 'h-3 w-3' : 'h-4 w-4'}`} />
          </CardHeader>
          <CardContent>
            <div className={`font-bold ${isMobile ? 'text-xl' : 'text-2xl'}`}>ETB {todaysBankRevenue.toFixed(2)}</div>
            <p className={`text-muted-foreground ${isMobile ? 'text-[10px]' : 'text-xs'}`}>Bank payments today</p>
          </CardContent>
        </Card>
      </div>

      {/* Recent Tickets */}
      <TicketDashboard tickets={tickets} initialDateFilter="today" showDateFilter={false} />
    </div>
  );
}
