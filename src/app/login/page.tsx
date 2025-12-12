
"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAuth } from "@/hooks/use-auth";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";

const loginSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address." }),
  password: z.string().min(6, { message: "Password must be at least 6 characters." }),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();
  const { toast } = useToast();

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (values: LoginFormValues) => {
    try {
      const res = await login(values.email, values.password);
      
      // Validate response structure
      if (!res || typeof res !== 'object' || typeof (res as any).success !== 'boolean') {
        toast({
          title: "Login Failed",
          description: "An unexpected error occurred. Please try again.",
          variant: "destructive",
        });
        return;
      }
      
      if (res.success) {
        toast({ title: "Login Successful", description: "Welcome back!" });
        router.push("/");
        return;
      }
      
      // Show appropriate error message
      const errorMessage = res.error || "An error occurred during login. Please try again.";
      let displayMessage = errorMessage;
      
      if (res.remainingAttempts !== undefined && res.remainingAttempts > 0) {
        displayMessage = `${errorMessage} (${res.remainingAttempts} attempt${res.remainingAttempts !== 1 ? 's' : ''} remaining)`;
      }
      
      toast({
        title: "Login Failed",
        description: displayMessage,
        variant: "destructive",
      });
    } catch (error) {
      console.error('Login form error:', error);
      toast({
        title: "Login Failed",
        description: error instanceof Error ? error.message : "An unexpected error occurred. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100 dark:bg-gray-950 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="flex justify-center items-center gap-2 mb-4">
            <img 
              src="/images/logo.png" 
              alt="Gihon SACCOS Logo" 
              className="h-12 w-12 object-contain"
            />
             <h1 className="text-2xl font-semibold">Gihon SACCOS</h1>
          </div>
          <CardTitle className="text-2xl">Welcome Back!</CardTitle>
          <CardDescription>Enter your credentials to access your account.</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input placeholder="name@example.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input type="password" placeholder="••••••••" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" className="w-full" disabled={form.formState.isSubmitting}>
                {form.formState.isSubmitting ? "Signing In..." : "Sign In"}
              </Button>
            </form>
          </Form>
        </CardContent>
        <div className="text-center text-sm text-muted-foreground pb-4">
          <p>© 2025 GIHON SACCOS.</p>
          <p>All rights reserved.</p>
        </div>
      </Card>
    </div>
  );
}
