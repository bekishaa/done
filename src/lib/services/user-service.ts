import { prisma } from '@/lib/db';
import { User, Role } from '@/lib/db-types';
import bcrypt from 'bcryptjs';

export interface CreateUserData {
  email: string;
  name: string;
  phone?: string;
  password: string;
  role: Role;
  branchId: string;
  ticketNumberStart?: number;
  ticketNumberEnd?: number;
}

export interface UpdateUserData {
  name?: string;
  phone?: string;
  password?: string;
  role?: Role;
  isActive?: boolean;
  ticketNumberStart?: number;
  ticketNumberEnd?: number;
  currentTicketNumber?: number;
}

export interface UserWithBranch extends User {
  // Note: Branch model doesn't exist in schema, so we'll just use User
}

export class UserService {
  /**
   * Create a new user
   */
  static async createUser(data: CreateUserData): Promise<UserWithBranch> {
    // Check if user already exists
    const existingUser = await prisma.user.findUnique({ email: data.email });

    if (existingUser) {
      throw new Error('User with this email already exists');
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(data.password, 10);

    const user = await prisma.user.create({
      name: data.name,
      email: data.email,
      password: hashedPassword,
      role: data.role,
      branchId: data.branchId,
      ticketNumberStart: data.ticketNumberStart,
      ticketNumberEnd: data.ticketNumberEnd,
      currentTicketNumber: data.ticketNumberStart,
      isActive: true,
      failedLoginAttempts: 0,
      isLocked: false,
      lockedAt: null,
    });

    return user;
  }

  /**
   * Get all users with optional filtering
   */
  static async getUsers(filters?: {
    branchId?: string;
    role?: Role;
    isActive?: boolean;
  }): Promise<UserWithBranch[]> {
    return await prisma.user.findMany({
      branchId: filters?.branchId,
      role: filters?.role,
      isActive: filters?.isActive,
    });
  }

  /**
   * Get user by ID
   */
  static async getUserById(id: string): Promise<UserWithBranch | null> {
    return await prisma.user.findUnique({ id });
  }

  /**
   * Get user by email
   */
  static async getUserByEmail(email: string): Promise<UserWithBranch | null> {
    return await prisma.user.findUnique({ email });
  }

  /**
   * Update user
   */
  static async updateUser(id: string, data: UpdateUserData): Promise<UserWithBranch> {
    const updateData: any = { ...data };

    // Hash password if provided
    if (data.password) {
      updateData.password = await bcrypt.hash(data.password, 10);
    }

    return await prisma.user.update({ id }, updateData);
  }

  /**
   * Delete user
   */
  static async deleteUser(id: string): Promise<void> {
    await prisma.user.delete({ id });
  }

  /**
   * Verify user password
   */
  static async verifyPassword(email: string, password: string): Promise<UserWithBranch | null> {
    try {
      const user = await this.getUserByEmail(email);
      
      if (!user) {
        console.log(`[Auth] User not found: ${email}`);
        return null;
      }

      if (!user.isActive) {
        console.log(`[Auth] User is inactive: ${email}`);
        return null;
      }

      if (!user.password) {
        console.log(`[Auth] User has no password set: ${email}`);
        return null;
      }

      const isValid = await bcrypt.compare(password, user.password);
      
      if (!isValid) {
        console.log(`[Auth] Password mismatch for user: ${email}`);
        return null;
      }

      console.log(`[Auth] Login successful for user: ${email}`);
      return user;
    } catch (error) {
      console.error(`[Auth] Error verifying password for ${email}:`, error);
      return null;
    }
  }

  /**
   * Update user ticket number range
   */
  static async updateTicketRange(
    id: string,
    ticketNumberStart: number,
    ticketNumberEnd: number
  ): Promise<UserWithBranch> {
    return await prisma.user.update({ id }, {
      ticketNumberStart,
      ticketNumberEnd,
      currentTicketNumber: ticketNumberStart,
    });
  }

  /**
   * Get users by role
   */
  static async getUsersByRole(role: Role, branchId?: string): Promise<UserWithBranch[]> {
    return await prisma.user.findMany({
      role,
      isActive: true,
      branchId,
    });
  }

  /**
   * Get user statistics
   */
  static async getUserStats(branchId?: string) {
    const totalUsers = await prisma.user.count({ branchId });
    const activeUsers = await prisma.user.count({ branchId, isActive: true });

    return {
      totalUsers,
      activeUsers,
      inactiveUsers: totalUsers - activeUsers,
      usersByRole: {} as Record<Role, number>, // Would need raw SQL for groupBy
    };
  }
}
