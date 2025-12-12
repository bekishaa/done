import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import {
  getTodayRange,
  getLast7DaysRange,
  getLast30DaysRange,
  getThisMonthRange,
  getLast1DayRange,
  isDateInRange,
  getTicketDate,
  getDateRangeFromFilter,
} from '../date-utils';

describe('date-utils', () => {
  beforeEach(() => {
    // Mock current date to 2024-01-15 12:00:00
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2024-01-15T12:00:00.000Z'));
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  describe('getTodayRange', () => {
    it('should return start and end of today', () => {
      const range = getTodayRange();
      expect(range.start.getHours()).toBe(0);
      expect(range.start.getMinutes()).toBe(0);
      expect(range.start.getSeconds()).toBe(0);
      expect(range.end.getHours()).toBe(23);
      expect(range.end.getMinutes()).toBe(59);
      expect(range.end.getSeconds()).toBe(59);
    });
  });

  describe('getLast7DaysRange', () => {
    it('should return range for last 7 days including today', () => {
      const range = getLast7DaysRange();
      const daysDiff = Math.ceil((range.end.getTime() - range.start.getTime()) / (1000 * 60 * 60 * 24));
      expect(daysDiff).toBe(6); // 7 days = 6 day differences
    });
  });

  describe('getLast30DaysRange', () => {
    it('should return range for last 30 days including today', () => {
      const range = getLast30DaysRange();
      const daysDiff = Math.ceil((range.end.getTime() - range.start.getTime()) / (1000 * 60 * 60 * 24));
      expect(daysDiff).toBe(29); // 30 days = 29 day differences
    });
  });

  describe('isDateInRange', () => {
    it('should return true if date is within range', () => {
      const range = getTodayRange();
      const date = new Date('2024-01-15T12:00:00.000Z');
      expect(isDateInRange(date, range)).toBe(true);
    });

    it('should return false if date is before range', () => {
      const range = getTodayRange();
      const date = new Date('2024-01-14T12:00:00.000Z');
      expect(isDateInRange(date, range)).toBe(false);
    });

    it('should return false if date is after range', () => {
      const range = getTodayRange();
      const date = new Date('2024-01-16T12:00:00.000Z');
      expect(isDateInRange(date, range)).toBe(false);
    });
  });

  describe('getTicketDate', () => {
    it('should return createdAt date if available', () => {
      const ticket = {
        id: '1',
        createdAt: new Date('2024-01-15T12:00:00.000Z'),
      };
      const date = getTicketDate(ticket);
      expect(date.getTime()).toBe(new Date('2024-01-15T12:00:00.000Z').getTime());
    });

    it('should return date field if createdAt is not available', () => {
      const ticket = {
        id: '1',
        date: new Date('2024-01-15T12:00:00.000Z'),
      };
      const date = getTicketDate(ticket);
      expect(date.getTime()).toBe(new Date('2024-01-15T12:00:00.000Z').getTime());
    });

    it('should parse date string if date is a string', () => {
      const ticket = {
        id: '1',
        date: '2024-01-15T12:00:00.000Z',
      };
      const date = getTicketDate(ticket);
      expect(date.getTime()).toBe(new Date('2024-01-15T12:00:00.000Z').getTime());
    });

    it('should return current date if no date fields available', () => {
      const ticket = {
        id: '1',
      };
      const date = getTicketDate(ticket);
      expect(date).toBeInstanceOf(Date);
    });
  });

  describe('getDateRangeFromFilter', () => {
    it('should return today range for "today" filter', () => {
      const range = getDateRangeFromFilter('today');
      expect(range).not.toBeNull();
      expect(range?.start.getDate()).toBe(new Date().getDate());
    });

    it('should return last 7 days range for "week" filter', () => {
      const range = getDateRangeFromFilter('week');
      expect(range).not.toBeNull();
    });

    it('should return last 30 days range for "30days" filter', () => {
      const range = getDateRangeFromFilter('30days');
      expect(range).not.toBeNull();
    });

    it('should return null for "all" filter', () => {
      const range = getDateRangeFromFilter('all');
      expect(range).toBeNull();
    });

    it('should return null for unknown filter', () => {
      const range = getDateRangeFromFilter('unknown');
      expect(range).toBeNull();
    });
  });
});

