
"use client";

import Link from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function SignupDisabledPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100 dark:bg-gray-950 p-4">
      <Card className="w-full max-w-md text-center">
        <CardHeader>
          <div className="flex justify-center items-center gap-2 mb-4">
            <img 
              src="/images/logo.png" 
              alt="Gihon SACCOS Logo" 
              className="h-12 w-12 object-contain"
            />
             <h1 className="text-2xl font-semibold">Gihon SACCOS</h1>
          </div>
          <CardTitle className="text-2xl">Sign-up Disabled</CardTitle>
          <CardDescription>
            New accounts must be created by a Super Administrator.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm">
            Please contact your administrator to get an account.
          </p>
           <div className="mt-4 text-center text-sm">
            <Link href="/login" className="underline">
              Back to Sign in
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

