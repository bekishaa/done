// TypeScript types matching Prisma schema - for use with mysql2

export enum Role {
  SUPERADMIN = 'superadmin',
  ADMIN = 'admin',
  SALES = 'sales',
  AUDITOR = 'auditor',
  OPERATION = 'operation',
}

export enum Sex {
  MALE = 'Male',
  FEMALE = 'Female',
}

export enum TicketStatus {
  SENT = 'Sent',
  FAILED = 'Failed',
}

export enum HistoryEventType {
  TICKET = 'ticket',
}

export enum AuditStatus {
  PENDING = 'Pending',
  APPROVED = 'Approved',
  REJECTED = 'Rejected',
  VOIDED = 'Voided',
}

export enum PaymentMode {
  CASH = 'CASH',
  BANK = 'BANK',
}

export interface User {
  id: string;
  name: string;
  email: string;
  password: string | null;
  role: Role;
  branchId: string;
  ticketNumberStart: number | null;
  ticketNumberEnd: number | null;
  currentTicketNumber: number | null;
  isActive: boolean;
  failedLoginAttempts: number;
  isLocked: boolean;
  lockedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface Customer {
  id: string;
  fullName: string;
  sex: Sex;
  phoneNumber: string;
  address: string | null;
  payersIdentification: string;
  savingType: string;
  loanType: string;
  registrationDate: string;
  isActive: boolean;
  createdAt: Date;
  registeredBy: string;
}

export interface Ticket {
  id: string;
  customerName: string;
  customerPhone: string | null;
  paymentAmount: number;
  status: TicketStatus;
  date: string;
  reasonForPayment: string | null;
  preparedBy: string;
  ticketNumber: string;
  modeOfPayment: PaymentMode | null;
  bankReceiptNo: string | null;
  htmlContent: string | null;
  createdAt: Date;
  auditStatus: AuditStatus;
  auditedBy: string | null;
  auditedAt: Date | null;
  auditNote: string | null;
}

export interface CustomerHistory {
  id: string;
  eventType: HistoryEventType;
  amount: number;
  ticketNumber: string;
  date: string;
  preparedBy: string;
  reasonForPayment: string | null;
  customerId: string;
  createdAt: Date;
}

// Helper type for query results (mysql2 returns RowDataPacket)
export type QueryResult<T> = T[];



























