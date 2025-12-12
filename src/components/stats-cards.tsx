
"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DollarSign, Ticket, Calendar, TrendingUp } from "lucide-react";

interface StatsCardsProps {
    todaysRevenue: number;
    todaysTickets: number;
    weeklyRevenue?: number;
    monthlyRevenue?: number;
}

export function StatsCards({ todaysRevenue, todaysTickets, weeklyRevenue = 0, monthlyRevenue = 0 }: StatsCardsProps) {
    return (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Today's Revenue</CardTitle>
                    <DollarSign className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">ETB {todaysRevenue.toFixed(2)}</div>
                    <p className="text-xs text-muted-foreground">Total for today</p>
                </CardContent>
            </Card>
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Today's Tickets</CardTitle>
                    <Ticket className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">+{todaysTickets}</div>
                    <p className="text-xs text-muted-foreground">Tickets generated today</p>
                </CardContent>
            </Card>
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Weekly Revenue</CardTitle>
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">ETB {weeklyRevenue.toFixed(2)}</div>
                    <p className="text-xs text-muted-foreground">Last 7 days</p>
                </CardContent>
            </Card>
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Monthly Revenue</CardTitle>
                    <TrendingUp className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">ETB {monthlyRevenue.toFixed(2)}</div>
                    <p className="text-xs text-muted-foreground">This month</p>
                </CardContent>
            </Card>
        </div>
    )
}
