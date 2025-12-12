/**
 * Centralized date utility functions for consistent date handling across the application
 */

export interface DateRange {
  start: Date;
  end: Date;
}

/**
 * Get the start and end of today
 */
export function getTodayRange(): DateRange {
  const now = new Date();
  const start = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const end = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59, 999);
  return { start, end };
}

/**
 * Get the date range for last N days (including today)
 */
export function getLastNDaysRange(days: number): DateRange {
  const now = new Date();
  const start = new Date(now.getFullYear(), now.getMonth(), now.getDate() - (days - 1));
  const end = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59, 999);
  return { start, end };
}

/**
 * Get the date range for last 7 days (including today)
 */
export function getLast7DaysRange(): DateRange {
  return getLastNDaysRange(7);
}

/**
 * Get the date range for last 30 days (including today)
 */
export function getLast30DaysRange(): DateRange {
  return getLastNDaysRange(30);
}

/**
 * Get the date range for this month (from start of month to today)
 */
export function getThisMonthRange(): DateRange {
  const now = new Date();
  const start = new Date(now.getFullYear(), now.getMonth(), 1);
  const end = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59, 999);
  return { start, end };
}

/**
 * Get the date range for last 1 day (yesterday + today)
 */
export function getLast1DayRange(): DateRange {
  return getLastNDaysRange(2);
}

/**
 * Check if a date falls within a date range
 */
export function isDateInRange(date: Date, range: DateRange): boolean {
  return date >= range.start && date <= range.end;
}

/**
 * Get ticket date from ticket object (handles both createdAt and date fields)
 */
export function getTicketDate(ticket: any): Date {
  if (ticket.createdAt) {
    return new Date(ticket.createdAt);
  }
  if (ticket.date) {
    // If date is already a Date object, return it
    if (ticket.date instanceof Date) {
      return ticket.date;
    }
    // If date is a string, try to parse it
    const parsed = new Date(ticket.date);
    if (!isNaN(parsed.getTime())) {
      return parsed;
    }
  }
  // Fallback to current date if no valid date found
  return new Date();
}

/**
 * Get today's date as a formatted string (for backward compatibility)
 */
export function getTodayDateString(): string {
  return new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

/**
 * Format date for display
 */
export function formatDateForDisplay(date: Date): string {
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

/**
 * Format date for short display (e.g., "Jan 15")
 */
export function formatDateShort(date: Date): string {
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
  });
}

/**
 * Get date range based on filter string
 */
export function getDateRangeFromFilter(filter: string): DateRange | null {
  switch (filter) {
    case 'today':
      return getTodayRange();
    case '1day':
      return getLast1DayRange();
    case 'week':
    case '7days':
      return getLast7DaysRange();
    case '30days':
      return getLast30DaysRange();
    case 'month':
    case 'thisMonth':
      return getThisMonthRange();
    case 'all':
      return null; // No date filtering
    default:
      return null;
  }
}

