"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Building, Database, Files, Key, Clock } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface DashboardStats {
  assetCount: number;
  documentCount: number;
  passwordCount: number;
  recentItems: {
    id: string;
    name: string;
    type: string;
    updatedAt: string;
  }[];
}

export default function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats>({
    assetCount: 0,
    documentCount: 0,
    passwordCount: 0,
    recentItems: [],
  });

  // In a real application, this would fetch actual data from your API
  useEffect(() => {
    // Mock data
    const mockStats: DashboardStats = {
      assetCount: 48,
      documentCount: 25,
      passwordCount: 38,
      recentItems: [
        {
          id: "1",
          name: "Web Server",
          type: "asset",
          updatedAt: new Date().toISOString(),
        },
        {
          id: "2",
          name: "Network Setup Guide",
          type: "document",
          updatedAt: new Date().toISOString(),
        },
        {
          id: "3",
          name: "Admin Portal",
          type: "password",
          updatedAt: new Date().toISOString(),
        },
        {
          id: "4",
          name: "Database Server",
          type: "asset",
          updatedAt: new Date().toISOString(),
        },
        {
          id: "5",
          name: "Firewall Configuration",
          type: "document",
          updatedAt: new Date().toISOString(),
        },
      ],
    };

    setStats(mockStats);
  }, []);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "numeric",
    }).format(date);
  };

  const getItemIcon = (type: string) => {
    switch (type) {
      case "asset":
        return <Database className="h-4 w-4 text-blue-500" />;
      case "document":
        return <Files className="h-4 w-4 text-emerald-500" />;
      case "password":
        return <Key className="h-4 w-4 text-amber-500" />;
      default:
        return null;
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Dashboard</h1>
        <Button asChild>
          <Link href="/dashboard/assets/new">Add Asset</Link>
        </Button>
      </div>

      {/* Overview Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Assets</CardTitle>
            <Database className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.assetCount}</div>
            <p className="text-xs text-muted-foreground">
              IT assets across all categories
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Documents</CardTitle>
            <Files className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.documentCount}</div>
            <p className="text-xs text-muted-foreground">
              Documentation, guides, and SOPs
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Passwords</CardTitle>
            <Key className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.passwordCount}</div>
            <p className="text-xs text-muted-foreground">
              Secure password entries
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity and Quick Access */}
      <Tabs defaultValue="recent">
        <TabsList>
          <TabsTrigger value="recent">Recent Activity</TabsTrigger>
          <TabsTrigger value="quick">Quick Access</TabsTrigger>
        </TabsList>
        <TabsContent value="recent" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Recent Items</CardTitle>
              <CardDescription>
                Recently updated assets, documents, and passwords
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {stats.recentItems.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between rounded-lg border p-3"
                  >
                    <div className="flex items-center space-x-4">
                      <div className="rounded-full bg-muted p-2">
                        {getItemIcon(item.type)}
                      </div>
                      <div>
                        <p className="font-medium">{item.name}</p>
                        <p className="text-sm text-muted-foreground capitalize">
                          {item.type}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center text-sm text-muted-foreground">
                      <Clock className="mr-1 h-3 w-3" />
                      {formatDate(item.updatedAt)}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="quick" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Quick Access</CardTitle>
              <CardDescription>
                Shortcuts to frequently used items
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                <Button asChild variant="outline" className="h-auto flex-col px-4 py-8">
                  <Link href="/dashboard/assets">
                    <Database className="mb-2 h-8 w-8" />
                    <span>View All Assets</span>
                  </Link>
                </Button>

                <Button asChild variant="outline" className="h-auto flex-col px-4 py-8">
                  <Link href="/dashboard/documents">
                    <Files className="mb-2 h-8 w-8" />
                    <span>View All Documents</span>
                  </Link>
                </Button>

                <Button asChild variant="outline" className="h-auto flex-col px-4 py-8">
                  <Link href="/dashboard/passwords">
                    <Key className="mb-2 h-8 w-8" />
                    <span>View All Passwords</span>
                  </Link>
                </Button>

                <Button asChild variant="outline" className="h-auto flex-col px-4 py-8">
                  <Link href="/dashboard/assets/new">
                    <Database className="mb-2 h-8 w-8" />
                    <span>Add New Asset</span>
                  </Link>
                </Button>

                <Button asChild variant="outline" className="h-auto flex-col px-4 py-8">
                  <Link href="/dashboard/documents/new">
                    <Files className="mb-2 h-8 w-8" />
                    <span>Create Document</span>
                  </Link>
                </Button>

                <Button asChild variant="outline" className="h-auto flex-col px-4 py-8">
                  <Link href="/dashboard/organizations">
                    <Building className="mb-2 h-8 w-8" />
                    <span>Manage Organizations</span>
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
