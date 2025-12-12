"use client";

import { useState, useTransition, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { CheckCircle2, XCircle, Ban, Loader2, Send, Filter } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/use-auth";
import { approveTicket, rejectTicket, voidTicket, fetchSalesTransactions, resendTicket } from "@/app/actions";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import type { Ticket } from "@/lib/types";
import { TicketDashboard } from "./ticket-dashboard";

interface AuditorApprovalProps {
  onDataChange?: () => void;
}

export function AuditorApproval({ onDataChange }: AuditorApprovalProps) {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isPending, startTransition] = useTransition();
  const [allTickets, setAllTickets] = useState<Ticket[]>([]);
  const [filteredTickets, setFilteredTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);
  const [action, setAction] = useState<'approve' | 'reject' | 'void' | 'resend' | null>(null);
  const [note, setNote] = useState("");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [filterDate, setFilterDate] = useState<string>("today"); // today | 7 | 30 | all
  
  const isSalesUser = user?.role === 'sales';
  const isAuditor = user?.role === 'auditor';

  useEffect(() => {
    loadTickets();
  }, []);

  useEffect(() => {
    applyFilter();
  }, [filterStatus, filterDate, allTickets]);

  const loadTickets = async () => {
    setLoading(true);
    try {
      let tickets;
      if (isAuditor) {
        // Auditor: Only show pending tickets from their branch
        tickets = await fetchSalesTransactions({
          auditStatus: 'Pending',
          currentUser: user ? { role: user.role, name: user.name, branchId: user.branchId } : undefined
        });
      } else if (isSalesUser) {
        // Sales: Show all tickets (for filtering)
        tickets = await fetchSalesTransactions({
          currentUser: user ? { role: user.role, name: user.name, branchId: user.branchId } : undefined
        });
      } else {
        tickets = [];
      }
      setAllTickets(tickets as any);
    } catch (error) {
      console.error('Failed to load tickets:', error);
      toast({
        title: "Error",
        description: "Failed to load tickets.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const applyFilter = () => {
    // base set
    let next = allTickets;

    // date filter
    const now = new Date();
    let startDate: Date | null = null;
    if (filterDate === 'today') {
      startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    } else if (filterDate === '7') {
      startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      startDate.setDate(startDate.getDate() - 6);
    } else if (filterDate === '30') {
      startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      startDate.setDate(startDate.getDate() - 29);
    }
    if (startDate) {
      next = next.filter(t => {
        const created = new Date((t as any).createdAt || t.date);
        return created >= startDate && created <= new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59, 999);
      });
    }

    // role-specific and status filter
    if (isAuditor) {
      next = next.filter(t => (t.auditStatus || 'Pending') === 'Pending');
    }
    if (!isAuditor) {
      if (filterStatus !== 'all') {
        next = next.filter(t => (t.auditStatus || 'Pending') === filterStatus);
      }
    }

    // sort by date desc
    next = next.sort((a, b) => new Date((b as any).createdAt || b.date).getTime() - new Date((a as any).createdAt || a.date).getTime());

    setFilteredTickets(next);
  };

  const handleAction = (ticket: Ticket, actionType: 'approve' | 'reject' | 'void' | 'resend') => {
    setSelectedTicket(ticket);
    setAction(actionType);
    setNote("");
  };

  const submitAction = () => {
    if (!selectedTicket || !action || !user) return;

    startTransition(async () => {
      try {
        if (action === 'approve') {
          await approveTicket({
            ticketId: selectedTicket.id,
            auditorName: user.name,
            note: note || undefined,
          });
          toast({
            title: "Ticket Approved",
            description: `Ticket ${selectedTicket.ticketNumber} has been approved.`,
          });
        } else if (action === 'reject') {
          await rejectTicket({
            ticketId: selectedTicket.id,
            auditorName: user.name,
            note: note || undefined,
          });
          toast({
            title: "Ticket Rejected",
            description: `Ticket ${selectedTicket.ticketNumber} has been rejected.`,
          });
        } else if (action === 'void') {
          await voidTicket({
            ticketId: selectedTicket.id,
            auditorName: user.name,
            note: note || undefined,
          });
          toast({
            title: "Ticket Voided",
            description: `Ticket ${selectedTicket.ticketNumber} has been voided.`,
          });
        } else if (action === 'resend') {
          await resendTicket({
            ticketId: selectedTicket.id,
          });
          toast({
            title: "Ticket Resent",
            description: `Ticket ${selectedTicket.ticketNumber} has been resent for approval.`,
          });
        }
        setSelectedTicket(null);
        setAction(null);
        setNote("");
        await loadTickets();
        // Notify parent to refresh data
        if (onDataChange) {
          onDataChange();
        }
      } catch (error: any) {
        toast({
          title: "Action Failed",
          description: error?.message || "Failed to process ticket.",
          variant: "destructive",
        });
      }
    });
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-8">
          <Loader2 className="h-8 w-8 animate-spin" />
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>
            {isAuditor ? 'Pending Ticket Approvals' : 'Ticket Audit Status'}
          </CardTitle>
          <CardDescription>
            {isAuditor 
              ? 'Review and approve, reject, or void tickets that require your attention.'
              : 'View ticket audit status. You can resend rejected tickets for approval.'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {/* Filters */}
          <div className="mb-4 flex flex-wrap items-center gap-4">
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4" />
              <Label>Filter by Date:</Label>
            </div>
            <Select value={filterDate} onValueChange={setFilterDate}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Today" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="today">Today</SelectItem>
                <SelectItem value="7">Last 7 days</SelectItem>
                <SelectItem value="30">Last 30 days</SelectItem>
                <SelectItem value="all">All Dates</SelectItem>
              </SelectContent>
            </Select>

            {!isAuditor && (
              <>
                <div className="flex items-center gap-2">
                  <Filter className="h-4 w-4" />
                  <Label htmlFor="status-filter">Filter by Status:</Label>
                </div>
                <Select value={filterStatus} onValueChange={setFilterStatus}>
                  <SelectTrigger id="status-filter" className="w-[200px]">
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Tickets</SelectItem>
                    <SelectItem value="Pending">Pending</SelectItem>
                    <SelectItem value="Approved">Approved</SelectItem>
                    <SelectItem value="Rejected">Rejected</SelectItem>
                    <SelectItem value="Voided">Voided</SelectItem>
                  </SelectContent>
                </Select>
              </>
            )}
          </div>
          
          {filteredTickets.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              {isAuditor 
                ? 'No pending tickets found.' 
                : `No ${filterStatus === 'all' ? '' : filterStatus.toLowerCase()} tickets found.`}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Ticket Number</TableHead>
                    <TableHead>Customer</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Prepared By</TableHead>
                    <TableHead>Reason</TableHead>
                    {isSalesUser && <TableHead>Status</TableHead>}
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredTickets.map((ticket) => {
                    const auditStatus = ticket.auditStatus || 'Pending';
                    return (
                      <TableRow key={ticket.id}>
                        <TableCell className="font-mono">{ticket.ticketNumber}</TableCell>
                        <TableCell>{ticket.customerName}</TableCell>
                        <TableCell className="font-semibold">
                          ETB {ticket.paymentAmount.toFixed(2)}
                        </TableCell>
                        <TableCell>{ticket.date}</TableCell>
                        <TableCell>{ticket.preparedBy}</TableCell>
                        <TableCell>{ticket.reasonForPayment || "N/A"}</TableCell>
                        {isSalesUser && (
                          <TableCell>
                            <Badge 
                              variant={
                                auditStatus === 'Approved' ? 'default' :
                                auditStatus === 'Rejected' ? 'destructive' :
                                auditStatus === 'Voided' ? 'secondary' :
                                'outline'
                              }
                            >
                              {auditStatus}
                            </Badge>
                          </TableCell>
                        )}
                        <TableCell>
                          <div className="flex gap-2">
                            {isAuditor ? (
                              // Auditor: Show approve/reject/void buttons for pending tickets
                              <>
                                <Button
                                  size="sm"
                                  variant="default"
                                  onClick={() => handleAction(ticket, 'approve')}
                                >
                                  <CheckCircle2 className="h-4 w-4 mr-1" />
                                  Approve
                                </Button>
                                <Button
                                  size="sm"
                                  variant="destructive"
                                  onClick={() => handleAction(ticket, 'reject')}
                                >
                                  <XCircle className="h-4 w-4 mr-1" />
                                  Reject
                                </Button>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => handleAction(ticket, 'void')}
                                >
                                  <Ban className="h-4 w-4 mr-1" />
                                  Void
                                </Button>
                              </>
                            ) : isSalesUser ? (
                              // Sales: Only show resend button for rejected tickets
                              auditStatus === 'Rejected' ? (
                                <Button
                                  size="sm"
                                  variant="default"
                                  onClick={() => handleAction(ticket, 'resend')}
                                >
                                  <Send className="h-4 w-4 mr-1" />
                                  Resend
                                </Button>
                              ) : (
                                <span className="text-sm text-muted-foreground">View Only</span>
                              )
                            ) : null}
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {isSalesUser && (
        <div className="mt-6">
          <TicketDashboard tickets={allTickets as any} initialDateFilter="today" showDateFilter={false} />
        </div>
      )}

      <Dialog open={!!selectedTicket && !!action} onOpenChange={(open) => {
        if (!open) {
          setSelectedTicket(null);
          setAction(null);
          setNote("");
        }
      }}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {action === 'approve' && 'Approve Ticket'}
              {action === 'reject' && 'Reject Ticket'}
              {action === 'void' && 'Void Ticket'}
              {action === 'resend' && 'Resend Ticket'}
            </DialogTitle>
            <DialogDescription>
              {action === 'approve' && 'Are you sure you want to approve this ticket?'}
              {action === 'reject' && 'Are you sure you want to reject this ticket?'}
              {action === 'void' && 'Are you sure you want to void this ticket? This action cannot be undone.'}
              {action === 'resend' && 'Are you sure you want to resend this rejected ticket? It will be reset to Pending status and sent again for approval.'}
            </DialogDescription>
          </DialogHeader>
          {selectedTicket && (
            <div className="space-y-4">
              <div className="space-y-2">
                <div className="text-sm font-medium">Ticket Number: {selectedTicket.ticketNumber}</div>
                <div className="text-sm">Customer: {selectedTicket.customerName}</div>
                <div className="text-sm">Amount: ETB {selectedTicket.paymentAmount.toFixed(2)}</div>
              </div>
              {action !== 'resend' && (
                <div className="space-y-2">
                  <label className="text-sm font-medium">Note (optional)</label>
                  <Textarea
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                    placeholder="Add a note about this action..."
                    rows={3}
                  />
                </div>
              )}
            </div>
          )}
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setSelectedTicket(null);
                setAction(null);
                setNote("");
              }}
            >
              Cancel
            </Button>
            <Button
              onClick={submitAction}
              disabled={isPending}
              variant={action === 'reject' || action === 'void' ? 'destructive' : 'default'}
            >
              {isPending && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
              {action === 'approve' && 'Approve'}
              {action === 'reject' && 'Reject'}
              {action === 'void' && 'Void'}
              {action === 'resend' && 'Resend'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}

