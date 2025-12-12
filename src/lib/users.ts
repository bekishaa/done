
import type { User, Role, Ticket, Customer, CustomerHistoryEntry } from "./types";

export const MOCK_PASSWORD = "password123";

// In-memory data stores
let users: User[] = [
    { id: '1', name: 'Super Admin', email: 'superadmin@test.com', password: MOCK_PASSWORD, role: 'superadmin', branchId: '1', isActive: true },
    { id: '2', name: 'Branch Admin', email: 'admin@test.com', password: MOCK_PASSWORD, role: 'admin', branchId: '2', isActive: true },
    { id: '3', name: 'Alice (Sales)', email: 'alice@test.com', password: MOCK_PASSWORD, role: 'sales', branchId: '2', ticketNumberStart: 1001, ticketNumberEnd: 2000, currentTicketNumber: 1001, isActive: true },
    { id: '4', name: 'Bob (Auditor)', email: 'auditor@test.com', password: MOCK_PASSWORD, role: 'auditor', branchId: '1', isActive: true },
    { id: '5', name: 'Charlie (Ops)', email: 'charlie@test.com', password: MOCK_PASSWORD, role: 'operation', branchId: '1', isActive: true },
    { id: '6', name: 'David (Sales)', email: 'dave@test.com', password: MOCK_PASSWORD, role: 'sales', branchId: '1', ticketNumberStart: 1, ticketNumberEnd: 1000, currentTicketNumber: 1, isActive: false },
    { id: '7', name: 'Eve (Sales)', email: 'eve@test.com', password: MOCK_PASSWORD, role: 'sales', branchId: '1', ticketNumberStart: -1, ticketNumberEnd: -1, currentTicketNumber: -1, isActive: true },
];

let tickets: Ticket[] = [];
let customers: Customer[] = [
    { id: '1', fullName: 'Abel Tesfaye', sex: 'Male', phoneNumber: '0911223344', payersIdentification: 'ID-ABEL-001', savingType: 'gihon Regular Saving Account', loanType: 'Tiguhan small business loan', registrationDate: 'September 1, 2023', createdAt: new Date('2023-09-01'), registeredBy: 'Alice (Sales)', history: [] },
    { id: '2', fullName: 'Aster Aweke', sex: 'Female', phoneNumber: '0955667788', payersIdentification: 'ID-ASTER-002', savingType: 'Michu Current Saving Account', loanType: "Mothers Loan", registrationDate: 'August 15, 2023', createdAt: new Date('2023-08-15'), registeredBy: 'David (Sales)', history: [] },
];

// --- User Management ---

export function getUsers(): User[] {
  return users;
}

export function getUser(id: string): User | undefined {
    return users.find(u => u.id === id);
}

export function getUserByEmail(email: string): User | undefined {
    return users.find(u => u.email.toLowerCase() === email.toLowerCase());
}

export function getUserByName(name: string): User | undefined {
    return users.find(u => u.name === name);
}

export function addUser(data: { email: string, name: string, role: Role, branchId: string, password?: string }): boolean {
    if (getUserByEmail(data.email)) {
        return false; // User already exists
    }
    const newUser: User = {
        id: String(users.length + 1),
        ...data,
        password: data.password || MOCK_PASSWORD,
        isActive: true,
    };
    if (newUser.role === 'sales') {
        newUser.ticketNumberStart = -1;
        newUser.ticketNumberEnd = -1;
        newUser.currentTicketNumber = -1;
    }
    users.push(newUser);
    return true;
}

export function updateUser(userId: string, data: Partial<Omit<User, 'id'>>): boolean {
    const userIndex = users.findIndex(u => u.id === userId);
    if (userIndex === -1) return false;
    
    users[userIndex] = { ...users[userIndex], ...data };
    return true;
}

export function deleteUser(userId: string): boolean {
    const initialLength = users.length;
    users = users.filter(u => u.id !== userId);
    return users.length < initialLength;
}

// --- Ticket Management ---

export function getTickets(): Ticket[] {
    // Return a sorted copy
    return [...tickets].sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
}

export function addTicket(ticketData: Omit<Ticket, 'id'>): Ticket {
    const newTicket: Ticket = {
        id: String(tickets.length + 1),
        ...ticketData,
    };
    tickets.push(newTicket);
    return newTicket;
}


// --- Customer Management ---

export function getCustomers(): Customer[] {
    return [...customers].sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
}

export function addCustomer(customerData: Omit<Customer, 'id' | 'createdAt'> & { createdAt: Date }) {
    if (customers.some(c => c.phoneNumber === customerData.phoneNumber)) {
        // Here you might want to update the customer instead of returning
        return; // Avoid duplicates
    }
    const newCustomer: Customer = {
        id: String(customers.length + 1),
        ...customerData,
        history: [],
    };
    customers.push(newCustomer);
}

// --- Customer History ---
export function appendCustomerHistoryByPhone(phoneNumber: string, entry: CustomerHistoryEntry): boolean {
    const customerIndex = customers.findIndex(c => c.phoneNumber === phoneNumber);
    if (customerIndex === -1) return false;
    const existing = customers[customerIndex].history ?? [];
    const updatedHistory = [
        { ...entry },
        ...existing,
    ];
    customers[customerIndex] = {
        ...customers[customerIndex],
        history: updatedHistory,
    };
    return true;
}
