import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import {
  ArrowRight,
  ArrowUpRight,
  Building,
  Calendar,
  Clock,
  DollarSign,
  Home,
  PercentIcon,
  Receipt,
  TrendingUp,
  Users,
  Wallet,
} from "lucide-react";

// Mock data for dashboard
const dashboardData = {
  totalCollected: 45800,
  outstandingDues: 12500,
  occupancyRate: 87,
  totalApartments: 28,
  occupiedApartments: 24,
  recentPayments: [
    {
      id: 1,
      tenantName: "John Doe",
      amount: 1200,
      date: "2025-09-05",
      apartment: "A101",
      status: "Completed",
    },
    {
      id: 2,
      tenantName: "Sarah Johnson",
      amount: 950,
      date: "2025-09-04",
      apartment: "B205",
      status: "Completed",
    },
    {
      id: 3,
      tenantName: "Michael Brown",
      amount: 1400,
      date: "2025-09-03",
      apartment: "C310",
      status: "Completed",
    },
  ],
  upcomingBills: [
    {
      id: 1,
      tenantName: "Lisa Wilson",
      amount: 1100,
      dueDate: "2025-09-15",
      apartment: "A204",
      daysRemaining: 10,
    },
    {
      id: 2,
      tenantName: "Robert Chen",
      amount: 1300,
      dueDate: "2025-09-15",
      apartment: "B110",
      daysRemaining: 10,
    },
    {
      id: 3,
      tenantName: "Emma Davis",
      amount: 900,
      dueDate: "2025-09-15",
      apartment: "C205",
      daysRemaining: 10,
    },
  ],
  tenantStatus: [
    {
      id: 1,
      name: "Current",
      count: 24,
      color: "bg-emerald-500/80",
    },
    {
      id: 2,
      name: "Late Payment",
      count: 3,
      color: "bg-amber-400/80",
    },
    {
      id: 3,
      name: "Overdue",
      count: 1,
      color: "bg-rose-400/80",
    },
  ],
  tenantTypes: {
    new: 5,
    renewing: 19,
    leaving: 3,
  },
  apartmentTypes: {
    studio: 8,
    oneBedroom: 12,
    twoBedroom: 6,
    threeBedroom: 2,
  }
};

