// MySQL database layer (replaces Prisma)
// This file provides a Prisma-like API using mysql2

import db, { ensureConnection, runWithDbRetry } from './db-mysql';
import type { User, Customer, Ticket, CustomerHistory } from './db-types';

// Export db as prisma for compatibility with existing code
export const prisma = db;

// Re-export connection helpers
export { ensureConnection, runWithDbRetry };

// Export types for convenience
export type { User, Customer, Ticket, CustomerHistory };


