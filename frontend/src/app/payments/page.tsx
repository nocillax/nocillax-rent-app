import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { FilePlus, Search } from "lucide-react";
import { Badge } from "@/components/ui/badge";

// Mock data for payments
const MOCK_PAYMENTS = [
  {
    id: "p1",
    tenantName: "John Doe",
    apartmentId: "A101",
    amount: 1200,
    date: "2023-05-01",
    method: "bank_transfer",
    status: "completed",
  },
  {
    id: "p2",
    tenantName: "Jane Smith",
    apartmentId: "B202",
    amount: 1500,
    date: "2023-05-03",
    method: "credit_card",
    status: "completed",
  },
  {
    id: "p3",
    tenantName: "Robert Johnson",
    apartmentId: "C303",
    amount: 1350,
    date: "2023-05-05",
    method: "cash",
    status: "pending",
  },
  {
    id: "p4",
    tenantName: "Emily Wilson",
    apartmentId: "D404",
    amount: 1100,
    date: "2023-04-29",
    method: "bank_transfer",
    status: "completed",
  },
  {
    id: "p5",
    tenantName: "Michael Brown",
    apartmentId: "E505",
    amount: 1450,
    date: "2023-04-25",
    method: "credit_card",
    status: "failed",
  },
];

// Helper function to format currency
const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(amount);
};

// Helper function to format payment method
const formatPaymentMethod = (method: string) => {
  return method
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
};

export default function PaymentsPage() {
  return (
    <div className="py-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-semibold">Payments</h1>
          <p className="text-sm text-muted-foreground mt-1">Track and manage payment records</p>
        </div>
        <Button className="flex items-center gap-2">
          <FilePlus className="h-4 w-4" />
          Record Payment
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-background rounded-lg p-4 shadow-sm border">
          <div className="text-sm text-muted-foreground mb-1">Total Collected</div>
          <div className="text-2xl font-semibold">$5,600</div>
          <div className="flex items-center text-xs text-emerald-600 mt-1">
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-1"><path d="m6 9 6-6 6 6"/><path d="M6 12h12"/><path d="m6 15 6 6 6-6"/></svg>
            8% from last month
          </div>
        </div>
        
        <div className="bg-background rounded-lg p-4 shadow-sm border">
          <div className="text-sm text-muted-foreground mb-1">Outstanding Payments</div>
          <div className="text-2xl font-semibold">$1,350</div>
          <div className="flex items-center text-xs text-amber-600 mt-1">
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-1"><path d="M12 5v14"/><path d="M19 12H5"/></svg>
            1 pending payment
          </div>
        </div>
        
        <div className="bg-background rounded-lg p-4 shadow-sm border">
          <div className="text-sm text-muted-foreground mb-1">Failed Transactions</div>
          <div className="text-2xl font-semibold">$1,450</div>
          <div className="flex items-center text-xs text-red-600 mt-1">
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-1"><path d="M12 5v14"/><path d="M18 11H6"/></svg>
            1 failed payment
          </div>
        </div>
      </div>

      <div className="bg-background rounded-lg p-4 shadow-sm border mb-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-medium">Recent Payments</h2>
          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input placeholder="Search payments..." className="w-60 pl-9" />
            </div>
            <Button variant="outline" size="icon" className="h-10 w-10">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"/></svg>
            </Button>
          </div>
        </div>

        <div className="rounded-lg border overflow-hidden">
          <div className="grid grid-cols-7 bg-secondary/50 px-4 py-3 text-sm font-medium">
            <div>Tenant</div>
            <div>Apartment</div>
            <div>Amount</div>
            <div>Date</div>
            <div>Method</div>
            <div>Status</div>
            <div className="text-right">Actions</div>
          </div>
          
          <div className="divide-y">
            {MOCK_PAYMENTS.map((payment) => (
              <div key={payment.id} className="grid grid-cols-7 px-4 py-3 hover:bg-secondary/20 transition-colors">
                <div className="font-medium">{payment.tenantName}</div>
                <div>{payment.apartmentId}</div>
                <div className="font-medium">{formatCurrency(payment.amount)}</div>
                <div>{new Date(payment.date).toLocaleDateString()}</div>
                <div className="flex items-center">
                  {payment.method === "bank_transfer" && (
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2 text-blue-600"><rect width="20" height="14" x="2" y="5" rx="2"/><line x1="2" x2="22" y1="10" y2="10"/></svg>
                  )}
                  {payment.method === "credit_card" && (
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2 text-indigo-600"><rect width="20" height="14" x="2" y="5" rx="2"/><line x1="2" x2="22" y1="10" y2="10"/></svg>
                  )}
                  {payment.method === "cash" && (
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2 text-emerald-600"><circle cx="12" cy="12" r="8"/><line x1="12" x2="12" y1="8" y2="12"/><line x1="12" x2="14.5" y1="12" y2="14.5"/></svg>
                  )}
                  {formatPaymentMethod(payment.method)}
                </div>
                <div>
                  <span className={`inline-flex items-center rounded-full px-2 py-1 text-xs ${
                    payment.status === "completed"
                      ? "bg-emerald-100 text-emerald-700"
                      : payment.status === "pending"
                      ? "bg-amber-100 text-amber-700"
                      : "bg-red-100 text-red-700"
                  }`}>
                    {payment.status === "completed" && <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-1"><path d="M20 6 9 17l-5-5"/></svg>}
                    {payment.status === "pending" && <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-1"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>}
                    {payment.status === "failed" && <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-1"><line x1="18" x2="6" y1="6" y2="18"/><line x1="6" x2="18" y1="6" y2="18"/></svg>}
                    {payment.status}
                  </span>
                </div>
                <div className="text-right">
                  <Button variant="ghost" size="sm" className="h-8 px-2">
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-1"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/></svg>
                    Details
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        <div className="flex justify-between mt-4 text-sm">
          <div className="text-muted-foreground">Showing 5 of 24 payments</div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" className="h-8 px-2">Previous</Button>
            <Button variant="outline" size="sm" className="h-8 px-2">Next</Button>
          </div>
        </div>
      </div>
    </div>
  );
}
