
"use client";

import { useState } from "react";
import * as React from "react";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
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
  TableFooter as ShadcnTableFooter
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import type { Customer, Ticket } from "@/lib/types";
import { Users, Search, X, ChevronDown, FileText, Wallet, Printer, ChevronLeft, ChevronRight } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useIsMobile } from "@/hooks/use-mobile";
import { createClientTicketHtml } from "@/lib/ticket-html";
import { getDateRangeFromFilter, getTicketDate, isDateInRange } from "@/lib/date-utils";

interface CustomerListProps {
  customers: Customer[];
  tickets: Ticket[];
  users?: Array<{ name: string; branchId: string }>; // Users with branch info
  branches?: Array<{ id: string; name: string }>; // Branches
  showPaymentFilters?: boolean; // Show cash/bank filters
  showDateFilter?: boolean; // Show date filter
}

const savingTypes = [
   "GIHON Regular Saving Account (ግዮን መደበኛ የቁጠባ ሂሳብ)",
   "Michu Current Saving Account",
   "Children Saving Account",
   "Elders Saving Account",
];

const loanTypes = [
    "Efoyta emergency loan",
    "Tiguhan small business loan",
    "Tiguhan Medium business loan",
    "Tiguhan loan",
    "Mothers Loan",
    "Young Women's loan",
    "Motorcycle & Taxi Drivers Loan",
];


