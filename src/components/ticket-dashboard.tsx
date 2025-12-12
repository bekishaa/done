
"use client";

import { useState, useMemo, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { getDateRangeFromFilter, getTicketDate, isDateInRange } from "@/lib/date-utils";
import type { Ticket } from "@/lib/types";
import { FileText, Filter, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

interface TicketDashboardProps {
  tickets: Ticket[];
  initialDateFilter?: 'today' | 'all';
  showDateFilter?: boolean; // default true
  showPaymentFilters?: boolean; // Show cash/bank filters
}

export function TicketDashboard({ tickets, initialDateFilter = 'all', showDateFilter = true, showPaymentFilters = false }: TicketDashboardProps) {
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [filterDate, setFilterDate] = useState<string>(initialDateFilter);
  const [filterPayment, setFilterPayment] = useState<string>("all");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 100;

  // Filter tickets
  const filteredTickets = useMemo(() => {
    let filtered = tickets;

    // Filter by date using centralized utility
    const dateRange = getDateRangeFromFilter(filterDate);
    if (dateRange) {
      filtered = filtered.filter(ticket => 
        isDateInRange(getTicketDate(ticket), dateRange)
      );
    }

    // Filter by payment type
    if (showPaymentFilters && filterPayment !== "all") {
      filtered = filtered.filter(ticket => {
        const modeOfPayment = (ticket as any).modeOfPayment;
        if (filterPayment === 'CASH') {
          return !modeOfPayment || modeOfPayment === 'CASH' || modeOfPayment === null || modeOfPayment === undefined;
        } else if (filterPayment === 'BANK') {
          return modeOfPayment === 'BANK';
        }
        return true;
      });
    }

    // Filter by audit status
    if (filterStatus !== "all") {
      filtered = filtered.filter(ticket => 
        (ticket.auditStatus || 'Pending') === filterStatus
      );
    }

    return filtered.sort((a, b) => {
      // Sort by date (newest first) then by ticket number
      const dateA = getTicketDate(a).getTime();
      const dateB = getTicketDate(b).getTime();
      if (dateB !== dateA) return dateB - dateA;
      return b.ticketNumber.localeCompare(a.ticketNumber);
    });
  }, [tickets, filterStatus, filterDate, filterPayment, showPaymentFilters]);

  // Pagination logic
  const totalPages = Math.ceil(filteredTickets.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedTickets = filteredTickets.slice(startIndex, endIndex);

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [filterStatus, filterDate, filterPayment]);

  // Get audit status badge variant
  const getAuditStatusBadge = (status?: string) => {
    const auditStatus = status || 'Pending';
    switch (auditStatus) {
      case 'Approved':
        return <Badge className="bg-green-600 hover:bg-green-700">Approved</Badge>;
      case 'Rejected':
        return <Badge variant="destructive">Rejected</Badge>;
      case 'Voided':
        return <Badge variant="secondary">Voided</Badge>;
      case 'Pending':
      default:
        return <Badge variant="outline">Pending</Badge>;
    }
  };

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>Recent Tickets</CardTitle>
        <CardDescription>
          Today's tickets with audit status
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Filters */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="space-y-2">
            <Label className="flex items-center gap-2">
              <Filter className="h-4 w-4" />
              Filter by Status
            </Label>
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger>
                <SelectValue placeholder="All Statuses" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="Pending">Pending</SelectItem>
                <SelectItem value="Approved">Approved</SelectItem>
                <SelectItem value="Rejected">Rejected</SelectItem>
                <SelectItem value="Voided">Voided</SelectItem>
              </SelectContent>
            </Select>
          </div>
          {showDateFilter && (
            <div className="space-y-2">
              <Label>Filter by Date</Label>
              <Select value={filterDate} onValueChange={setFilterDate}>
                <SelectTrigger>
                  <SelectValue placeholder="Date Range" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Dates</SelectItem>
                  <SelectItem value="today">Today</SelectItem>
                  <SelectItem value="1day">Last 1 Day</SelectItem>
                  <SelectItem value="30days">Last 30 Days</SelectItem>
                  <SelectItem value="month">This Month</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}
          {showPaymentFilters && (
            <div className="space-y-2">
              <Label>Filter by Payment</Label>
              <Select value={filterPayment} onValueChange={setFilterPayment}>
                <SelectTrigger>
                  <SelectValue placeholder="Payment Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Payment Types</SelectItem>
                  <SelectItem value="CASH">Cash</SelectItem>
                  <SelectItem value="BANK">Bank</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}
        </div>

        {/* Tickets Table */}
        {filteredTickets.length > 0 ? (
          <>
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[100px]">Ticket No</TableHead>
                    <TableHead>Customer</TableHead>
                    <TableHead className="text-right">Amount</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead className="text-center">Audit Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paginatedTickets.map((ticket) => (
                    <TableRow key={ticket.id}>
                      <TableCell className="font-mono text-sm">{ticket.ticketNumber}</TableCell>
                      <TableCell className="font-medium">{ticket.customerName}</TableCell>
                      <TableCell className="text-right font-semibold">
                        ETB {ticket.paymentAmount.toFixed(2)}
                      </TableCell>
                      <TableCell className="text-sm">{ticket.date}</TableCell>
                      <TableCell className="text-center">
                        {getAuditStatusBadge(ticket.auditStatus)}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
            {totalPages > 1 && (
              <div className="flex items-center justify-between mt-4 px-2">
                <div className="text-sm text-muted-foreground">
                  Showing {startIndex + 1} to {Math.min(endIndex, filteredTickets.length)} of {filteredTickets.length} tickets
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                    disabled={currentPage === 1}
                  >
                    <ChevronLeft className="h-4 w-4" />
                    Previous
                  </Button>
                  <div className="text-sm">
                    Page {currentPage} of {totalPages}
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                    disabled={currentPage === totalPages}
                  >
                    Next
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            )}
          </>
        ) : (
          <div className="flex flex-col items-center justify-center text-center text-muted-foreground py-16">
            <FileText className="w-12 h-12 mb-4 text-gray-400" />
            <p className="font-semibold text-lg">No tickets found</p>
            <p className="text-sm">
              {filterDate === "today" 
                ? "No tickets generated today with the selected status." 
                : "No tickets match the selected filters."}
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
