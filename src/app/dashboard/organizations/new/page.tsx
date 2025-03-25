"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Building, ArrowLeft } from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";

const organizationSchema = z.object({
  name: z.string().min(2, "Organization name must be at least 2 characters"),
  industry: z.string().optional(),
  logo: z.string().optional(),
});

type OrganizationFormValues = z.infer<typeof organizationSchema>;

export default function NewOrganizationPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<OrganizationFormValues>({
    resolver: zodResolver(organizationSchema),
    defaultValues: {
      name: "",
      industry: "",
      logo: "",
    },
  });

  async function onSubmit(data: OrganizationFormValues) {
    setIsLoading(true);

    try {
      const response = await fetch("/api/organizations", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Failed to create organization");
      }

      toast.success("Organization created successfully");
      router.push("/dashboard");
      router.refresh();
    } catch (error) {
      console.error("Error creating organization:", error);
      toast.error(error instanceof Error ? error.message : "An error occurred");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-2">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/dashboard">
            <ArrowLeft className="h-5 w-5" />
          </Link>
        </Button>
        <h1 className="text-2xl font-semibold">Create New Organization</h1>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <div className="space-y-4">
          <div className="rounded-lg border bg-card p-6">
            <div className="flex items-center space-x-4">
              <div className="rounded-full bg-primary/10 p-3">
                <Building className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h3 className="text-lg font-medium">New Organization</h3>
                <p className="text-sm text-muted-foreground">
                  Create a new organization to manage assets, documents, and passwords
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-lg border bg-card p-6">
            <h3 className="mb-4 text-lg font-medium">Organization Details</h3>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Organization Name</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Acme Inc."
                          {...field}
                          disabled={isLoading}
                        />
                      </FormControl>
                      <FormDescription>
                        The name of your organization or client
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="industry"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Industry</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Technology, Healthcare, etc."
                          {...field}
                          disabled={isLoading}
                        />
                      </FormControl>
                      <FormDescription>
                        The industry sector of this organization
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="logo"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Logo URL</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="https://example.com/logo.png"
                          {...field}
                          disabled={isLoading}
                        />
                      </FormControl>
                      <FormDescription>
                        URL to the organization's logo (optional)
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="flex justify-end space-x-2 pt-4">
                  <Button
                    variant="outline"
                    onClick={() => router.back()}
                    disabled={isLoading}
                  >
                    Cancel
                  </Button>
                  <Button type="submit" disabled={isLoading}>
                    {isLoading ? "Creating..." : "Create Organization"}
                  </Button>
                </div>
              </form>
            </Form>
          </div>
        </div>

        <div className="space-y-4">
          <div className="rounded-lg border bg-card p-6">
            <h3 className="mb-4 text-lg font-medium">About Organizations</h3>
            <div className="space-y-2 text-sm">
              <p>
                Organizations in ITDoc Hub allow you to separate and manage information
                for different clients or business units.
              </p>
              <p>
                Each organization has its own:
              </p>
              <ul className="list-disc pl-5 space-y-1">
                <li>Assets and asset types</li>
                <li>Documents and knowledge base</li>
                <li>Passwords and credentials</li>
                <li>Team members and permissions</li>
              </ul>
              <p className="mt-4">
                As an administrator, you can add team members to organizations and
                control their access levels.
              </p>
            </div>
          </div>

          <div className="rounded-lg border bg-card p-6">
            <h3 className="mb-4 text-lg font-medium">What's Next?</h3>
            <div className="space-y-2 text-sm">
              <p>
                After creating an organization, you can:
              </p>
              <ul className="list-disc pl-5 space-y-1">
                <li>Define custom asset types specific to this organization</li>
                <li>Add assets, documents, and passwords</li>
                <li>Invite team members to collaborate</li>
                <li>Set up folder structures for documentation</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
