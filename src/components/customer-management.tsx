"use client";

import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogTrigger
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { 
  Users, 
  Search, 
  X, 
  MoreHorizontal, 
  Edit, 
  Trash2, 
  UserCheck, 
  UserX, 
  Loader2,
  Download
} from "lucide-react";

import { useToast } from "@/hooks/use-toast";
import type { Customer, Ticket as TicketType } from "@/lib/types";
import { 
  updateCustomerAction, 
  deactivateCustomerAction, 
  activateCustomerAction, 
  deleteCustomerAction 
} from "@/app/actions";

const customerEditSchema = z.object({
  fullName: z.string().min(2, "Full name is required"),
  sex: z.enum(['Male', 'Female'], { required_error: "Please select a gender" }),
  phoneNumber: z.string().min(10, "Phone number must be at least 10 digits"),
  address: z.string().optional(),
  payersIdentification: z.string().min(1, "Payer's identification is required"),
  savingType: z.string().min(1, "Saving type is required"),
  loanType: z.string().min(1, "Loan type is required"),
});

type CustomerEditValues = z.infer<typeof customerEditSchema>;

const savingTypes = [
  "GIHON Regular Saving Account (ግዮን መደበኛ የቁጠባ ሂሳብ)",
  "Michu Current Saving Account", 
  "Children Saving Account",
  "Elders Saving Account",
];

const loanTypes = [
  "Efoyta emergency loan",
  "Tiguhan small business loan",
  "Tiguhan Medium business loan",
  "Tiguhan loan",
  "Mothers Loan",
  "Young Women's loan",
  "Motorcycle & Taxi Drivers Loan",
];

interface CustomerManagementProps {
  customers: Customer[];
  tickets: TicketType[];
  users?: Array<{ name: string; branchId: string }>; // Users with branch info
  branches?: Array<{ id: string; name: string }>; // Branches
  onDataChange: () => void;
  userRole?: 'superadmin' | 'admin' | 'sales' | 'auditor' | 'operation';
}

