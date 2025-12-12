import { prisma } from '@/lib/db';
import { Customer, Sex } from '@/lib/db-types';

export interface CreateCustomerData {
  fullName: string;
  sex: Sex;
  phoneNumber: string;
  address: string;
  payersIdentification: string;
  savingType?: string;
  loanType?: string;
  branchId: string;
}

export interface UpdateCustomerData {
  fullName?: string;
  sex?: Sex;
  phoneNumber?: string;
  address?: string;
  payersIdentification?: string;
  savingType?: string;
  loanType?: string;
  isActive?: boolean;
}

export interface CustomerWithBranch extends Customer {
  branch: {
    id: string;
    name: string;
  };
  _count?: {
    tickets: number;
  };
}

export class CustomerService {
  /**
   * Create a new customer
   */
  static async createCustomer(data: CreateCustomerData): Promise<CustomerWithBranch> {
    // Check if customer already exists
    const existingByPayerId = await prisma.customer.findFirst({
      payersIdentification: data.payersIdentification,
    });
    const existingByPhone = await prisma.customer.findUnique({
      phoneNumber: data.phoneNumber,
    });

    if (existingByPayerId) {
      throw new Error('Customer with this identification already exists');
    }

    if (existingByPhone) {
      throw new Error('Customer with this phone number already exists');
    }

    const customer = await prisma.customer.create({
      fullName: data.fullName,
      sex: data.sex,
      phoneNumber: data.phoneNumber,
      address: data.address,
      payersIdentification: data.payersIdentification,
      savingType: data.savingType || '',
      loanType: data.loanType || '',
      registrationDate: new Date().toISOString().split('T')[0],
      isActive: true,
      registeredBy: data.branchId, // Using branchId as registeredBy
    });

    // Return in CustomerWithBranch format
    return {
      ...customer,
      branch: { id: data.branchId, name: data.branchId }, // Simplified
      _count: { tickets: 0 },
    };
  }

  /**
   * Get all customers with optional filtering
   */
  static async getCustomers(filters?: {
    branchId?: string;
    sex?: Sex;
    isActive?: boolean;
    search?: string;
  }): Promise<CustomerWithBranch[]> {
    const customers = await prisma.customer.findMany({
      branchId: filters?.branchId,
      sex: filters?.sex,
      isActive: filters?.isActive,
      search: filters?.search,
    });

    // Map to CustomerWithBranch format (simplified - no branch relation in schema)
    return customers.map(c => ({
      ...c,
      branch: { id: c.registeredBy, name: c.registeredBy }, // Simplified
      _count: { tickets: 0 }, // Would need separate query to count
    }));
  }

  /**
   * Get customer by ID
   */
  static async getCustomerById(id: string): Promise<CustomerWithBranch | null> {
    const customer = await prisma.customer.findUnique({ id });
    if (!customer) return null;

    return {
      ...customer,
      branch: { id: customer.registeredBy, name: customer.registeredBy },
      _count: { tickets: 0 }, // Would need separate query
    };
  }

  /**
   * Get customer by identification
   */
  static async getCustomerByIdentification(identification: string): Promise<CustomerWithBranch | null> {
    const customer = await prisma.customer.findUnique({ payersIdentification: identification });
    if (!customer) return null;

    return {
      ...customer,
      branch: { id: customer.registeredBy, name: customer.registeredBy },
      _count: { tickets: 0 },
    };
  }

  /**
   * Update customer
   */
  static async updateCustomer(id: string, data: UpdateCustomerData): Promise<CustomerWithBranch> {
    const customer = await prisma.customer.update({ id }, data);
    return {
      ...customer,
      branch: { id: customer.registeredBy, name: customer.registeredBy },
      _count: { tickets: 0 },
    };
  }

  /**
   * Delete customer (soft delete by setting isActive to false)
   */
  static async deleteCustomer(id: string): Promise<CustomerWithBranch> {
    const customer = await prisma.customer.update({ id }, { isActive: false });
    return {
      ...customer,
      branch: { id: customer.registeredBy, name: customer.registeredBy },
      _count: { tickets: 0 },
    };
  }

  /**
   * Search customers
   */
  static async searchCustomers(query: string, branchId?: string): Promise<CustomerWithBranch[]> {
    const customers = await prisma.customer.findMany({
      isActive: true,
      search: query,
    });

    return customers.slice(0, 20).map(c => ({
      ...c,
      branch: { id: c.registeredBy, name: c.registeredBy },
      _count: { tickets: 0 },
    }));
  }

  /**
   * Get customer statistics
   */
  static async getCustomerStats(branchId?: string) {
    const totalCustomers = await prisma.customer.count();
    const activeCustomers = await prisma.customer.count({ isActive: true });

    // Simplified stats - would need raw SQL for groupBy
    return {
      totalCustomers,
      activeCustomers,
      inactiveCustomers: totalCustomers - activeCustomers,
      customersBySex: {} as Record<Sex, number>, // Would need raw SQL
      customersByBranch: 0,
    };
  }

  /**
   * Get customers with recent activity
   */
  static async getCustomersWithRecentActivity(branchId?: string, days: number = 30): Promise<CustomerWithBranch[]> {
    // Simplified - would need JOIN query for tickets
    const customers = await prisma.customer.findMany({ isActive: true });
    return customers.map(c => ({
      ...c,
      branch: { id: c.registeredBy, name: c.registeredBy },
      _count: { tickets: 0 },
    }));
  }
}
