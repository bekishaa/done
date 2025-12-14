// MySQL database connection using mysql2 (replaces Prisma)

import mysql from 'mysql2/promise';
import type { Pool, PoolConnection } from 'mysql2/promise';
import type {
  User,
  Customer,
  Ticket,
  CustomerHistory,
} from './db-types';
import {
  Role,
  Sex,
  TicketStatus,
  AuditStatus,
  PaymentMode,
} from './db-types';

let pool: Pool | null = null;

function createPool(): Pool {
  const dbUrl = process.env.DATABASE_URL;
  if (!dbUrl) {
    throw new Error(
      'DATABASE_URL is not set. Add mysql://user:password@host:port/database to your .env/.env.local'
    );
  }

  if (!dbUrl.trim().toLowerCase().startsWith('mysql://')) {
    throw new Error(
      `DATABASE_URL must start with "mysql://". Current value starts with "${dbUrl.slice(0, 20)}". Update your .env file to point to a valid MySQL URI.`
    );
  }

  // Parse MySQL connection string: mysql://user:password@host:port/database
  const url = new URL(dbUrl);
  const config = {
    host: url.hostname,
    port: parseInt(url.port) || 3306,
    user: decodeURIComponent(url.username),
    password: decodeURIComponent(url.password),
    database: url.pathname.slice(1), // Remove leading '/'
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
    enableKeepAlive: true,
    keepAliveInitialDelay: 0,
  };

  return mysql.createPool(config);
}

function getPool(): Pool {
  if (!pool) {
    pool = createPool();
  }
  return pool;
}

// Helper to convert MySQL rows to typed objects
function mapRow<T>(row: any): T {
  if (!row || typeof row !== 'object' || row === null) {
    return row as T;
  }
  
  // Convert date strings to Date objects
  try {
    // Safely create a copy of the row object
    const result: any = {};
    
    // Safely get keys - check if Object.keys can be called
    let keys: string[] = [];
    try {
      keys = Object.keys(row);
    } catch (keysError) {
      console.error('[mapRow] Error getting keys from row:', keysError, 'Row type:', typeof row, 'Row:', row);
      // Return row as-is if we can't get keys
      return row as T;
    }
    
    for (const key of keys) {
      try {
        const value = row[key];
        
        // Skip null/undefined values
        if (value === null || value === undefined) {
          result[key] = null;
          continue;
        }
        
        // Handle Date objects
        if (value instanceof Date) {
          result[key] = value;
        } 
        // Handle date strings
        else if (typeof value === 'string' && /^\d{4}-\d{2}-\d{2}/.test(value)) {
          const date = new Date(value);
      if (!isNaN(date.getTime())) {
        result[key] = date;
          } else {
            result[key] = value;
      }
    }
        // Handle other values
        else {
          result[key] = value;
        }
      } catch (keyError) {
        console.warn(`[mapRow] Error processing key ${key}:`, keyError);
        result[key] = null;
      }
    }
    
  return result as T;
  } catch (error) {
    console.error('[mapRow] Error mapping row:', error, 'Row:', row);
    // Return a safe fallback
    return row as T;
  }
}

function mapRows<T>(rows: any[]): T[] {
  return rows.map(mapRow<T>);
}

