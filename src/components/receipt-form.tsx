"use client";

import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { receiptFormSchema, type Receipt, type ReceiptFormValues } from "@/lib/types";
import { createAndSendReceipt } from "@/app/actions";
import { useToast } from "@/hooks/use-toast";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
import { Loader2, Send } from "lucide-react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

interface ReceiptFormProps {
  onReceiptGenerated: (receipt: Receipt) => void;
  showReceipt: (htmlContent: string) => void;
}

export function ReceiptForm({ onReceiptGenerated, showReceipt }: ReceiptFormProps) {
  const [isPending, startTransition] = useTransition();
  const { toast } = useToast();

  const form = useForm<ReceiptFormValues>({
    resolver: zodResolver(receiptFormSchema),
    defaultValues: {
      name: "",
      phoneNumber: "",
      reasonForPayment: "",
      cashInFigure: "" as any,
      amountInWords: "",
      payersIdentification: "",
      modeOfPayment: "CASH",
      bankReceiptNo: "",
      preparedBy: "",
      cashierSignature: "",
    },
  });
  
  const paymentMode = form.watch("modeOfPayment");

  function onSubmit(values: ReceiptFormValues) {
    startTransition(async () => {
      const result = await createAndSendReceipt(values);
      if (result.success && result.receipt && result.htmlContent) {
        onReceiptGenerated(result.receipt);
        showReceipt(result.htmlContent);
        toast({
          title: "Success!",
          description: `Receipt for ${values.name} has been generated.`,
          variant: 'default',
        });
        form.reset();
      } else {
        toast({
          title: "Error",
          description: result.error || "Something went wrong.",
          variant: "destructive",
        });
      }
    });
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Generate New Receipt</CardTitle>
        <CardDescription>Enter payment details to generate a new receipt voucher.</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="space-y-4">
               <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name / የከፋይ ስም</FormLabel>
                    <FormControl>
                      <Input placeholder="John Doe" {...field} />
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
                    <FormLabel>Phone Number / ስልክ ቁጥር</FormLabel>
                    <FormControl>
                      <Input placeholder="0912345678" {...field} />
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
                    <FormLabel>Reason of payment / የተከፈለበት ምክንያት</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select payment reason" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="Efoyta emergency loan">Efoyta emergency loan</SelectItem>
                        <SelectItem value="Tiguhan small business loan">Tiguhan small business loan</SelectItem>
                        <SelectItem value="Tiguhan Medium business loan">Tiguhan Medium business loan</SelectItem>
                        <SelectItem value="Tiguhan loan">Tiguhan loan</SelectItem>
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
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="cashInFigure"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Cash in figure / የገንዘቡ ልክ በአኃዝ</FormLabel>
                      <FormControl>
                        <Input type="number" placeholder="1000.00" {...field} />
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
                        <Input placeholder="One Thousand Only" {...field} />
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
                      <Input placeholder="ID-12345" {...field} />
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
                        defaultValue={field.value}
                        className="flex items-center space-x-4"
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
                        <Input placeholder="BR-9876" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}
               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                    control={form.control}
                    name="preparedBy"
                    render={({ field }) => (
                    <FormItem>
                        <FormLabel>Prepared by / ያዘጋጁ ስምና ፊርማ</FormLabel>
                        <FormControl>
                        <Input placeholder="Your Name" {...field} />
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
                        <Input placeholder="Cashier's Name" {...field} />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                    )}
                />
              </div>
            </div>

            <Button type="submit" disabled={isPending} className="w-full bg-accent text-accent-foreground hover:bg-accent/90">
              {isPending ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Send className="mr-2 h-4 w-4" />
              )}
              {isPending ? "Generating..." : "Generate Receipt"}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