export default function DashboardPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-medium tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground mt-1">
            Overview of your property management metrics
          </p>
        </div>
        <div className="flex items-center gap-2 text-sm text-muted-foreground bg-background/60 px-3 py-1.5 rounded-md border">
          <Clock className="h-4 w-4" />
          Last updated: {new Date().toLocaleDateString()}
        </div>
      </div>

      {/* Key Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <Card className="bg-card/50 border shadow-sm">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
              <div className="bg-primary/10 text-primary p-1.5 rounded-full">
                <DollarSign className="h-4 w-4" />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-semibold">
              ${dashboardData.totalCollected.toLocaleString()}
            </div>
            <div className="flex items-center mt-1 text-xs font-medium text-emerald-500">
              <TrendingUp className="mr-1 h-3 w-3" />
              <span>12% from last month</span>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card/50 border shadow-sm">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium">Outstanding</CardTitle>
              <div className="bg-amber-100 text-amber-600 p-1.5 rounded-full">
                <Receipt className="h-4 w-4" />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-semibold">
              ${dashboardData.outstandingDues.toLocaleString()}
            </div>
            <div className="flex items-center mt-1 text-xs font-medium text-amber-500">
              <TrendingUp className="mr-1 h-3 w-3" />
              <span>3% from last month</span>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card/50 border shadow-sm">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium">Occupancy</CardTitle>
              <div className="bg-violet-100 text-violet-600 p-1.5 rounded-full">
                <PercentIcon className="h-4 w-4" />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-semibold">{dashboardData.occupancyRate}%</div>
            <div className="mt-1.5">
              <Progress
                value={dashboardData.occupancyRate}
                className="h-1.5 bg-muted"
                indicatorClassName="bg-violet-500"
              />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card/50 border shadow-sm">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium">Units</CardTitle>
              <div className="bg-blue-100 text-blue-600 p-1.5 rounded-full">
                <Building className="h-4 w-4" />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex items-end gap-1">
              <span className="text-2xl font-semibold">{dashboardData.occupiedApartments}</span>
              <span className="text-muted-foreground text-sm mb-1">/ {dashboardData.totalApartments}</span>
            </div>
            <div className="flex gap-2 mt-2">
              <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-200">
                {dashboardData.occupiedApartments} Occupied
              </Badge>
              <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                {dashboardData.totalApartments - dashboardData.occupiedApartments} Available
              </Badge>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabbed Content */}
      <Tabs defaultValue="financial" className="mb-8">
        <TabsList className="mb-4 bg-muted/50">
          <TabsTrigger value="financial" className="gap-1">
            <Wallet className="h-4 w-4" /> Financial
          </TabsTrigger>
          <TabsTrigger value="property" className="gap-1">
            <Home className="h-4 w-4" /> Property
          </TabsTrigger>
          <TabsTrigger value="tenants" className="gap-1">
            <Users className="h-4 w-4" /> Tenants
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="financial" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Recent Payments */}
            <Card className="bg-card/50 border shadow-sm">
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Recent Payments</CardTitle>
                    <CardDescription>Latest transactions processed</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {dashboardData.recentPayments.map((payment) => (
                    <div key={payment.id} className="flex items-center justify-between border-b pb-3 last:border-0">
                      <div className="flex items-center gap-3">
                        <div className="bg-emerald-100 text-emerald-700 p-2 rounded-full">
                          <DollarSign className="h-3.5 w-3.5" />
                        </div>
                        <div>
                          <div className="font-medium text-sm">{payment.tenantName}</div>
                          <div className="text-xs text-muted-foreground flex items-center gap-1">
                            <Home className="h-3 w-3" /> {payment.apartment}
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-medium">${payment.amount}</div>
                        <div className="text-xs text-muted-foreground">{payment.date}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
              <CardFooter className="pt-0">
                <Button variant="ghost" size="sm" className="w-full gap-1" asChild>
                  <a href="/payments">
                    View all payments <ArrowRight className="h-3.5 w-3.5" />
                  </a>
                </Button>
              </CardFooter>
            </Card>

            {/* Upcoming Bills */}
            <Card className="bg-card/50 border shadow-sm">
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Upcoming Bills</CardTitle>
                    <CardDescription>Due in the next 30 days</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {dashboardData.upcomingBills.map((bill) => (
                    <div key={bill.id} className="flex items-center justify-between border-b pb-3 last:border-0">
                      <div className="flex items-center gap-3">
                        <div className="bg-amber-100 text-amber-700 p-2 rounded-full">
                          <Calendar className="h-3.5 w-3.5" />
                        </div>
                        <div>
                          <div className="font-medium text-sm">{bill.tenantName}</div>
                          <div className="text-xs text-muted-foreground flex items-center gap-1">
                            <Home className="h-3 w-3" /> {bill.apartment}
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-medium">${bill.amount}</div>
                        <div className="text-xs text-muted-foreground flex items-center justify-end gap-1">
                          <Clock className="h-3 w-3" />
                          {bill.daysRemaining} days left
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
              <CardFooter className="pt-0">
                <Button variant="ghost" size="sm" className="w-full gap-1" asChild>
                  <a href="/bills">
                    View all bills <ArrowRight className="h-3.5 w-3.5" />
                  </a>
                </Button>
              </CardFooter>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="property" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card className="bg-card/50 border shadow-sm">
              <CardHeader>
                <CardTitle>Apartment Types</CardTitle>
                <CardDescription>Distribution of apartment units</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="bg-blue-100 text-blue-600 p-1.5 rounded-full">
                        <Home className="h-4 w-4" />
                      </div>
                      <div>Studio</div>
                    </div>
                    <div className="font-medium">{dashboardData.apartmentTypes.studio}</div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="bg-indigo-100 text-indigo-600 p-1.5 rounded-full">
                        <Home className="h-4 w-4" />
                      </div>
                      <div>1 Bedroom</div>
                    </div>
                    <div className="font-medium">{dashboardData.apartmentTypes.oneBedroom}</div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="bg-violet-100 text-violet-600 p-1.5 rounded-full">
                        <Home className="h-4 w-4" />
                      </div>
                      <div>2 Bedroom</div>
                    </div>
                    <div className="font-medium">{dashboardData.apartmentTypes.twoBedroom}</div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="bg-purple-100 text-purple-600 p-1.5 rounded-full">
                        <Home className="h-4 w-4" />
                      </div>
                      <div>3 Bedroom</div>
                    </div>
                    <div className="font-medium">{dashboardData.apartmentTypes.threeBedroom}</div>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="pt-0">
                <Button variant="ghost" size="sm" className="w-full gap-1" asChild>
                  <a href="/apartments">
                    View all apartments <ArrowRight className="h-3.5 w-3.5" />
                  </a>
                </Button>
              </CardFooter>
            </Card>
            
            <Card className="bg-card/50 border shadow-sm">
              <CardHeader>
                <CardTitle>Occupancy Status</CardTitle>
                <CardDescription>Current property occupancy</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col gap-3">
                  <div className="flex flex-wrap items-center gap-4">
                    {dashboardData.tenantStatus.map((status) => (
                      <div key={status.id} className="flex items-center">
                        <div className={`h-3 w-3 rounded-full ${status.color} mr-2`}></div>
                        <div className="text-sm">
                          {status.name}: <span className="font-medium">{status.count}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  <div className="h-3 w-full rounded-full bg-muted/70 overflow-hidden flex mt-1">
                    {dashboardData.tenantStatus.map((status) => (
                      <div
                        key={status.id}
                        className={`h-full ${status.color} transition-all`}
                        style={{
                          width: `${(status.count / dashboardData.totalApartments) * 100}%`,
                        }}
                      ></div>
                    ))}
                  </div>
                  
                  <div className="mt-4 grid grid-cols-2 gap-4">
                    <div className="bg-secondary/30 rounded-lg p-4 text-center">
                      <div className="text-sm font-medium text-muted-foreground">Occupancy</div>
                      <div className="text-2xl font-bold mt-1 text-emerald-600">{dashboardData.occupancyRate}%</div>
                    </div>
                    <div className="bg-secondary/30 rounded-lg p-4 text-center">
                      <div className="text-sm font-medium text-muted-foreground">Vacancy</div>
                      <div className="text-2xl font-bold mt-1 text-blue-600">{100 - dashboardData.occupancyRate}%</div>
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="pt-0">
                <Button variant="ghost" size="sm" className="w-full gap-1" asChild>
                  <a href="/reports">
                    View full report <ArrowRight className="h-3.5 w-3.5" />
                  </a>
                </Button>
              </CardFooter>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="tenants" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card className="bg-card/50 border shadow-sm">
              <CardHeader>
                <CardTitle>Tenant Status</CardTitle>
                <CardDescription>Current tenant status overview</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-3 gap-2 text-center">
                  <div className="bg-secondary/30 rounded-lg p-3">
                    <div className="text-xs text-muted-foreground mb-1">New</div>
                    <div className="text-2xl font-bold text-blue-600">
                      {dashboardData.tenantTypes.new}
                    </div>
                  </div>
                  <div className="bg-secondary/30 rounded-lg p-3">
                    <div className="text-xs text-muted-foreground mb-1">Renewing</div>
                    <div className="text-2xl font-bold text-emerald-600">
                      {dashboardData.tenantTypes.renewing}
                    </div>
                  </div>
                  <div className="bg-secondary/30 rounded-lg p-3">
                    <div className="text-xs text-muted-foreground mb-1">Leaving</div>
                    <div className="text-2xl font-bold text-amber-600">
                      {dashboardData.tenantTypes.leaving}
                    </div>
                  </div>
                </div>
                
                <div className="mt-4 pt-4 border-t">
                  <div className="text-sm font-medium mb-2">Payment Status</div>
                  <div className="space-y-2">
                    {dashboardData.tenantStatus.map((status) => (
                      <div key={status.id} className="flex items-center justify-between">
                        <div className="flex items-center">
                          <div className={`h-2.5 w-2.5 rounded-full ${status.color} mr-2`}></div>
                          <div className="text-sm">{status.name}</div>
                        </div>
                        <div className="text-sm font-medium">{status.count} tenants</div>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
              <CardFooter className="pt-0">
                <Button variant="ghost" size="sm" className="w-full gap-1" asChild>
                  <a href="/tenants">
                    View all tenants <ArrowRight className="h-3.5 w-3.5" />
                  </a>
                </Button>
              </CardFooter>
            </Card>
            
            <Card className="bg-card/50 border shadow-sm">
              <CardHeader>
                <CardTitle>Action Items</CardTitle>
                <CardDescription>Tasks requiring attention</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 bg-rose-50 text-rose-800 rounded-md border border-rose-100">
                    <div className="flex items-center gap-2">
                      <div className="bg-rose-100 p-1 rounded-full">
                        <Clock className="h-4 w-4" />
                      </div>
                      <div className="text-sm font-medium">1 overdue payment</div>
                    </div>
                    <Button size="sm" variant="outline" className="h-7 border-rose-200 bg-rose-50 hover:bg-rose-100">
                      Review
                    </Button>
                  </div>
                  
                  <div className="flex items-center justify-between p-3 bg-amber-50 text-amber-800 rounded-md border border-amber-100">
                    <div className="flex items-center gap-2">
                      <div className="bg-amber-100 p-1 rounded-full">
                        <Calendar className="h-4 w-4" />
                      </div>
                      <div className="text-sm font-medium">3 leases expiring soon</div>
                    </div>
                    <Button size="sm" variant="outline" className="h-7 border-amber-200 bg-amber-50 hover:bg-amber-100">
                      View
                    </Button>
                  </div>
                  
                  <div className="flex items-center justify-between p-3 bg-blue-50 text-blue-800 rounded-md border border-blue-100">
                    <div className="flex items-center gap-2">
                      <div className="bg-blue-100 p-1 rounded-full">
                        <Home className="h-4 w-4" />
                      </div>
                      <div className="text-sm font-medium">2 maintenance requests</div>
                    </div>
                    <Button size="sm" variant="outline" className="h-7 border-blue-200 bg-blue-50 hover:bg-blue-100">
                      Check
                    </Button>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="pt-0">
                <Button variant="ghost" size="sm" className="w-full gap-1">
                  View all action items <ArrowRight className="h-3.5 w-3.5" />
                </Button>
              </CardFooter>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