export function CustomerManagement({ customers, tickets, users = [], branches = [], onDataChange, userRole = 'admin' }: CustomerManagementProps) {
  const { toast } = useToast();
  const [isPending, startTransition] = useTransition();
  
  const [searchTerm, setSearchTerm] = useState("");
  const [savingTypeFilter, setSavingTypeFilter] = useState("all");
  const [loanTypeFilter, setLoanTypeFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [salesFilter, setSalesFilter] = useState("all");
  const [branchFilter, setBranchFilter] = useState("all");
  
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [customerToEdit, setCustomerToEdit] = useState<Customer | null>(null);
  const [customerToDelete, setCustomerToDelete] = useState<Customer | null>(null);

  const salesNames = Array.from(new Set(customers.map(c => c.registeredBy))).filter(Boolean);
  
  // Create a map of user name to branchId
  const userBranchMap = new Map(users.map(u => [u.name, u.branchId]));
  
  // Get unique branch IDs from users
  const availableBranches = branches.filter(b => 
    users.some(u => u.branchId === b.id)
  );

  const form = useForm<CustomerEditValues>({
    resolver: zodResolver(customerEditSchema),
    defaultValues: {
      fullName: "",
      sex: undefined,
      phoneNumber: "",
      address: "",
      payersIdentification: "",
      savingType: "",
      loanType: "",
    },
  });

  const filteredCustomers = customers.filter((customer) => {
    const term = searchTerm.toLowerCase();
    const matchesSearchTerm =
      customer.fullName.toLowerCase().includes(term) ||
      customer.phoneNumber.includes(term) ||
      (customer.payersIdentification && customer.payersIdentification.toLowerCase().includes(term));

    const matchesSavingType =
      savingTypeFilter === "all" || customer.savingType === savingTypeFilter;

    const matchesLoanType =
      loanTypeFilter === "all" || customer.loanType === loanTypeFilter;

    const matchesStatus =
      statusFilter === "all" || 
      (statusFilter === "active" && customer.isActive) ||
      (statusFilter === "inactive" && !customer.isActive);

    const matchesSales = salesFilter === "all" || customer.registeredBy === salesFilter;
    
    // Filter by branch - check which branch the user who registered the customer belongs to
    let matchesBranch = true;
    if (branchFilter !== "all" && users.length > 0) {
      const customerBranchId = userBranchMap.get(customer.registeredBy);
      matchesBranch = customerBranchId === branchFilter;
    }

    return matchesSearchTerm && matchesSavingType && matchesLoanType && matchesStatus && matchesSales && matchesBranch;
  });

  const clearFilters = () => {
    setSearchTerm("");
    setSavingTypeFilter("all");
    setLoanTypeFilter("all");
    setStatusFilter("all");
    setSalesFilter("all");
    setBranchFilter("all");
  };

  const hasActiveFilters = searchTerm || savingTypeFilter !== 'all' || loanTypeFilter !== 'all' || statusFilter !== 'all' || salesFilter !== 'all' || branchFilter !== 'all';

  const handleEditCustomer = (customer: Customer) => {
    setCustomerToEdit(customer);
    form.reset({
      fullName: customer.fullName,
      sex: customer.sex,
      phoneNumber: customer.phoneNumber,
      address: (customer as any).address || "",
      payersIdentification: customer.payersIdentification,
      savingType: customer.savingType,
      loanType: customer.loanType,
    });
    setIsEditDialogOpen(true);
  };

  const handleUpdateCustomer = (values: CustomerEditValues) => {
    if (!customerToEdit) return;
    
    startTransition(async () => {
      try {
        await updateCustomerAction(customerToEdit.id, values);
        onDataChange();
        toast({ 
          title: "Customer Updated", 
          description: `Customer "${values.fullName}" has been updated successfully.` 
        });
        setIsEditDialogOpen(false);
        setCustomerToEdit(null);
        form.reset();
      } catch (e: any) {
        toast({ 
          title: "Update Failed", 
          description: e?.message || "Could not update customer.", 
          variant: "destructive" 
        });
      }
    });
  };

  const handleStatusChange = (customer: Customer) => {
    startTransition(async () => {
      try {
        if (customer.isActive) {
          await deactivateCustomerAction(customer.id);
          toast({ 
            title: "Customer Deactivated", 
            description: `Customer "${customer.fullName}" has been deactivated.` 
          });
        } else {
          await activateCustomerAction(customer.id);
          toast({ 
            title: "Customer Activated", 
            description: `Customer "${customer.fullName}" has been activated.` 
          });
        }
        onDataChange();
      } catch (e: any) {
        toast({ 
          title: "Status Change Failed", 
          description: e?.message || "Could not change customer status.", 
          variant: "destructive" 
        });
      }
    });
  };

  const confirmDeleteCustomer = (customer: Customer) => {
    setCustomerToDelete(customer);
    setIsDeleteDialogOpen(true);
  };

  const handleDeleteCustomer = () => {
    if (!customerToDelete) return;
    
    startTransition(async () => {
      try {
        await deleteCustomerAction(customerToDelete.id);
        onDataChange();
        toast({ 
          title: "Customer Deleted", 
          description: `Customer "${customerToDelete.fullName}" has been deleted.` 
        });
        setIsDeleteDialogOpen(false);
        setCustomerToDelete(null);
      } catch (e: any) {
        toast({ 
          title: "Deletion Failed", 
          description: e?.message || "Could not delete customer.", 
          variant: "destructive" 
        });
      }
    });
  };

  const exportCustomers = () => {
    const csvContent = [
      ['Full Name', 'Phone Number', 'Gender', 'Payer ID', 'Saving Type', 'Loan Type', 'Registration Date', 'Registered By', 'Status'],
      ...filteredCustomers.map(customer => [
        customer.fullName,
        customer.phoneNumber,
        customer.sex,
        customer.payersIdentification,
        customer.savingType,
        customer.loanType,
        customer.registrationDate,
        customer.registeredBy,
        customer.isActive ? 'Active' : 'Inactive'
      ])
    ].map(row => row.map(field => `"${field}"`).join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `customers-${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
    
    toast({ 
      title: "Export Complete", 
      description: `Exported ${filteredCustomers.length} customers to CSV.` 
    });
  };

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Customer Management
          </CardTitle>
          <CardDescription>
            Manage registered customers. Edit customer information, activate/deactivate accounts, or delete customers.
          </CardDescription>
          
          <div className="space-y-4 pt-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search by name, phone, or ID..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
              <Select value={savingTypeFilter} onValueChange={setSavingTypeFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Saving Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Saving Types</SelectItem>
                  {savingTypes.map(type => (
                    <SelectItem key={type} value={type}>{type}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              
              <Select value={loanTypeFilter} onValueChange={setLoanTypeFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Loan Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Loan Types</SelectItem>
                  {loanTypes.map(type => (
                    <SelectItem key={type} value={type}>{type}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                </SelectContent>
              </Select>
              
              <Select value={salesFilter} onValueChange={setSalesFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Sales Person" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Sales</SelectItem>
                  {salesNames.map(name => (
                    <SelectItem key={name} value={name}>{name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              
              {availableBranches.length > 0 && (
                <Select value={branchFilter} onValueChange={setBranchFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="Branch" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Branches</SelectItem>
                    {availableBranches.map(branch => (
                      <SelectItem key={branch.id} value={branch.id}>{branch.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
              
              <div className="flex gap-2">
                {hasActiveFilters && (
                  <Button variant="ghost" onClick={clearFilters} size="sm">
                    <X className="mr-2 h-4 w-4" />
                    Clear
                  </Button>
                )}
                <Button variant="outline" onClick={exportCustomers} size="sm">
                  <Download className="mr-2 h-4 w-4" />
                  Export
                </Button>
              </div>
            </div>
          </div>
        </CardHeader>
        
        <CardContent>
          {filteredCustomers.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Full Name</TableHead>
                  <TableHead>Phone Number</TableHead>
                  <TableHead>Gender</TableHead>
                  <TableHead>Saving Type</TableHead>
                  <TableHead>Loan Type</TableHead>
                  <TableHead>Registered By</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredCustomers.map((customer) => (
                  <TableRow key={customer.id}>
                    <TableCell className="font-medium">{customer.fullName}</TableCell>
                    <TableCell>{customer.phoneNumber}</TableCell>
                    <TableCell>
                      <Badge variant="outline">{customer.sex}</Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary" className="text-xs">
                        {customer.savingType}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="text-xs">
                        {customer.loanType}
                      </Badge>
                    </TableCell>
                    <TableCell>{customer.registeredBy}</TableCell>
                    <TableCell>
                      <Badge variant={customer.isActive ? "default" : "destructive"}>
                        {customer.isActive ? "Active" : "Inactive"}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0">
                            <span className="sr-only">Open menu</span>
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => handleEditCustomer(customer)}>
                            <Edit className="mr-2 h-4 w-4" />
                            Edit Customer
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleStatusChange(customer)}>
                            {customer.isActive ? (
                              <>
                                <UserX className="mr-2 h-4 w-4" />
                                Deactivate
                              </>
                            ) : (
                              <>
                                <UserCheck className="mr-2 h-4 w-4" />
                                Activate
                              </>
                            )}
                          </DropdownMenuItem>
                          {userRole === 'superadmin' && (
                            <>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem 
                                className="text-destructive" 
                                onClick={() => confirmDeleteCustomer(customer)}
                              >
                                <Trash2 className="mr-2 h-4 w-4" />
                                Delete Customer
                              </DropdownMenuItem>
                            </>
                          )}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className="flex flex-col items-center justify-center text-center text-muted-foreground py-16">
              {customers.length > 0 && hasActiveFilters ? (
                <>
                  <Search className="w-12 h-12 mb-4 text-gray-400" />
                  <p className="font-semibold text-lg">No customers found</p>
                  <p className="text-sm">Your search did not return any results.</p>
                </>
              ) : (
                <>
                  <Users className="w-12 h-12 mb-4 text-gray-400" />
                  <p className="font-semibold text-lg">No customers registered yet</p>
                  <p className="text-sm">New customers will appear here after registration.</p>
                </>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Edit Customer Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Edit Customer</DialogTitle>
            <DialogDescription>
              Update customer information. All fields are required.
            </DialogDescription>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleUpdateCustomer)} className="space-y-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="fullName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Full Name</FormLabel>
                      <FormControl>
                        <Input placeholder="John Doe" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="sex"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Gender</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select gender" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="Male">Male</SelectItem>
                          <SelectItem value="Female">Female</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="phoneNumber"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Phone Number</FormLabel>
                      <FormControl>
                        <Input placeholder="0911223344" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="payersIdentification"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Payer's Identification</FormLabel>
                      <FormControl>
                        <Input placeholder="ID-001" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <FormField
                control={form.control}
                name="address"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Address</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter customer address" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="savingType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Saving Type</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select saving type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {savingTypes.map(type => (
                          <SelectItem key={type} value={type}>{type}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="loanType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Loan Type</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select loan type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {loanTypes.map(type => (
                          <SelectItem key={type} value={type}>{type}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" disabled={isPending}>
                  {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Update Customer
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      {/* Delete Customer Dialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure you want to delete this customer?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the customer record for{" "}
              <span className="font-bold">{customerToDelete?.fullName}</span> and all associated data.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleDeleteCustomer} 
              className="bg-destructive hover:bg-destructive/90" 
              disabled={isPending}
            >
              {isPending ? "Deleting..." : "Delete Customer"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
