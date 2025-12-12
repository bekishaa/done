import { prisma } from '@/lib/db';
import { Ticket, TicketStatus, AuditStatus } from '@/lib/db-types';

export interface CreateTicketData {
  name: string;
  phoneNumber: string;
  reasonForPayment: string;
  cashInFigure: number;
  amountInWords: string;
  payersIdentification?: string;
  modeOfPayment: 'CASH' | 'BANK';
  bankReceiptNo?: string;
  preparedBy: string;
  cashierSignature?: string;
  userId: string;
  customerId?: string;
  branchId: string;
}

export interface TicketWithRelations extends Ticket {
  user: {
    id: string;
    name: string;
    email: string;
  };
  customer?: {
    id: string;
    fullName: string;
    phoneNumber: string;
  } | null;
  branch: {
    id: string;
    name: string;
  };
}

export class TicketService {
  /**
   * Create a new ticket
   */
  static async createTicket(data: CreateTicketData): Promise<TicketWithRelations> {
    // Generate ticket number
    const ticketNumber = await this.generateTicketNumber(data.userId);
    
    const ticket = await prisma.ticket.create({
      customerName: data.name,
      customerPhone: data.phoneNumber,
      paymentAmount: data.cashInFigure,
      status: TicketStatus.FAILED,
      date: new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }),
      reasonForPayment: data.reasonForPayment,
      preparedBy: data.preparedBy,
      ticketNumber,
      modeOfPayment: data.modeOfPayment,
      bankReceiptNo: data.bankReceiptNo,
      htmlContent: undefined,
      auditStatus: AuditStatus.PENDING,
      auditedBy: null,
      auditedAt: null,
      auditNote: null,
    });

    // Get related data separately
    const user = await prisma.user.findFirst({ name: data.preparedBy });
    const customer = data.customerId ? await prisma.customer.findUnique({ id: data.customerId }) : null;

    return {
      ...ticket,
      user: user ? { id: user.id, name: user.name, email: user.email } : { id: '', name: '', email: '' },
      customer: customer ? { id: customer.id, fullName: customer.fullName, phoneNumber: customer.phoneNumber } : null,
      branch: { id: data.branchId, name: data.branchId }, // Simplified
    };
  }

  /**
   * Get all tickets with optional filtering
   */
  static async getTickets(filters?: {
    branchId?: string;
    userId?: string;
    status?: TicketStatus;
    auditStatus?: AuditStatus;
    dateFrom?: Date;
    dateTo?: Date;
  }): Promise<TicketWithRelations[]> {
    const tickets = await prisma.ticket.findMany({
      status: filters?.status,
      auditStatus: filters?.auditStatus || AuditStatus.PENDING, // Exclude voided by default
    });

    // Map to TicketWithRelations (simplified - would need JOINs for full relations)
    return tickets.map(t => ({
      ...t,
      user: { id: '', name: t.preparedBy, email: '' }, // Would need lookup
      customer: null, // Would need lookup
      branch: { id: '', name: '' }, // Would need lookup
    }));
  }

  /**
   * Get ticket by ID
   */
  static async getTicketById(id: string): Promise<TicketWithRelations | null> {
    const ticket = await prisma.ticket.findUnique({ id });
    if (!ticket) return null;

    const user = await prisma.user.findFirst({ name: ticket.preparedBy });
    const customer = ticket.customerPhone ? await prisma.customer.findUnique({ phoneNumber: ticket.customerPhone }) : null;

    return {
      ...ticket,
      user: user ? { id: user.id, name: user.name, email: user.email } : { id: '', name: ticket.preparedBy, email: '' },
      customer: customer ? { id: customer.id, fullName: customer.fullName, phoneNumber: customer.phoneNumber } : null,
      branch: { id: '', name: '' }, // Would need lookup
    };
  }

  /**
   * Update ticket status
   */
  static async updateTicketStatus(
    id: string,
    status: TicketStatus,
    auditStatus?: AuditStatus
  ): Promise<TicketWithRelations> {
    const updateData: any = { status };
    if (auditStatus) {
      updateData.auditStatus = auditStatus;
    }

    const ticket = await prisma.ticket.update({ id }, updateData);
    const user = await prisma.user.findFirst({ name: ticket.preparedBy });
    const customer = ticket.customerPhone ? await prisma.customer.findUnique({ phoneNumber: ticket.customerPhone }) : null;

    return {
      ...ticket,
      user: user ? { id: user.id, name: user.name, email: user.email } : { id: '', name: ticket.preparedBy, email: '' },
      customer: customer ? { id: customer.id, fullName: customer.fullName, phoneNumber: customer.phoneNumber } : null,
      branch: { id: '', name: '' },
    };
  }

  /**
   * Generate unique ticket number for user
   */
  private static async generateTicketNumber(userId: string): Promise<string> {
    const user = await prisma.user.findUnique({ id: userId });

    if (!user) {
      throw new Error('User not found');
    }

    // If user has ticket number range, use it
    if (user.ticketNumberStart && user.ticketNumberEnd && user.currentTicketNumber) {
      const nextNumber = user.currentTicketNumber + 1;
      
      // Check if we've exceeded the range
      if (nextNumber > user.ticketNumberEnd) {
        throw new Error('Ticket number range exceeded');
      }

      // Update user's current ticket number
      await prisma.user.update({ id: userId }, { currentTicketNumber: nextNumber });

      return `TKT-${nextNumber}`;
    }

    // Fallback: generate timestamp-based ticket number
    const timestamp = Date.now();
    return `TKT-${timestamp}`;
  }

  /**
   * Get ticket statistics
   */
  static async getTicketStats(filters?: {
    branchId?: string;
    userId?: string;
    dateFrom?: Date;
    dateTo?: Date;
  }) {
    const totalTickets = await prisma.ticket.count();
    const totalRevenueResult = await prisma.ticket.aggregate({});
    const pendingTickets = await prisma.ticket.count({ auditStatus: AuditStatus.PENDING });
    const approvedTickets = await prisma.ticket.count({ auditStatus: AuditStatus.APPROVED });
    const rejectedTickets = await prisma.ticket.count({ auditStatus: AuditStatus.REJECTED });

    return {
      totalTickets,
      totalRevenue: totalRevenueResult._sum.paymentAmount || 0,
      pendingTickets,
      approvedTickets,
      rejectedTickets,
      averageTicketValue: totalTickets > 0 ? (totalRevenueResult._sum.paymentAmount || 0) / totalTickets : 0,
    };
  }
}