export function CustomerList({ customers, tickets, users = [], branches = [], showPaymentFilters = false, showDateFilter = false }: CustomerListProps) {
  const isMobile = useIsMobile();
  const [searchTerm, setSearchTerm] = useState("");
  const [savingTypeFilter, setSavingTypeFilter] = useState("all");
  const [loanTypeFilter, setLoanTypeFilter] = useState("all");
  const [salesFilter, setSalesFilter] = useState("all");
  const [branchFilter, setBranchFilter] = useState("all");
  const [voidFilter, setVoidFilter] = useState<'active' | 'voided'>('active');
  const [paymentFilter, setPaymentFilter] = useState<'all' | 'CASH' | 'BANK'>('all');
  const [dateFilter, setDateFilter] = useState<string>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 50;

  const salesNames = Array.from(new Set(customers.map(c => c.registeredBy))).filter(Boolean);
  
  // Create a map of user name to branchId
  const userBranchMap = new Map(users.map(u => [u.name, u.branchId]));
  
  // Get unique branch IDs from users
  const availableBranches = branches.filter(b => 
    users.some(u => u.branchId === b.id)
  );

  // Filter customers based on all criteria
  const filteredCustomers = customers.filter((customer) => {
    const term = searchTerm.toLowerCase();
    const matchesSearchTerm =
      customer.fullName.toLowerCase().includes(term) ||
      customer.phoneNumber.includes(term) ||
      (customer.payersIdentification && customer.payersIdentification.toLowerCase().includes(term));

    const matchesSavingType =
      savingTypeFilter === "all" || customer.savingType === savingTypeFilter;

    const matchesLoanType =
      loanTypeFilter === "all" || customer.loanType === loanTypeFilter;

    const matchesSales = salesFilter === "all" || customer.registeredBy === salesFilter;
    
    // Filter by branch - check which branch the user who registered the customer belongs to
    let matchesBranch = true;
    if (branchFilter !== "all" && users.length > 0) {
      const customerBranchId = userBranchMap.get(customer.registeredBy);
      matchesBranch = customerBranchId === branchFilter;
    }

    // Filter by payment type if enabled
    let matchesPayment = true;
    if (showPaymentFilters && paymentFilter !== 'all') {
      const customerTickets = tickets.filter(t => t.customerName === customer.fullName);
      matchesPayment = customerTickets.some(t => {
        const modeOfPayment = (t as any).modeOfPayment;
        if (paymentFilter === 'CASH') {
          return !modeOfPayment || modeOfPayment === 'CASH' || modeOfPayment === null || modeOfPayment === undefined;
        } else if (paymentFilter === 'BANK') {
          return modeOfPayment === 'BANK';
        }
        return true;
      });
    }

    // Filter by date if enabled
    let matchesDate = true;
    if (showDateFilter && dateFilter !== 'all') {
      const customerTickets = tickets.filter(t => t.customerName === customer.fullName);
      const dateRange = getDateRangeFromFilter(dateFilter);
      
      if (dateRange) {
        matchesDate = customerTickets.some(t => 
          isDateInRange(getTicketDate(t), dateRange)
        );
      }
    }

    return matchesSearchTerm && matchesSavingType && matchesLoanType && matchesSales && matchesBranch && matchesPayment && matchesDate;
  });
  
  // Pagination logic
  const totalPages = Math.ceil(filteredCustomers.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedCustomers = filteredCustomers.slice(startIndex, endIndex);
  
  // Reset to page 1 when filters change
  React.useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, savingTypeFilter, loanTypeFilter, salesFilter, branchFilter, paymentFilter, dateFilter]);
  
  const clearFilters = () => {
    setSearchTerm("");
    setSavingTypeFilter("all");
    setLoanTypeFilter("all");
    setSalesFilter("all");
    setBranchFilter("all");
    setPaymentFilter("all");
    setDateFilter("all");
    setCurrentPage(1);
  }
  
  const hasActiveFilters = searchTerm || savingTypeFilter !== 'all' || loanTypeFilter !== 'all' || salesFilter !== 'all' || branchFilter !== 'all' ||
    (showPaymentFilters && paymentFilter !== 'all') || (showDateFilter && dateFilter !== 'all');


  return (
    <Card>
      <CardHeader>
        <CardTitle>Registered Customers</CardTitle>
        <CardDescription>
          A searchable and filterable list of all customers. Click a row to view recent transactions.
        </CardDescription>
        <div className="space-y-4 pt-2">
            <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                    type="search"
                    placeholder="Search by name, phone, or ID..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                />
            </div>
            <div className={`grid gap-4 ${isMobile ? 'grid-cols-1' : 'grid-cols-1 md:grid-cols-4'}`}>
                <Select value={savingTypeFilter} onValueChange={setSavingTypeFilter}>
                    <SelectTrigger>
                        <SelectValue placeholder="Filter by Saving Type" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">All Saving Types</SelectItem>
                        {savingTypes.map(type => (
                             <SelectItem key={type} value={type}>{isMobile ? type.split(' ')[0] : type}</SelectItem>
                        ))}
                    </SelectContent>
                </Select>
                 <Select value={loanTypeFilter} onValueChange={setLoanTypeFilter}>
                    <SelectTrigger>
                        <SelectValue placeholder="Filter by Loan Type" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">All Loan Types</SelectItem>
                        {loanTypes.map(type => (
                             <SelectItem key={type} value={type}>{isMobile ? type.split(' ')[0] : type}</SelectItem>
                        ))}
                    </SelectContent>
                </Select>
                <Select value={salesFilter} onValueChange={setSalesFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="Filter by Sales" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Sales</SelectItem>
                    {salesNames.map(name => (
                      <SelectItem key={name} value={name}>{name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {availableBranches.length > 0 && (
                  <Select value={branchFilter} onValueChange={setBranchFilter}>
                    <SelectTrigger>
                      <SelectValue placeholder="Filter by Branch" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Branches</SelectItem>
                      {availableBranches.map(branch => (
                        <SelectItem key={branch.id} value={branch.id}>{branch.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
                <Select value={voidFilter} onValueChange={(v) => setVoidFilter(v as any)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Transactions" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Active (exclude Voided)</SelectItem>
                    <SelectItem value="voided">Voided only</SelectItem>
                  </SelectContent>
                </Select>
                {showPaymentFilters && (
                  <Select value={paymentFilter} onValueChange={(v) => setPaymentFilter(v as any)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Payment Type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Payment Types</SelectItem>
                      <SelectItem value="CASH">Cash</SelectItem>
                      <SelectItem value="BANK">Bank</SelectItem>
                    </SelectContent>
                  </Select>
                )}
                {showDateFilter && (
                  <Select value={dateFilter} onValueChange={setDateFilter}>
                    <SelectTrigger>
                      <SelectValue placeholder="Date Range" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Dates</SelectItem>
                      <SelectItem value="today">Today</SelectItem>
                      <SelectItem value="week">Last 7 Days</SelectItem>
                      <SelectItem value="month">Last 30 Days</SelectItem>
                    </SelectContent>
                  </Select>
                )}
                {hasActiveFilters && (
                    <Button variant="ghost" onClick={clearFilters} className={isMobile ? 'w-full' : ''}>
                        <X className="mr-2 h-4 w-4" />
                        Clear Filters
                    </Button>
                )}
            </div>
        </div>
      </CardHeader>
      <CardContent>
        {filteredCustomers.length > 0 ? (
          <>
            <div className={isMobile ? "overflow-x-auto" : ""}>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-10"></TableHead>
                    <TableHead>Full Name</TableHead>
                    <TableHead>Phone Number</TableHead>
                    <TableHead className={isMobile ? "min-w-[140px]" : ""}>Payer's ID</TableHead>
                    <TableHead className={isMobile ? "min-w-[140px]" : ""}>Address</TableHead>
                    <TableHead className={isMobile ? "min-w-[120px]" : ""}>Saving Type</TableHead>
                    <TableHead className={isMobile ? "min-w-[120px]" : ""}>Loan Type</TableHead>
                    <TableHead className={isMobile ? "min-w-[100px]" : ""}>Registered On</TableHead>
                  </TableRow>
                </TableHeader>
                {paginatedCustomers.map((customer) => {
                const hasHistory = (customer.history && customer.history.length > 0);
                const rawCustomerTickets = hasHistory
                  ? []
                  : tickets.filter(
                      (ticket) =>
                        ((ticket.customerPhone && ticket.customerPhone === customer.phoneNumber) ||
                        ticket.customerName === customer.fullName)
                    );
                const customerTickets = rawCustomerTickets.filter(t => voidFilter === 'voided' ? t.auditStatus === 'Voided' : t.auditStatus !== 'Voided');
                const totalAmount = hasHistory
                  ? (customer.history || []).reduce((sum, h) => sum + (h.amount || 0), 0)
                  : customerTickets.reduce((sum, ticket) => sum + ticket.paymentAmount, 0);

                return (
                <Collapsible asChild key={customer.id} >
                  <TableBody>
                    <CollapsibleTrigger asChild>
                      <TableRow className="cursor-pointer group">
                        <TableCell>
                          <ChevronDown className="h-4 w-4 transition-transform duration-200 group-data-[state=open]:rotate-180" />
                        </TableCell>
                        <TableCell className="font-medium">{customer.fullName}</TableCell>
                        <TableCell>{customer.phoneNumber}</TableCell>
                        <TableCell className={isMobile ? "text-xs" : ""}>{customer.payersIdentification || 'N/A'}</TableCell>
                        <TableCell className={isMobile ? "text-xs" : ""}>{customer.address || 'N/A'}</TableCell>
                        <TableCell>
                          <Badge variant="outline" className={isMobile ? "text-xs" : ""}>
                            {isMobile ? customer.savingType.split(' ')[0] : customer.savingType}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge variant="secondary" className={isMobile ? "text-xs" : ""}>
                            {isMobile ? customer.loanType.split(' ')[0] : customer.loanType}
                          </Badge>
                        </TableCell>
                        <TableCell className={isMobile ? "text-xs" : ""}>{customer.registrationDate}</TableCell>
                      </TableRow>
                    </CollapsibleTrigger>
                    <CollapsibleContent asChild>
                       <tr className="bg-muted/50 hover:bg-muted/50">
                        <TableCell colSpan={8} className="p-0">
                           <div className="p-4">
                            <h4 className="font-semibold text-sm mb-2 flex items-center">
                              <Wallet className="mr-2 h-4 w-4" />
                              Recent Transactions
                            </h4>
                             {(hasHistory ? (customer.history || []).length > 0 : customerTickets.length > 0) ? (
                                <Table>
                                  <TableHeader>
                                    <TableRow>
                                      <TableHead>Date</TableHead>
                                      <TableHead>Reason</TableHead>
                                      <TableHead>Registered By</TableHead>
                                      <TableHead className="text-right">Amount</TableHead>
                                      <TableHead className="text-center">Print</TableHead>
                                    </TableRow>
                                  </TableHeader>
                                  <TableBody>
                                    {hasHistory
                                      ? (customer.history || []).map((h, idx) => (
                                          <TableRow key={idx}>
                                            <TableCell>{h.date}</TableCell>
                                            <TableCell>{h.reasonForPayment || 'N/A'}</TableCell>
                                            <TableCell>{h.preparedBy}</TableCell>
                                            <TableCell className="text-right font-mono">ETB {h.amount.toFixed(2)}</TableCell>
                                            <TableCell className="text-center">
                                              <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={() => {
                                                  const html = createClientTicketHtml({
                                                    name: customer.fullName,
                                                    phoneNumber: customer.phoneNumber,
                                                    reasonForPayment: h.reasonForPayment || 'N/A',
                                                    cashInFigure: h.amount,
                                                    amountInWords: '',
                                                    payersIdentification: customer.payersIdentification,
                                                    modeOfPayment: 'CASH',
                                                    preparedBy: h.preparedBy,
                                                    date: h.date,
                                                    receiptNo: h.ticketNumber,
                                                  });
                                                  const win = window.open('', '_blank');
                                                  if (win) {
                                                    win.document.open();
                                                    win.document.write(html);
                                                    win.document.close();
                                                    win.focus();
                                                  }
                                                }}
                                              >
                                                <Printer className="h-4 w-4" />
                                              </Button>
                                            </TableCell>
                                          </TableRow>
                                        ))
                                      : customerTickets.map((ticket) => (
                                          <TableRow key={ticket.id}>
                                            <TableCell>{ticket.date}</TableCell>
                                            <TableCell>{ticket.reasonForPayment || 'N/A'}</TableCell>
                                            <TableCell>{ticket.preparedBy}</TableCell>
                                            <TableCell className="text-right font-mono">ETB {ticket.paymentAmount.toFixed(2)}</TableCell>
                                            <TableCell className="text-center">
                                              <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={() => {
                                                  const html = createClientTicketHtml({
                                                    name: ticket.customerName,
                                                    phoneNumber: ticket.customerPhone || customer.phoneNumber,
                                                    reasonForPayment: ticket.reasonForPayment || 'N/A',
                                                    cashInFigure: ticket.paymentAmount,
                                                    amountInWords: '',
                                                    payersIdentification: customer.payersIdentification,
                                                    modeOfPayment: ticket.modeOfPayment === 'BANK' ? 'BANK' : 'CASH',
                                                    bankReceiptNo: ticket.bankReceiptNo || undefined,
                                                    preparedBy: ticket.preparedBy,
                                                    date: ticket.date,
                                                    receiptNo: ticket.ticketNumber,
                                                  });
                                                  const win = window.open('', '_blank');
                                                  if (win) {
                                                    win.document.open();
                                                    win.document.write(html);
                                                    win.document.close();
                                                    win.focus();
                                                  }
                                                }}
                                              >
                                                <Printer className="h-4 w-4" />
                                              </Button>
                                            </TableCell>
                                          </TableRow>
                                        ))}
                                  </TableBody>
                                   <ShadcnTableFooter>
                                    <TableRow>
                                        <TableCell colSpan={3} className="font-bold text-right">Total Amount</TableCell>
                                        <TableCell className="text-right font-bold font-mono">ETB {totalAmount.toFixed(2)}</TableCell>
                                    </TableRow>
                                   </ShadcnTableFooter>
                                </Table>
                             ) : (
                                <div className="flex flex-col items-center justify-center text-center text-muted-foreground p-8">
                                  <FileText className="w-8 h-8 mb-2 text-gray-400" />
                                  <p className="font-semibold">No transactions found</p>
                                  <p className="text-xs">This customer has no recent history.</p>
                                </div>
                             )}
                           </div>
                        </TableCell>
                      </tr>
                    </CollapsibleContent>
                  </TableBody>
                </Collapsible>
              )})}
            </Table>
          </div>
          {totalPages > 1 && (
            <div className="flex items-center justify-between mt-4 px-2">
              <div className="text-sm text-muted-foreground">
                Showing {startIndex + 1} to {Math.min(endIndex, filteredCustomers.length)} of {filteredCustomers.length} customers
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
             {customers.length > 0 && hasActiveFilters ? (
              <>
                <Search className="w-12 h-12 mb-4 text-gray-400" />
                <p className="font-semibold text-lg">No customers found</p>
                <p className="text-sm">Your search did not return any results.</p>
              </>
            ) : (
              <>
                <Users className="w-12 h-12 mb-4 text-gray-400" />
                <p className="font-semibold text-lg">No customers registered yet</p>
                <p className="text-sm">New customers will appear here after registration.</p>
              </>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