// Database operations
export const db = {
  // User operations
  user: {
    async findUnique(args: { where: { id?: string; email?: string; name?: string } } | { id?: string; email?: string; name?: string }): Promise<User | null> {
      const pool = getPool();
      let query = 'SELECT * FROM `User` WHERE ';
      const conditions: string[] = [];
      const values: any[] = [];

      // Handle Prisma-style API: { where: { email: ... } } or direct: { email: ... }
      const where = 'where' in args ? args.where : args;

      if (where.id) {
        conditions.push('`id` = ?');
        values.push(where.id);
      } else if (where.email) {
        conditions.push('`email` = ?');
        values.push(where.email);
      } else if (where.name) {
        conditions.push('`name` = ?');
        values.push(where.name);
      } else {
        throw new Error('findUnique requires id, email, or name');
      }

      query += conditions.join(' AND ');
      const [rows] = await pool.execute(query, values);
      const result = Array.isArray(rows) ? rows : [];
      return result.length > 0 ? mapRow<User>(result[0]) : null;
    },

    async findFirst(args?: { where?: Partial<User> & { role?: Role } } | (Partial<User> & { role?: Role })): Promise<User | null> {
      const pool = getPool();
      let query = 'SELECT * FROM `User` WHERE 1=1';
      const values: any[] = [];

      // Handle Prisma-style API: { where: { ... } } or direct: { ... }
      const where = args && 'where' in args ? args.where : args;

      if (where) {
      if (where.id) {
        query += ' AND `id` = ?';
        values.push(where.id);
      }
      if (where.email) {
        query += ' AND `email` = ?';
        values.push(where.email);
      }
      if (where.name) {
        query += ' AND `name` = ?';
        values.push(where.name);
      }
      if (where.role) {
        query += ' AND `role` = ?';
        values.push(where.role);
      }
      if (where.branchId) {
        query += ' AND `branchId` = ?';
        values.push(where.branchId);
      }
      if (where.isActive !== undefined) {
        query += ' AND `isActive` = ?';
        values.push(where.isActive ? 1 : 0);
        }
      }

      query += ' LIMIT 1';
      const [rows] = await pool.execute(query, values);
      const result = Array.isArray(rows) ? rows : [];
      return result.length > 0 ? mapRow<User>(result[0]) : null;
    },

    async findMany(where?: Partial<User> & { role?: Role; isActive?: boolean }): Promise<User[]> {
      const pool = getPool();
      let query = 'SELECT * FROM `User` WHERE 1=1';
      const values: any[] = [];

      if (where) {
        if (where.id) {
          query += ' AND `id` = ?';
          values.push(where.id);
        }
        if (where.email) {
          query += ' AND `email` = ?';
          values.push(where.email);
        }
        if (where.name) {
          query += ' AND `name` = ?';
          values.push(where.name);
        }
        if (where.role) {
          query += ' AND `role` = ?';
          values.push(where.role);
        }
        if (where.branchId) {
          query += ' AND `branchId` = ?';
          values.push(where.branchId);
        }
        if (where.isActive !== undefined) {
          query += ' AND `isActive` = ?';
          values.push(where.isActive ? 1 : 0);
        }
      }

      query += ' ORDER BY `createdAt` DESC';
      const [rows] = await pool.execute(query, values);
      return mapRows<User>(Array.isArray(rows) ? rows : []);
    },

    async create(data: Omit<User, 'id' | 'createdAt' | 'updatedAt'>): Promise<User> {
      const pool = getPool();
      const id = `cuid_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      const now = new Date();

      const query = `
        INSERT INTO \`User\` (
          \`id\`, \`name\`, \`email\`, \`password\`, \`role\`, \`branchId\`,
          \`ticketNumberStart\`, \`ticketNumberEnd\`, \`currentTicketNumber\`,
          \`isActive\`, \`failedLoginAttempts\`, \`isLocked\`, \`lockedAt\`,
          \`createdAt\`, \`updatedAt\`
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `;

      const values = [
        id,
        data.name,
        data.email,
        data.password,
        data.role,
        data.branchId,
        data.ticketNumberStart,
        data.ticketNumberEnd,
        data.currentTicketNumber,
        data.isActive ? 1 : 0,
        data.failedLoginAttempts,
        data.isLocked ? 1 : 0,
        data.lockedAt,
        now,
        now,
      ];

      await pool.execute(query, values);
      return this.findUnique({ id }) as Promise<User>;
    },

    async update(args: { where: { id: string }; data: Partial<User> } | { id: string; data?: Partial<User> } | { where: { id: string } }, data?: Partial<User>): Promise<User> {
      const pool = getPool();
      const updates: string[] = [];
      const values: any[] = [];

      // Handle Prisma-style API: { where: { id: ... }, data: {...} } 
      // or old-style: ({ id: ... }, data) or ({ where: { id: ... } }, data)
      let userId: string;
      let updateData: Partial<User>;

      if ('data' in args && args.data !== undefined) {
        // Prisma-style: { where: { id: ... }, data: {...} } or { id: ..., data: {...} }
        updateData = args.data;
        if ('where' in args) {
          userId = args.where.id;
        } else {
          userId = args.id;
        }
      } else if (data !== undefined) {
        // Old-style two-argument: (args, data)
        updateData = data;
        if ('where' in args) {
          userId = args.where.id;
        } else {
          userId = args.id;
        }
      } else {
        // No data provided, just return the user
        if ('where' in args) {
          userId = args.where.id;
        } else {
          userId = args.id;
        }
        return this.findUnique({ id: userId }) as Promise<User>;
      }

      Object.entries(updateData).forEach(([key, value]) => {
        if (key === 'id') return;
        if (value === undefined) return;
        updates.push(`\`${key}\` = ?`);
        if (key === 'isActive' || key === 'isLocked') {
          values.push(value ? 1 : 0);
        } else {
          values.push(value);
        }
      });

      if (updates.length === 0) {
        return this.findUnique({ id: userId }) as Promise<User>;
      }

      updates.push('`updatedAt` = ?');
      values.push(new Date());
      values.push(userId);

      const query = `UPDATE \`User\` SET ${updates.join(', ')} WHERE \`id\` = ?`;
      await pool.execute(query, values);
      return this.findUnique({ id: userId }) as Promise<User>;
    },

    async delete(args: { where: { id: string } } | { id: string }): Promise<void> {
      const pool = getPool();
      // Handle Prisma-style API: { where: { id: ... } } or direct: { id: ... }
      const where = 'where' in args ? args.where : args;
      await pool.execute('DELETE FROM `User` WHERE `id` = ?', [where.id]);
    },

    async count(where?: Partial<User> & { role?: Role }): Promise<number> {
      const pool = getPool();
      let query = 'SELECT COUNT(*) as count FROM `User` WHERE 1=1';
      const values: any[] = [];

      if (where) {
        if (where.id) {
          query += ' AND `id` = ?';
          values.push(where.id);
        }
        if (where.role) {
          query += ' AND `role` = ?';
          values.push(where.role);
        }
        if (where.branchId) {
          query += ' AND `branchId` = ?';
          values.push(where.branchId);
        }
        if (where.isActive !== undefined) {
          query += ' AND `isActive` = ?';
          values.push(where.isActive ? 1 : 0);
        }
      }

      const [rows] = await pool.execute(query, values);
      const result = Array.isArray(rows) ? rows : [];
      return result[0]?.count || 0;
    },
  },

  // Customer operations
  customer: {
    async findUnique(args: { where: { id?: string; phoneNumber?: string; payersIdentification?: string } } | { id?: string; phoneNumber?: string; payersIdentification?: string }): Promise<Customer | null> {
      const pool = getPool();
      let query = 'SELECT * FROM `Customer` WHERE ';
      const conditions: string[] = [];
      const values: any[] = [];

      // Handle Prisma-style API: { where: { phoneNumber: ... } } or direct: { phoneNumber: ... }
      const where = 'where' in args ? args.where : args;

      if (where.id) {
        conditions.push('`id` = ?');
        values.push(where.id);
      } else if (where.phoneNumber) {
        conditions.push('`phoneNumber` = ?');
        values.push(where.phoneNumber);
      } else if (where.payersIdentification) {
        conditions.push('`payersIdentification` = ?');
        values.push(where.payersIdentification);
      } else {
        throw new Error('findUnique requires id, phoneNumber, or payersIdentification');
      }

      query += conditions.join(' AND ');
      const [rows] = await pool.execute(query, values);
      const result = Array.isArray(rows) ? rows : [];
      return result.length > 0 ? mapRow<Customer>(result[0]) : null;
    },

    async findFirst(where?: Partial<Customer>): Promise<Customer | null> {
      const pool = getPool();
      let query = 'SELECT * FROM `Customer` WHERE 1=1';
      const values: any[] = [];

      if (where) {
        if (where.phoneNumber) {
          query += ' AND `phoneNumber` = ?';
          values.push(where.phoneNumber);
        }
        if (where.payersIdentification) {
          query += ' AND `payersIdentification` = ?';
          values.push(where.payersIdentification);
        }
        if (where.isActive !== undefined) {
          query += ' AND `isActive` = ?';
          values.push(where.isActive ? 1 : 0);
        }
      }

      query += ' LIMIT 1';
      const [rows] = await pool.execute(query, values);
      const result = Array.isArray(rows) ? rows : [];
      return result.length > 0 ? mapRow<Customer>(result[0]) : null;
    },

    async findMany(where?: Partial<Customer> & { search?: string }): Promise<Customer[]> {
      const pool = getPool();
      let query = 'SELECT * FROM `Customer` WHERE 1=1';
      const values: any[] = [];

      if (where) {
        if (where.phoneNumber) {
          query += ' AND `phoneNumber` = ?';
          values.push(where.phoneNumber);
        }
        if (where.payersIdentification) {
          query += ' AND `payersIdentification` = ?';
          values.push(where.payersIdentification);
        }
        if (where.isActive !== undefined) {
          query += ' AND `isActive` = ?';
          values.push(where.isActive ? 1 : 0);
        }
        if (where.search) {
          query += ' AND (`fullName` LIKE ? OR `phoneNumber` LIKE ? OR `payersIdentification` LIKE ?)';
          const searchTerm = `%${where.search}%`;
          values.push(searchTerm, searchTerm, searchTerm);
        }
      }

      query += ' ORDER BY `createdAt` DESC';
      const [rows] = await pool.execute(query, values);
      return mapRows<Customer>(Array.isArray(rows) ? rows : []);
    },

    async create(data: Omit<Customer, 'id' | 'createdAt'>): Promise<Customer> {
      const pool = getPool();
      const id = `cuid_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      const now = new Date();

      const query = `
        INSERT INTO \`Customer\` (
          \`id\`, \`fullName\`, \`sex\`, \`phoneNumber\`, \`address\`,
          \`payersIdentification\`, \`savingType\`, \`loanType\`,
          \`registrationDate\`, \`isActive\`, \`createdAt\`, \`registeredBy\`
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `;

      const values = [
        id,
        data.fullName,
        data.sex,
        data.phoneNumber,
        data.address,
        data.payersIdentification,
        data.savingType,
        data.loanType,
        data.registrationDate,
        data.isActive ? 1 : 0,
        now,
        data.registeredBy,
      ];

      await pool.execute(query, values);
      return this.findUnique({ id }) as Promise<Customer>;
    },

    async update(where: { id: string }, data: Partial<Customer>): Promise<Customer> {
      const pool = getPool();
      const updates: string[] = [];
      const values: any[] = [];

      Object.entries(data).forEach(([key, value]) => {
        if (key === 'id') return;
        if (value === undefined) return;
        updates.push(`\`${key}\` = ?`);
        if (key === 'isActive') {
          values.push(value ? 1 : 0);
        } else {
          values.push(value);
        }
      });

      if (updates.length === 0) {
        return this.findUnique({ id: where.id }) as Promise<Customer>;
      }

      values.push(where.id);
      const query = `UPDATE \`Customer\` SET ${updates.join(', ')} WHERE \`id\` = ?`;
      await pool.execute(query, values);
      return this.findUnique({ id: where.id }) as Promise<Customer>;
    },

    async count(where?: Partial<Customer> & { isActive?: boolean }): Promise<number> {
      const pool = getPool();
      let query = 'SELECT COUNT(*) as count FROM `Customer` WHERE 1=1';
      const values: any[] = [];

      if (where) {
        if (where.isActive !== undefined) {
          query += ' AND `isActive` = ?';
          values.push(where.isActive ? 1 : 0);
        }
      }

      const [rows] = await pool.execute(query, values);
      const result = Array.isArray(rows) ? rows : [];
      return result[0]?.count || 0;
    },
  },

  // Ticket operations
  ticket: {
    async findUnique(where: { id: string }): Promise<Ticket | null> {
      const pool = getPool();
      const [rows] = await pool.execute('SELECT * FROM `Ticket` WHERE `id` = ?', [where.id]);
      const result = Array.isArray(rows) ? rows : [];
      return result.length > 0 ? mapRow<Ticket>(result[0]) : null;
    },

    async findMany(where?: Partial<Ticket> & { auditStatus?: AuditStatus; status?: TicketStatus }): Promise<Ticket[]> {
      const pool = getPool();
      let query = 'SELECT * FROM `Ticket` WHERE 1=1';
      const values: any[] = [];

      if (where) {
        if (where.id) {
          query += ' AND `id` = ?';
          values.push(where.id);
        }
        if (where.preparedBy) {
          query += ' AND `preparedBy` = ?';
          values.push(where.preparedBy);
        }
        if (where.customerPhone) {
          query += ' AND `customerPhone` = ?';
          values.push(where.customerPhone);
        }
        if (where.status) {
          query += ' AND `status` = ?';
          values.push(where.status);
        }
        if (where.auditStatus) {
          query += ' AND `auditStatus` = ?';
          values.push(where.auditStatus);
        }
        if (where.auditStatus === undefined) {
          // Exclude voided by default
          query += ' AND `auditStatus` != ?';
          values.push(AuditStatus.VOIDED);
        }
      } else {
        // Exclude voided by default
        query += ' AND `auditStatus` != ?';
        values.push(AuditStatus.VOIDED);
      }

      query += ' ORDER BY `createdAt` DESC';
      const [rows] = await pool.execute(query, values);
      return mapRows<Ticket>(Array.isArray(rows) ? rows : []);
    },

    async create(args: { data: Omit<Ticket, 'id' | 'createdAt'> } | Omit<Ticket, 'id' | 'createdAt'>): Promise<Ticket> {
      const pool = getPool();
      const id = `cuid_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      const now = new Date();

      // Validate args is not null/undefined
      if (!args || typeof args !== 'object') {
        throw new Error('Ticket create: args must be an object');
      }

      // Handle Prisma-style API: { data: { ... } } or direct: { ... }
      let data: Omit<Ticket, 'id' | 'createdAt'>;
      if ('data' in args && args.data) {
        data = args.data;
      } else {
        data = args as Omit<Ticket, 'id' | 'createdAt'>;
      }
      
      // Validate data is not null/undefined
      if (!data || typeof data !== 'object') {
        throw new Error('Ticket create: data must be an object');
      }

      // Helper function to convert undefined to null for MySQL
      const toNull = (value: any) => {
        if (value === undefined) return null;
        return value;
      };

      // Sanitize all data fields to ensure no undefined values
      const sanitizedData = {
        customerName: data.customerName ?? null,
        customerPhone: toNull(data.customerPhone),
        paymentAmount: data.paymentAmount ?? 0,
        status: data.status ?? null,
        date: data.date ?? null,
        reasonForPayment: toNull(data.reasonForPayment),
        preparedBy: data.preparedBy ?? null,
        ticketNumber: data.ticketNumber ?? null,
        modeOfPayment: toNull(data.modeOfPayment),
        bankReceiptNo: toNull(data.bankReceiptNo),
        htmlContent: toNull(data.htmlContent),
        auditStatus: data.auditStatus ?? null,
        auditedBy: toNull(data.auditedBy),
        auditedAt: toNull(data.auditedAt),
        auditNote: toNull(data.auditNote),
      };

      const query = `
        INSERT INTO \`Ticket\` (
          \`id\`, \`customerName\`, \`customerPhone\`, \`paymentAmount\`,
          \`status\`, \`date\`, \`reasonForPayment\`, \`preparedBy\`,
          \`ticketNumber\`, \`modeOfPayment\`, \`bankReceiptNo\`, \`htmlContent\`,
          \`createdAt\`, \`auditStatus\`, \`auditedBy\`, \`auditedAt\`, \`auditNote\`
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `;

      const values = [
        id,
        sanitizedData.customerName,
        sanitizedData.customerPhone,
        sanitizedData.paymentAmount,
        sanitizedData.status,
        sanitizedData.date,
        sanitizedData.reasonForPayment,
        sanitizedData.preparedBy,
        sanitizedData.ticketNumber,
        sanitizedData.modeOfPayment,
        sanitizedData.bankReceiptNo,
        sanitizedData.htmlContent,
        now,
        sanitizedData.auditStatus,
        sanitizedData.auditedBy,
        sanitizedData.auditedAt,
        sanitizedData.auditNote,
      ];

      // Verify no undefined values before executing
      const hasUndefined = values.some(v => v === undefined);
      if (hasUndefined) {
        console.error('[Ticket Create] ERROR: Found undefined values!', values.map((v, i) => ({
          index: i,
          value: v,
          type: typeof v,
          isUndefined: v === undefined
        })));
        throw new Error('Cannot insert ticket: some required fields are undefined');
      }

      await pool.execute(query, values);
      const created = await this.findUnique({ id });
      if (!created) {
        throw new Error('Failed to retrieve created ticket from database');
      }
      return created;
    },

    async update(where: { id: string }, data: Partial<Ticket>): Promise<Ticket> {
      const pool = getPool();
      const updates: string[] = [];
      const values: any[] = [];

      Object.entries(data).forEach(([key, value]) => {
        if (key === 'id') return;
        if (value === undefined) return;
        updates.push(`\`${key}\` = ?`);
        values.push(value);
      });

      if (updates.length === 0) {
        return this.findUnique({ id: where.id }) as Promise<Ticket>;
      }

      values.push(where.id);
      const query = `UPDATE \`Ticket\` SET ${updates.join(', ')} WHERE \`id\` = ?`;
      await pool.execute(query, values);
      return this.findUnique({ id: where.id }) as Promise<Ticket>;
    },

    async count(where?: Partial<Ticket> & { status?: TicketStatus; auditStatus?: AuditStatus }): Promise<number> {
      const pool = getPool();
      let query = 'SELECT COUNT(*) as count FROM `Ticket` WHERE 1=1';
      const values: any[] = [];

      if (where) {
        if (where.status) {
          query += ' AND `status` = ?';
          values.push(where.status);
        }
        if (where.auditStatus) {
          query += ' AND `auditStatus` = ?';
          values.push(where.auditStatus);
        }
      }

      const [rows] = await pool.execute(query, values);
      const result = Array.isArray(rows) ? rows : [];
      return result[0]?.count || 0;
    },

    async aggregate(where?: Partial<Ticket>): Promise<{ _sum: { paymentAmount: number | null } }> {
      const pool = getPool();
      let query = 'SELECT SUM(`paymentAmount`) as sum FROM `Ticket` WHERE 1=1';
      const values: any[] = [];

      if (where) {
        if (where.status) {
          query += ' AND `status` = ?';
          values.push(where.status);
        }
        if (where.auditStatus) {
          query += ' AND `auditStatus` = ?';
          values.push(where.auditStatus);
        }
      }

      const [rows] = await pool.execute(query, values);
      const result = Array.isArray(rows) ? rows : [];
      return {
        _sum: {
          paymentAmount: result[0]?.sum || null,
        },
      };
    },
  },

  // CustomerHistory operations
  customerHistory: {
    async create(data: Omit<CustomerHistory, 'id' | 'createdAt'>): Promise<CustomerHistory> {
      const pool = getPool();
      const id = `cuid_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      const now = new Date();

      const query = `
        INSERT INTO \`CustomerHistory\` (
          \`id\`, \`eventType\`, \`amount\`, \`ticketNumber\`, \`date\`,
          \`preparedBy\`, \`reasonForPayment\`, \`customerId\`, \`createdAt\`
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
      `;

      const values = [
        id,
        data.eventType,
        data.amount,
        data.ticketNumber,
        data.date,
        data.preparedBy,
        data.reasonForPayment,
        data.customerId,
        now,
      ];

      await pool.execute(query, values);
      const [rows] = await pool.execute('SELECT * FROM `CustomerHistory` WHERE `id` = ?', [id]);
      const result = Array.isArray(rows) ? rows : [];
      return mapRow<CustomerHistory>(result[0]);
    },
  },
};

// Connection management
export async function ensureConnection(): Promise<boolean> {
  try {
    const pool = getPool();
    const connection = await pool.getConnection();
    await connection.execute('SELECT 1');
    connection.release();
    return true;
  } catch (error) {
    console.error('[DB] Connection check failed:', error);
    return false;
  }
}

export async function runWithDbRetry<T>(
  operation: (db: typeof db) => Promise<T>,
  attempts = 3
): Promise<T> {
  let lastError: unknown;
  for (let i = 1; i <= attempts; i++) {
    try {
      await ensureConnection();
      return await operation(db);
    } catch (error) {
      lastError = error;
      const message = error instanceof Error ? error.message : String(error);
      if (message.includes('closed the connection') || message.includes('Connection')) {
        console.warn(`[DB] Operation failed due to connection issue (attempt ${i}/${attempts}). Retrying...`);
        await new Promise((resolve) => setTimeout(resolve, 250 * i));
        continue;
      }
      break;
    }
  }
  throw lastError instanceof Error ? lastError : new Error(String(lastError));
}

// Export db as default for compatibility
export default db;

