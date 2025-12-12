
"use client";

import { useEffect, useTransition, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ticketFormSchema, type Ticket, type TicketFormValues, type Customer } from "@/lib/types";
import { createAndSendTicket } from "@/app/actions";
import { useAuth } from "@/hooks/use-auth";
import { useToast } from "@/hooks/use-toast";
import { useIsMobile } from "@/hooks/use-mobile";
import { numberToWords } from "@/lib/number-to-words";
import { Check, ChevronsUpDown, Loader2, Send } from "lucide-react";
import { cn } from "@/lib/utils";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface TicketFormProps {
  onTicketGenerated: (ticket: Ticket, htmlContent: string) => void;
  customers: Customer[];
}

export function TicketForm({ onTicketGenerated, customers }: TicketFormProps) {
  const [isPending, startTransition] = useTransition();
  const [isSubmitting, setIsSubmitting] = useState(false); // Guard against duplicate submissions
  const { toast } = useToast();
  const { user } = useAuth();
  const isMobile = useIsMobile();
  const [popoverOpen, setPopoverOpen] = useState(false);
  const [searchMode, setSearchMode] = useState<'name' | 'payerId'>('payerId');
  const [payerIdSearch, setPayerIdSearch] = useState('NV026000');

  const form = useForm<TicketFormValues>({
    resolver: zodResolver(ticketFormSchema),
    defaultValues: {
      name: "",
      phoneNumber: "",
      reasonForPayment: "",
      cashInFigure: "" as any,
      amountInWords: "",
      payersIdentification: "",
      modeOfPayment: "CASH",
      bankReceiptNo: "",
      preparedBy: user?.name || "",
      cashierSignature: "",
    },
  });

  useEffect(() => {
    if (user?.name) {
        form.setValue("preparedBy", user.name)
    }
  }, [user, form]);
  
  const paymentMode = form.watch("modeOfPayment");
  const cashInFigureValue = form.watch("cashInFigure");

  useEffect(() => {
    if (cashInFigureValue) {
      const words = numberToWords(Number(cashInFigureValue));
      form.setValue("amountInWords", words, { shouldValidate: true });
    } else {
        form.setValue("amountInWords", "", { shouldValidate: true });
    }
  }, [cashInFigureValue, form]);
  
  const handleCustomerSelect = (customer: Customer) => {
    form.setValue("name", customer.fullName);
    form.setValue("phoneNumber", customer.phoneNumber);
    form.setValue("payersIdentification", customer.payersIdentification);
    setPopoverOpen(false);
  }


  function onSubmit(values: TicketFormValues) {
    console.log('[TicketForm] ═══ FORM SUBMISSION ═══');
    console.log('[TicketForm] onSubmit called - this should happen ONCE per form submission');
    console.log('[TicketForm] Call stack:', new Error().stack?.split('\n').slice(1, 4).join('\n'));
    
    // Prevent duplicate submissions
    if (isSubmitting || isPending) {
      console.warn('[TicketForm] ⚠️ Form submission blocked - already submitting');
      return;
    }
    
    setIsSubmitting(true);
    startTransition(async () => {
        try {
          const payload: TicketFormValues = {
            ...values,
            bankReceiptNo: values.bankReceiptNo?.trim() ? values.bankReceiptNo.trim() : undefined,
          };

          const selected = customers.find(c => c.fullName === payload.name && c.phoneNumber === payload.phoneNumber);
          if (!selected) {
              toast({ title: "Customer required", description: "Please select a registered customer before generating a ticket.", variant: "destructive" });
              setIsSubmitting(false);
              return;
          }
          console.log('[TicketForm] About to call createAndSendTicket() - this should happen ONLY ONCE');
          const result = await createAndSendTicket(payload);
          console.log('[TicketForm] Received result:', result);
          if (result.success && result.ticket) {
              // Ticket was created successfully - clear form and show success
              const smsOk = typeof result.smsSuccess === 'boolean' ? result.smsSuccess : (result.ticket.status === 'Sent' || result.ticket.status === 'SENT');
              const ticketNumber = result.ticket.ticketNumber || 'N/A';
              
              // Only call onTicketGenerated if we have htmlContent
              if (result.htmlContent) {
              onTicketGenerated(result.ticket, result.htmlContent);
              }
              
              toast({
                  title: "Success!",
                  description: `Ticket ${ticketNumber} for ${values.name} generated${smsOk ? ' and SMS sent' : ' (SMS failed)'}.`,
                  variant: smsOk ? 'default' : 'destructive',
              });
              
              // Always clear form after successful ticket creation
              form.reset({
                  name: "",
                  phoneNumber: "",
                  reasonForPayment: "",
                  cashInFigure: "" as any,
                  amountInWords: "",
                  payersIdentification: "",
                  bankReceiptNo: "",
                  cashierSignature: "",
                  modeOfPayment: "CASH",
                  preparedBy: user?.name || "",
              });
          } else {
              toast({
                  title: "Error",
                  description: result.error || "Something went wrong.",
                  variant: "destructive",
              });
          }
        } catch (error) {
          console.error('[TicketForm] Error in onSubmit:', error);
          toast({
              title: "Error",
              description: "An unexpected error occurred. Please try again.",
              variant: "destructive",
          });
        } finally {
          // Always reset submitting flag
          setIsSubmitting(false);
        }
    });
  }

  return (
    <Card className={isMobile ? 'mx-0' : ''}>
      <CardHeader className={isMobile ? 'p-4' : ''}>
        <CardTitle className={isMobile ? 'text-lg' : ''}>Gihon SACCOS</CardTitle>
        <CardDescription className={isMobile ? 'text-xs' : ''}>Gihon SACCOS DAILY CASH RECEIPT VOUCHER</CardDescription>
      </CardHeader>
      <CardContent className={isMobile ? 'p-4' : ''}>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className={`space-y-6 ${isMobile ? 'space-y-4' : ''}`}>
            <div className={`space-y-4 ${isMobile ? 'space-y-3' : ''}`}>
              <Popover open={popoverOpen} onOpenChange={setPopoverOpen}>
                  <PopoverTrigger asChild>
                      <Button
                          variant="outline"
                          role="combobox"
                          aria-expanded={popoverOpen}
                          className="w-full justify-between"
                      >
                         {form.watch("name")
                            ? customers.find((c) => c.fullName === form.watch("name"))?.fullName
                            : "Search and select customer..."}
                          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                      </Button>
                  </PopoverTrigger>
                  <PopoverContent className={`p-0 ${isMobile ? 'w-[calc(100vw-2rem)]' : 'w-[--radix-popover-trigger-width]'}`}>
                      <Command shouldFilter={searchMode === 'name'}>
                          <div className={`flex items-center gap-2 p-2 ${isMobile ? 'flex-col' : ''}`}>
                            {searchMode === 'payerId' ? (
                              <div className={`flex items-center gap-1 ${isMobile ? 'w-full' : 'flex-1'}`}>
                                <span className={`text-muted-foreground ${isMobile ? 'text-xs' : 'text-sm'}`}>NV026000</span>
                                <CommandInput 
                                  placeholder="Type last 3-4 digits..." 
                                  value={payerIdSearch.replace('NV026000', '')}
                                  onValueChange={(value) => {
                                    const fullId = 'NV026000' + value;
                                    setPayerIdSearch(fullId);
                                  }}
                                  className={isMobile ? 'text-sm' : ''}
                                />
                              </div>
                            ) : (
                              <CommandInput placeholder="Search by name..." className={isMobile ? 'text-sm' : ''} />
                            )}
                            <Select value={searchMode} onValueChange={(v) => {
                              setSearchMode(v as any);
                              if (v === 'payerId') {
                                setPayerIdSearch('NV026000');
                              }
                            }}>
                              <SelectTrigger className={isMobile ? 'h-9 w-full text-sm' : 'h-8 w-36'}>
                                <SelectValue placeholder="Search by" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="name">By Name</SelectItem>
                                <SelectItem value="payerId">By Payer ID</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <CommandList>
                            <CommandEmpty>No customer found.</CommandEmpty>
                            <CommandGroup>
                                {(() => {
                                  let filteredCustomers = customers;
                                  if (searchMode === 'payerId') {
                                    filteredCustomers = customers.filter(c => 
                                      c.payersIdentification && 
                                      c.payersIdentification.toLowerCase().includes(payerIdSearch.toLowerCase())
                                    );
                                  }
                                  return filteredCustomers.map((customer) => (
                                      <CommandItem
                                          key={customer.id}
                                          value={searchMode === 'name' ? customer.fullName : (customer.payersIdentification || '')}
                                          onSelect={() => handleCustomerSelect(customer)}
                                      >
                                          <Check
                                              className={cn(
                                                  "mr-2 h-4 w-4",
                                                  form.watch("name") === customer.fullName ? "opacity-100" : "opacity-0"
                                              )}
                                          />
                                          <div className="flex flex-col">
                                            <span className="font-medium">{customer.fullName}</span>
                                            <span className="text-xs text-muted-foreground">{customer.payersIdentification}</span>
                                          </div>
                                      </CommandItem>
                                  ));
                                })()}
                            </CommandGroup>
                          </CommandList>
                      </Command>
                  </PopoverContent>
              </Popover>

              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className={isMobile ? 'text-sm' : ''}>Name / የከፋይ ስም</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="John Doe" 
                        {...field} 
                        value={field.value ?? ""} 
                        readOnly 
                        className={isMobile ? 'h-11 text-base' : ''}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="phoneNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className={isMobile ? 'text-sm' : ''}>Phone Number / ስልክ ቁጥር</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="0912345678" 
                        {...field} 
                        value={field.value ?? ""} 
                        readOnly 
                        className={isMobile ? 'h-11 text-base' : ''}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
               <FormField
                control={form.control}
                name="reasonForPayment"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className={isMobile ? 'text-sm' : ''}>Reason of payment / የተከፈለበት ምክንያት</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger className={isMobile ? 'h-11 text-base' : ''}>
                          <SelectValue placeholder="Select payment reason" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="Efoyta emergency loan">Efoyta emergency loan</SelectItem>
                        <SelectItem value="Tiguhan small business loan">Tiguhan small business loan</SelectItem>
                        <SelectItem value="Tiguhan Medium business loan">Tiguhan Medium business loan</SelectItem>
                        <SelectItem value="Tiguhan loan">Tiguhan loan</SelectItem>
                        <SelectItem value="Repayment">Repayment</SelectItem>
                        <SelectItem value="Mothers Loan">Mothers Loan</SelectItem>
                        <SelectItem value="Young Women's loan">Young Women's loan</SelectItem>
                        <SelectItem value="Motorcycle & Taxi Drivers Loan">Motorcycle & Taxi Drivers Loan</SelectItem>
                        <SelectItem value="GIHON Regular Saving Account (ግዮን መደበኛ የቁጠባ ሂሳብ)">GIHON Regular Saving Account (ግዮን መደበኛ የቁጠባ ሂሳብ)</SelectItem>
                        <SelectItem value="Michu Current Saving Account">Michu Current Saving Account</SelectItem>
                        <SelectItem value="Children Saving Account">Children Saving Account</SelectItem>
                        <SelectItem value="Elders Saving Account">Elders Saving Account</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className={`grid gap-4 ${isMobile ? 'grid-cols-1' : 'grid-cols-1 md:grid-cols-2'}`}>
                <FormField
                  control={form.control}
                  name="cashInFigure"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className={isMobile ? 'text-sm' : ''}>Cash in figure / የገንዘቡ ልክ በአኃዝ</FormLabel>
                      <FormControl>
                        <Input 
                          type="number" 
                          placeholder="1000.00" 
                          {...field} 
                          value={field.value ?? ""} 
                          className={isMobile ? 'h-11 text-base' : ''}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                 <FormField
                  control={form.control}
                  name="amountInWords"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Amount in words / የገንዘቡ ልክ በፊደል</FormLabel>
                      <FormControl>
                        <Input placeholder="One Thousand Only" {...field} value={field.value ?? ""} readOnly />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

               <FormField
                control={form.control}
                name="payersIdentification"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Payer's identification / የከፋይ መለያ ቁጥር (Optional)</FormLabel>
                    <FormControl>
                      <Input placeholder="ID-12345" {...field} value={field.value ?? ""} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="modeOfPayment"
                render={({ field }) => (
                  <FormItem className="space-y-3">
                    <FormLabel>Mode of payment / የከፍያ ሁኔታ</FormLabel>
                    <FormControl>
                      <RadioGroup
                        onValueChange={field.onChange}
                        value={field.value}
                        className={`flex items-center ${isMobile ? 'flex-col space-y-2 space-x-0' : 'space-x-4'}`}
                      >
                        <FormItem className="flex items-center space-x-2 space-y-0">
                          <FormControl>
                            <RadioGroupItem value="CASH" />
                          </FormControl>
                          <FormLabel className="font-normal">Cash / በካሽ</FormLabel>
                        </FormItem>
                        <FormItem className="flex items-center space-x-2 space-y-0">
                          <FormControl>
                            <RadioGroupItem value="BANK" />
                          </FormControl>
                          <FormLabel className="font-normal">Bank / በባንክ</FormLabel>
                        </FormItem>
                      </RadioGroup>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {paymentMode === 'BANK' && (
                <FormField
                  control={form.control}
                  name="bankReceiptNo"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Bank Receipt no / የባንክ ደረሰኝ ቁጥር</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="BR-9876"
                          {...field}
                          value={field.value ?? ""}
                          required
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}
               <div className={`grid gap-4 ${isMobile ? 'grid-cols-1' : 'grid-cols-1 md:grid-cols-2'}`}>
                <FormField
                    control={form.control}
                    name="preparedBy"
                    render={({ field }) => (
                    <FormItem>
                        <FormLabel>Prepared by / ያዘጋጁ ስምና ፊርማ</FormLabel>
                        <FormControl>
                        <Input placeholder="Your Name" {...field} value={field.value ?? ""} readOnly />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="cashierSignature"
                    render={({ field }) => (
                    <FormItem>
                        <FormLabel>Cashier Signature / ገንዘብ ተቀባይ (Optional)</FormLabel>
                        <FormControl>
                        <Input placeholder="Cashier's Name" {...field} value={field.value ?? ""} />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                    )}
                />
              </div>
            </div>

            <Button 
              type="submit" 
              disabled={isPending || isSubmitting} 
              className={`w-full bg-accent text-accent-foreground hover:bg-accent/90 ${isMobile ? 'h-12 text-base' : ''}`}
            >
              {isPending || isSubmitting ? (
                <Loader2 className={`animate-spin ${isMobile ? 'mr-2 h-5 w-5' : 'mr-2 h-4 w-4'}`} />
              ) : (
                <Send className={isMobile ? 'mr-2 h-5 w-5' : 'mr-2 h-4 w-4'} />
              )}
              {isPending || isSubmitting ? "Generating..." : "Generate & Send Ticket"}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
