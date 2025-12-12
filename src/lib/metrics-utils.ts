/**
 * Centralized metrics calculation utilities for consistent revenue, cash, and bank calculations
 */

import { getTicketDate, isDateInRange, getTodayRange, getLast7DaysRange, getLast30DaysRange, type DateRange } from './date-utils';
import type { Ticket } from './types';

export interface RevenueBreakdown {
  total: number;
  cash: number;
  bank: number;
  missingPaymentMode: number; // Count of tickets with missing modeOfPayment
}

export interface MetricsResult {
  revenue: RevenueBreakdown;
  ticketCount: number;
}

/**
 * Check if a ticket is cash payment
 * Handles backward compatibility: null/undefined/empty defaults to CASH
 */
export function isCashPayment(ticket: Ticket): boolean {
  const modeOfPayment = (ticket as any).modeOfPayment;
  return !modeOfPayment || modeOfPayment === 'CASH' || modeOfPayment === null || modeOfPayment === undefined;
}

/**
 * Check if a ticket is bank payment
 */
export function isBankPayment(ticket: Ticket): boolean {
  const modeOfPayment = (ticket as any).modeOfPayment;
  return modeOfPayment === 'BANK';
}

/**
 * Check if a ticket has missing payment mode (for data quality tracking)
 */
export function hasMissingPaymentMode(ticket: Ticket): boolean {
  const modeOfPayment = (ticket as any).modeOfPayment;
  return modeOfPayment === null || modeOfPayment === undefined || modeOfPayment === '';
}

/**
 * Calculate revenue breakdown from tickets
 */
export function calculateRevenueBreakdown(tickets: Ticket[]): RevenueBreakdown {
  let total = 0;
  let cash = 0;
  let bank = 0;
  let missingPaymentMode = 0;

  for (const ticket of tickets) {
    const amount = ticket.paymentAmount || 0;
    total += amount;

    if (hasMissingPaymentMode(ticket)) {
      missingPaymentMode++;
      // Default to cash for backward compatibility
      cash += amount;
    } else if (isCashPayment(ticket)) {
      cash += amount;
    } else if (isBankPayment(ticket)) {
      bank += amount;
    } else {
      // Unknown payment type, default to cash
      cash += amount;
    }
  }

  return { total, cash, bank, missingPaymentMode };
}

/**
 * Calculate metrics for tickets within a date range
 */
export function calculateMetricsForDateRange(
  tickets: Ticket[],
  dateRange: DateRange | null
): MetricsResult {
  let filteredTickets = tickets;

  if (dateRange) {
    filteredTickets = tickets.filter(ticket =>
      isDateInRange(getTicketDate(ticket), dateRange)
    );
  }

  const revenue = calculateRevenueBreakdown(filteredTickets);

  return {
    revenue,
    ticketCount: filteredTickets.length,
  };
}

/**
 * Calculate today's metrics
 */
export function calculateTodayMetrics(tickets: Ticket[]): MetricsResult {
  return calculateMetricsForDateRange(tickets, getTodayRange());
}

/**
 * Calculate monthly metrics (last 30 days)
 */
export function calculateMonthlyMetrics(tickets: Ticket[]): MetricsResult {
  return calculateMetricsForDateRange(tickets, getLast30DaysRange());
}

/**
 * Calculate weekly metrics (last 7 days)
 */
export function calculateWeeklyMetrics(tickets: Ticket[]): MetricsResult {
  return calculateMetricsForDateRange(tickets, getLast7DaysRange());
}

/**
 * Calculate total metrics (all tickets)
 */
export function calculateTotalMetrics(tickets: Ticket[]): MetricsResult {
  return calculateMetricsForDateRange(tickets, null);
}

/**
 * Filter tickets by payment type
 */
export function filterTicketsByPaymentType(
  tickets: Ticket[],
  paymentType: 'all' | 'CASH' | 'BANK'
): Ticket[] {
  if (paymentType === 'all') {
    return tickets;
  }

  if (paymentType === 'CASH') {
    return tickets.filter(isCashPayment);
  }

  if (paymentType === 'BANK') {
    return tickets.filter(isBankPayment);
  }

  return tickets;
}

/**
 * Get data quality warnings for tickets
 */
export function getDataQualityWarnings(tickets: Ticket[]): {
  missingPaymentMode: number;
  hasWarnings: boolean;
} {
  const missingPaymentMode = tickets.filter(hasMissingPaymentMode).length;

  return {
    missingPaymentMode,
    hasWarnings: missingPaymentMode > 0,
  };
}

