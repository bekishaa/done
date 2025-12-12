
"use client";

import { useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useToast } from "@/hooks/use-toast";
import { customerRegistrationSchema, type CustomerRegistrationValues } from "@/lib/types";
import { registerCustomer } from "@/app/actions";
import { useAuth } from "@/hooks/use-auth";
import { useIsMobile } from "@/hooks/use-mobile";

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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Loader2, UserPlus } from "lucide-react";

interface CustomerRegistrationFormProps {
  onDataChange: () => void;
}

export function CustomerRegistrationForm({ onDataChange }: CustomerRegistrationFormProps) {
  const [isPending, startTransition] = useTransition();
  const { toast } = useToast();
  const { user } = useAuth();
  const isMobile = useIsMobile();

  const form = useForm<CustomerRegistrationValues>({
    resolver: zodResolver(customerRegistrationSchema),
    defaultValues: {
      fullName: "",
      sex: undefined,
      phoneNumber: "",
      address: "",
      payersIdentification: "",
      savingType: "",
      loanType: "",
      registeredBy: user?.name || "",
    },
  });

  function onSubmit(values: CustomerRegistrationValues) {
    if (!user) {
        toast({
            title: "Error",
            description: "You must be logged in to register a customer.",
            variant: "destructive"
        });
        return;
    }

    startTransition(async () => {
      try {
        await registerCustomer({ ...values, registeredBy: user.name });
        onDataChange();
        toast({
          title: "Success!",
          description: `Customer "${values.fullName}" has been registered.`,
        });
        form.reset({
          fullName: "",
          sex: undefined,
          phoneNumber: "",
          address: "",
          payersIdentification: "",
          savingType: "",
          loanType: "",
          registeredBy: user.name,
        });
      } catch (e: any) {
        console.error('Customer registration error:', e);
        const errorMessage = e?.message || "Failed to register customer. Please check all fields and try again.";
        toast({ 
          title: "Error", 
          description: errorMessage, 
          variant: "destructive" 
        });
      }
    });
  }

  return (
    <Card className={`mx-auto ${isMobile ? 'max-w-full mx-0' : 'max-w-3xl'}`}>
      <CardHeader className={isMobile ? 'p-4' : ''}>
        <CardTitle className={isMobile ? 'text-lg' : ''}>New Customer Registration</CardTitle>
        <CardDescription className={isMobile ? 'text-xs' : ''}>Fill out the form below to add a new customer to the system.</CardDescription>
      </CardHeader>
      <CardContent className={isMobile ? 'p-4' : ''}>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className={`space-y-6 ${isMobile ? 'space-y-4' : ''}`}>
            <FormField
              control={form.control}
              name="fullName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className={isMobile ? 'text-sm' : ''}>Full Name</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="John Doe" 
                      {...field} 
                      className={isMobile ? 'h-11 text-base' : ''}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <div className={`grid gap-4 ${isMobile ? 'grid-cols-1' : 'grid-cols-1 md:grid-cols-2'}`}>
              <FormField
                control={form.control}
                name="sex"
                render={({ field }) => (
                  <FormItem className="space-y-3">
                    <FormLabel>Sex</FormLabel>
                    <FormControl>
                      <RadioGroup
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                        className={`flex items-center pt-2 ${isMobile ? 'flex-col space-y-2 space-x-0' : 'space-x-4'}`}
                      >
                        <FormItem className="flex items-center space-x-2 space-y-0">
                          <FormControl>
                            <RadioGroupItem value="Male" />
                          </FormControl>
                          <FormLabel className="font-normal">Male</FormLabel>
                        </FormItem>
                        <FormItem className="flex items-center space-x-2 space-y-0">
                          <FormControl>
                            <RadioGroupItem value="Female" />
                          </FormControl>
                          <FormLabel className="font-normal">Female</FormLabel>
                        </FormItem>
                      </RadioGroup>
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
                    <FormLabel className={isMobile ? 'text-sm' : ''}>Phone Number</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="0912345678" 
                        {...field} 
                        className={isMobile ? 'h-11 text-base' : ''}
                      />
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
              name="payersIdentification"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Payer's identification</FormLabel>
                  <FormControl>
                    <Input placeholder="Account Number" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className={`grid gap-4 ${isMobile ? 'grid-cols-1' : 'grid-cols-1 md:grid-cols-2'}`}>
               <FormField
                control={form.control}
                name="savingType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Saving Types (የቁጠባ አማራጮች)</FormLabel>
                     <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a saving type" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                           <SelectItem value="GIHON Regular Saving Account (ግዮን መደበኛ የቁጠባ ሂሳብ)">GIHON Regular Saving Account (ግዮን መደበኛ የቁጠባ ሂሳብ)</SelectItem>
                           <SelectItem value="Michu Current Saving Account">Michu Current Saving Account (ምቹ ተንቀሳቃሽ የቁጠባ ሂሳብ)</SelectItem>
                           <SelectItem value="Children Saving Account">Children Saving Account (የልጆች የቁጠባ ሂሳብ)</SelectItem>
                           <SelectItem value="Elders Saving Account">Elders Saving Account (የጎልማሶች የቁጠባ ሂሳብ)</SelectItem>
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
                    <FormLabel>Loan Products (የብድር አማራጮች)</FormLabel>                     <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a loan type" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                           <SelectItem value="Efoyta emergency loan">Efoyta emergency loan (እፎይታ አስቸኳይ ግዜ የብድር)</SelectItem>
                           <SelectItem value="Tiguhan small business loan">Tiguhan small business loan (ትጉሃን የአነስተኛ ንግድ ብድር)</SelectItem>
                           <SelectItem value="Tiguhan Medium business loan">Tiguhan Medium business loan (ትጉሃን የመካከለኛ ንግድ ብድር)</SelectItem>
                           <SelectItem value="Tiguhan loan">Tiguhan loan (ትጉሃን የከፍተኛ ንግድ ብድር)</SelectItem>
                           <SelectItem value="Mothers Loan">Mothers Loan (የእናቶች የብድር)</SelectItem>
                           <SelectItem value="Young Women's loan">Young Women's loan (የወጣት ሴቶች የብድር)</SelectItem>
                           <SelectItem value="Motorcycle & Taxi Drivers Loan">Motorcycle & Taxi Drivers Loan (የሞተር ሳይክል እና ታክሲ ሹፌሮች የብድር የቁጠባ ሂሳብ)</SelectItem>
                        </SelectContent>
                      </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            {/* registeredBy is a hidden field, populated automatically */}
            <FormField
              control={form.control}
              name="registeredBy"
              render={({ field }) => <Input type="hidden" {...field} />}
            />

            <Button 
              type="submit" 
              disabled={isPending || !user} 
              className={`w-full ${isMobile ? 'h-12 text-base' : ''}`}
            >
              {isPending ? (
                <Loader2 className={`animate-spin ${isMobile ? 'mr-2 h-5 w-5' : 'mr-2 h-4 w-4'}`} />
              ) : (
                <UserPlus className={isMobile ? 'mr-2 h-5 w-5' : 'mr-2 h-4 w-4'} />
              )}
              {isPending ? "Registering..." : "Register Customer"}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
