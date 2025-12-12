
import { z } from 'zod';

export const ticketFormSchema = z
  .object({
    name: z.string().min(2, { message: "Name must be at least 2 characters." }),
    phoneNumber: z.string().min(10, { message: "Please enter a valid phone number." }),
    reasonForPayment: z.string().min(2, { message: "Reason for payment is required." }),
    cashInFigure: z.coerce.number().positive({ message: "Amount must be a positive number." }),
    amountInWords: z.string().min(3, { message: "Amount in words is required." }),
    payersIdentification: z.string().optional(),
    modeOfPayment: z.enum(['CASH', 'BANK']),
    bankReceiptNo: z
      .string()
      .trim()
      .optional()
      .transform((value) => (value ? value.trim() : value)),
    preparedBy: z.string().min(2, { message: "Preparer's name is required." }),
    cashierSignature: z.string().optional(),
  })
  .superRefine((data, ctx) => {
    if (data.modeOfPayment === 'BANK') {
      if (!data.bankReceiptNo || data.bankReceiptNo.length === 0) {
        ctx.addIssue({
          path: ['bankReceiptNo'],
          code: z.ZodIssueCode.custom,
          message: "Bank receipt number is required for bank payments.",
        });
      }
    }
  });

export type TicketFormValues = z.infer<typeof ticketFormSchema>;

export type Ticket = {
  id: string;
  customerName: string;
  customerPhone?: string;
  paymentAmount: number;
  status: 'Sent' | 'Failed';
  date: string;
  reasonForPayment?: string;
  preparedBy: string;
  ticketNumber: string;
  modeOfPayment?: 'CASH' | 'BANK';
  bankReceiptNo?: string;
  auditStatus?: 'Pending' | 'Approved' | 'Rejected' | 'Voided';
  createdAt: Date;
};

export const customerRegistrationSchema = z.object({
  fullName: z.string().min(2, "Full name is required."),
  sex: z.enum(["Male", "Female"], { required_error: "Please select a gender." }),
  phoneNumber: z.string().min(10, { message: "Please enter a valid phone number." }),
  address: z.string().optional(),
  payersIdentification: z.string().min(3, "A valid identification ID is required."),
  savingType: z.string().min(2, "Saving type is required."),
  loanType: z.string().min(2, "Loan type is required."),
  registeredBy: z.string().optional(),
});

export type CustomerRegistrationValues = z.infer<typeof customerRegistrationSchema>;

export type Customer = CustomerRegistrationValues & {
  id: string;
  registrationDate: string;
  isActive: boolean;
};

export type Role = "superadmin" | "admin" | "sales" | "auditor" | "operation";

export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  password?: string; // Made optional for existing users without it
  role: Role;
  branchId: string;
  ticketNumberStart?: number;
  ticketNumberEnd?: number;
  currentTicketNumber?: number;
  isActive: boolean;
  failedLoginAttempts?: number;
  isLocked?: boolean;
  lockedAt?: Date | string | null;
  createdAt: Date | string; // Can be Date from Prisma or string from server action
  updatedAt: Date | string; // Can be Date from Prisma or string from server action
}

    