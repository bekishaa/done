"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import type { Receipt } from "@/lib/types";
import { FileText } from "lucide-react";

interface ReceiptDashboardProps {
  receipts: Receipt[];
}

export function ReceiptDashboard({ receipts }: ReceiptDashboardProps) {
  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>Recent Receipts</CardTitle>
        <CardDescription>
          A log of recently generated receipts.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {receipts.length > 0 ? (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Customer</TableHead>
                <TableHead className="text-right">Amount</TableHead>
                <TableHead className="text-center">Status</TableHead>
                <TableHead>Date</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {receipts.map((receipt) => (
                <TableRow key={receipt.id}>
                  <TableCell className="font-medium">{receipt.customerName}</TableCell>
                  <TableCell className="text-right">
                    ${receipt.paymentAmount.toFixed(2)}
                  </TableCell>
                  <TableCell className="text-center">
                    <Badge
                      className={
                        receipt.status === 'Sent'
                          ? "bg-green-100 text-green-800 border-green-200 hover:bg-green-200 dark:bg-green-900/40 dark:text-green-300 dark:border-green-800"
                          : ""
                      }
                      variant={receipt.status === 'Sent' ? "outline" : "destructive"}
                    >
                      {receipt.status}
                    </Badge>
                  </TableCell>
                  <TableCell>{receipt.date}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        ) : (
          <div className="flex flex-col items-center justify-center text-center text-muted-foreground py-16">
            <FileText className="w-12 h-12 mb-4 text-gray-400" />
            <p className="font-semibold text-lg">No receipts yet</p>
            <p className="text-sm">Generated receipts will appear here.</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
