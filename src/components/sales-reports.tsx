"use client";

import React, { useState } from "react";
import { Calendar, Download, Filter, BarChart3, TrendingUp, Users, DollarSign } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DatePickerWithRange } from "@/components/ui/date-range-picker";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { Ticket as TicketType, Customer as CustomerType } from "@/lib/types";

interface SalesReportsProps {
  tickets: TicketType[];
  customers: CustomerType[];
}

export function SalesReports({ tickets, customers }: SalesReportsProps) {
  const [dateRange, setDateRange] = useState<{ from: Date; to: Date } | undefined>();
  const [selectedReason, setSelectedReason] = useState<string>("all");
  const [selectedCustomer, setSelectedCustomer] = useState<string>("all");

  // Filter tickets based on selected criteria
  const filteredTickets = tickets.filter(ticket => {
    const ticketDate = new Date(ticket.date);
    const matchesDate = !dateRange || (
      ticketDate >= dateRange.from && 
      ticketDate <= dateRange.to
    );
    const matchesReason = selectedReason === "all" || ticket.reasonForPayment === selectedReason;
    const matchesCustomer = selectedCustomer === "all" || ticket.customerName === selectedCustomer;
    const notVoided = (ticket as any).auditStatus !== 'Voided';
    
    return matchesDate && matchesReason && matchesCustomer && notVoided;
  });

  // Calculate statistics
  const totalRevenue = filteredTickets.reduce((sum, ticket) => sum + ticket.paymentAmount, 0);
  const totalTickets = filteredTickets.length;
  const averageTicketValue = totalTickets > 0 ? totalRevenue / totalTickets : 0;

  // Get unique reasons for filter
  const uniqueReasons = Array.from(new Set(tickets.map(t => t.reasonForPayment).filter(Boolean)));

  // Get unique customers for filter
  const uniqueCustomers = Array.from(new Set(tickets.map(t => t.customerName).filter(Boolean)));

  // Group tickets by reason
  const ticketsByReason = filteredTickets.reduce((acc, ticket) => {
    const reason = ticket.reasonForPayment || "Unknown";
    acc[reason] = (acc[reason] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  // Group tickets by date
  const ticketsByDate = filteredTickets.reduce((acc, ticket) => {
    acc[ticket.date] = (acc[ticket.date] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  // Create a map of customers by phone number for quick lookup
  const customerMap = new Map(
    customers.map(customer => [customer.phoneNumber, customer])
  );

  // Get customer info for a ticket
  const getCustomerInfo = (ticket: TicketType) => {
    const customer = ticket.customerPhone 
      ? customerMap.get(ticket.customerPhone) 
      : null;
    return {
      // Use payer's identification as Customer ID for export (e.g., NV026000003)
      id: (customer as any)?.payersIdentification || customer?.id || "N/A",
      address: customer?.address || "N/A",
      phone: ticket.customerPhone || "N/A",
    };
  };

  // Calculate totals by reason (only cash payments)
  const cashByReason = filteredTickets
    .filter(ticket => {
      // Only include cash payments
      // Note: modeOfPayment might not be in the ticket type, so we'll check if it exists
      const modeOfPayment = (ticket as any).modeOfPayment;
      return !modeOfPayment || modeOfPayment === 'CASH';
    })
    .reduce((acc, ticket) => {
      const reason = ticket.reasonForPayment || "Unknown";
      acc[reason] = (acc[reason] || 0) + ticket.paymentAmount;
      return acc;
    }, {} as Record<string, number>);

  // Calculate total balance (only cash payments)
  const totalBalance = filteredTickets
    .filter(ticket => {
      const modeOfPayment = (ticket as any).modeOfPayment;
      return !modeOfPayment || modeOfPayment === 'CASH';
    })
    .reduce((sum, ticket) => sum + ticket.paymentAmount, 0);

  const exportToCSV = () => {
    // CSV helper to escape values that may contain commas, quotes, or newlines
    const csvEscape = (value: unknown): string => {
      if (value === null || value === undefined) return "";
      const str = String(value);
      // Double the quotes and wrap with quotes if necessary
      const needsQuotes = /[",\n\r]/.test(str);
      const escaped = str.replace(/"/g, '""');
      return needsQuotes ? `"${escaped}"` : escaped;
    };
    // Professional CSV format with all required fields
    const headers = [
      "Date",
      "Name",
      "Phone Number",
      "Customer ID",
      "Location",
      "Reason of Payment",
      "Prepared By",
      "Payment Mode",
      "Amount"
    ];

    const rows = filteredTickets.map(ticket => {
      const customerInfo = getCustomerInfo(ticket);
      const modeRaw = (ticket as any).modeOfPayment as string | undefined;
      const modeOfPayment = modeRaw ? modeRaw.toLowerCase() : ""; // "cash" | "bank" | ""
      // Export paid amount as-is (no currency, no commas, prefer integers like 2000)
      const amountValue = ticket.paymentAmount;
      const amountStr = Number.isInteger(amountValue) 
        ? String(amountValue) 
        : String(amountValue).includes('.') 
          ? String(parseFloat(String(amountValue))) 
          : String(amountValue);

      // Ensure consistent human-readable date (avoid locale commas causing column shifts)
      const dateStr = new Date(ticket.date).toLocaleDateString('en-CA'); // YYYY-MM-DD

      return [
        csvEscape(dateStr),
        csvEscape(ticket.customerName),
        csvEscape(customerInfo.phone),
        csvEscape(customerInfo.id),
        csvEscape(customerInfo.address),
        csvEscape(ticket.reasonForPayment || "N/A"),
        csvEscape(ticket.preparedBy),
        csvEscape(modeOfPayment),
        csvEscape(amountStr)
      ];
    });

    // Add summary section
    const summaryRows: string[] = [];
    summaryRows.push(""); // Empty row
    summaryRows.push("TOTAL BALANCE," + totalBalance.toFixed(2));
    summaryRows.push(""); // Empty row
    summaryRows.push("Breakdown by Reason of Payment:");
    summaryRows.push("Reason,Total Cash Collected");
    
    // Sort reasons alphabetically
    const sortedReasons = Object.keys(cashByReason).sort();
    sortedReasons.forEach(reason => {
      summaryRows.push(`${reason},${cashByReason[reason].toFixed(2)}`);
    });

    const csvContent = [
      headers.map(csvEscape).join(","),
      ...rows.map(row => row.join(",")),
      ...summaryRows
    ].join("\r\n");

    // Prepend BOM for better Excel compatibility
    const bom = "\uFEFF";
    const blob = new Blob([bom + csvContent], { type: "text/csv;charset=utf-8;" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `sales-report-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Sales Reports</h2>
          <p className="text-muted-foreground">Generate and analyze sales performance reports</p>
        </div>
        <Button onClick={exportToCSV} className="flex items-center gap-2">
          <Download className="h-4 w-4" />
          Export CSV
        </Button>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Report Filters
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="space-y-2">
              <Label>Date Range</Label>
              <DatePickerWithRange
                date={dateRange}
                onDateChange={setDateRange}
                placeholder="Select date range"
              />
            </div>
            <div className="space-y-2">
              <Label>Payment Reason</Label>
              <Select value={selectedReason} onValueChange={setSelectedReason}>
                <SelectTrigger>
                  <SelectValue placeholder="All reasons" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Reasons</SelectItem>
                  {uniqueReasons.map(reason => (
                    <SelectItem key={reason} value={reason}>{reason}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Customer</Label>
              <Select value={selectedCustomer} onValueChange={setSelectedCustomer}>
                <SelectTrigger>
                  <SelectValue placeholder="All customers" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Customers</SelectItem>
                  {uniqueCustomers.map(customer => (
                    <SelectItem key={customer} value={customer}>{customer}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Actions</Label>
              <div className="flex gap-2">
                <Button 
                  variant="outline" 
                  onClick={() => {
                    setDateRange(undefined);
                    setSelectedReason("all");
                    setSelectedCustomer("all");
                  }}
                >
                  Clear Filters
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Summary Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <DollarSign className="h-8 w-8 text-green-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-muted-foreground">Total Revenue</p>
                <p className="text-2xl font-bold">ETB {totalRevenue.toFixed(2)}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <BarChart3 className="h-8 w-8 text-blue-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-muted-foreground">Total Tickets</p>
                <p className="text-2xl font-bold">{totalTickets}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <TrendingUp className="h-8 w-8 text-purple-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-muted-foreground">Average Ticket</p>
                <p className="text-2xl font-bold">ETB {averageTicketValue.toFixed(2)}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Users className="h-8 w-8 text-orange-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-muted-foreground">Unique Customers</p>
                <p className="text-2xl font-bold">{new Set(filteredTickets.map(t => t.customerName)).size}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Reports */}
      <Tabs defaultValue="general" className="w-full">
        <TabsList>
          <TabsTrigger value="general">General Report</TabsTrigger>
          <TabsTrigger value="by-reason">By Payment Reason</TabsTrigger>
          <TabsTrigger value="by-date">By Date</TabsTrigger>
          <TabsTrigger value="detailed">Detailed View</TabsTrigger>
        </TabsList>

        <TabsContent value="general" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>General Sales Summary</CardTitle>
              <CardDescription>Overview of sales performance for the selected period</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center p-4 border rounded-lg">
                    <p className="text-2xl font-bold text-green-600">ETB {totalRevenue.toFixed(2)}</p>
                    <p className="text-sm text-muted-foreground">Total Revenue</p>
                  </div>
                  <div className="text-center p-4 border rounded-lg">
                    <p className="text-2xl font-bold text-blue-600">{totalTickets}</p>
                    <p className="text-sm text-muted-foreground">Total Transactions</p>
                  </div>
                  <div className="text-center p-4 border rounded-lg">
                    <p className="text-2xl font-bold text-purple-600">ETB {averageTicketValue.toFixed(2)}</p>
                    <p className="text-sm text-muted-foreground">Average Transaction</p>
                  </div>
                  <div className="text-center p-4 border rounded-lg">
                    <p className="text-2xl font-bold text-orange-600">{new Set(filteredTickets.map(t => t.name)).size}</p>
                    <p className="text-sm text-muted-foreground">Unique Customers</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="by-reason" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Sales by Payment Reason</CardTitle>
              <CardDescription>Breakdown of sales by payment reason</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {Object.entries(ticketsByReason).map(([reason, count]) => {
                  const reasonRevenue = filteredTickets
                    .filter(t => t.reasonForPayment === reason)
                    .reduce((sum, t) => sum + t.paymentAmount, 0);
                  const percentage = totalTickets > 0 ? (count / totalTickets) * 100 : 0;
                  
                  return (
                    <div key={reason} className="flex items-center justify-between p-4 border rounded-lg">
                      <div>
                        <p className="font-medium">{reason}</p>
                        <p className="text-sm text-muted-foreground">{count} transactions</p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold">ETB {reasonRevenue.toFixed(2)}</p>
                        <Badge variant="secondary">{percentage.toFixed(1)}%</Badge>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="by-date" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Sales by Date</CardTitle>
              <CardDescription>Daily sales performance</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {Object.entries(ticketsByDate)
                  .sort(([a], [b]) => new Date(b).getTime() - new Date(a).getTime())
                  .map(([date, count]) => {
                    const dateRevenue = filteredTickets
                      .filter(t => t.date === date)
                      .reduce((sum, t) => sum + t.paymentAmount, 0);
                    
                    return (
                      <div key={date} className="flex items-center justify-between p-4 border rounded-lg">
                        <div>
                          <p className="font-medium">{new Date(date).toLocaleDateString()}</p>
                          <p className="text-sm text-muted-foreground">{count} transactions</p>
                        </div>
                        <div className="text-right">
                          <p className="font-bold">ETB {dateRevenue.toFixed(2)}</p>
                        </div>
                      </div>
                    );
                  })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="detailed" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Detailed Transaction Report</CardTitle>
              <CardDescription>Complete list of all transactions</CardDescription>
            </CardHeader>
            <CardContent>
              {/* Transactions Table */}
              <div className="space-y-2 mb-6">
                <div className="rounded-md border overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Date</TableHead>
                        <TableHead>Name</TableHead>
                        <TableHead>Phone Number</TableHead>
                        <TableHead>Customer ID</TableHead>
                        <TableHead>Location</TableHead>
                        <TableHead>Reason of Payment</TableHead>
                        <TableHead>Prepared By</TableHead>
                        <TableHead>Payment Mode</TableHead>
                        <TableHead className="text-right">Amount (Cash)</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredTickets
                        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                        .map((ticket) => {
                          const customerInfo = getCustomerInfo(ticket);
                          const modeOfPayment = (ticket as any).modeOfPayment || "N/A";
                          const cashAmount = (!modeOfPayment || modeOfPayment === 'CASH') 
                            ? ticket.paymentAmount 
                            : 0;
                          
                          return (
                            <TableRow key={ticket.id}>
                              <TableCell className="text-sm">{ticket.date}</TableCell>
                              <TableCell className="font-medium">{ticket.customerName}</TableCell>
                              <TableCell>{customerInfo.phone}</TableCell>
                              <TableCell className="font-mono text-xs">{customerInfo.id}</TableCell>
                              <TableCell>{customerInfo.address}</TableCell>
                              <TableCell>{ticket.reasonForPayment || "N/A"}</TableCell>
                              <TableCell>{ticket.preparedBy}</TableCell>
                              <TableCell>{modeOfPayment}</TableCell>
                              <TableCell className="text-right font-semibold">
                                {cashAmount > 0 ? `ETB ${cashAmount.toFixed(2)}` : "-"}
                              </TableCell>
                            </TableRow>
                          );
                        })}
                    </TableBody>
                  </Table>
                </div>
              </div>

              {/* Summary Section */}
              <div className="mt-8 space-y-4">
                <Card className="bg-muted/50">
                  <CardHeader>
                    <CardTitle className="text-2xl">TOTAL BALANCE</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold text-green-600">
                      ETB {totalBalance.toFixed(2)}
                    </div>
                    <p className="text-sm text-muted-foreground mt-2">
                      Total cash collected from all transactions
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Breakdown by Reason of Payment</CardTitle>
                    <CardDescription>Total cash collected for each payment reason</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {Object.keys(cashByReason)
                        .sort()
                        .map((reason) => (
                          <div
                            key={reason}
                            className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                          >
                            <div className="flex-1">
                              <p className="font-medium">{reason}</p>
                            </div>
                            <div className="text-right">
                              <p className="text-xl font-bold">ETB {cashByReason[reason].toFixed(2)}</p>
                            </div>
                          </div>
                        ))}
                      {Object.keys(cashByReason).length === 0 && (
                        <p className="text-center text-muted-foreground py-8">
                          No cash transactions found for the selected filters.
                        </p>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
