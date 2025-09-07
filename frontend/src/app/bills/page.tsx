import { Badge } from "@/components/ui/badge";
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
import { FileEdit, Search } from "lucide-react";

// Mock data for bills
const MOCK_BILLS = [
  {
    id: "b1",
    tenantName: "John Doe",
    apartmentId: "A101",
    amount: 1200,
    dueDate: "2023-06-01",
    category: "rent",
    status: "paid",
  },
  {
    id: "b2",
    tenantName: "Jane Smith",
    apartmentId: "B202",
    amount: 1500,
    dueDate: "2023-06-01",
    category: "rent",
    status: "pending",
  },
  {
    id: "b3",
    tenantName: "Robert Johnson",
    apartmentId: "C303",
    amount: 1350,
    dueDate: "2023-06-01",
    category: "rent",
    status: "overdue",
  },
  {
    id: "b4",
    tenantName: "Emily Wilson",
    apartmentId: "D404",
    amount: 100,
    dueDate: "2023-06-05",
    category: "maintenance",
    status: "pending",
  },
  {
    id: "b5",
    tenantName: "Michael Brown",
    apartmentId: "E505",
    amount: 150,
    dueDate: "2023-05-25",
    category: "utilities",
    status: "paid",
  },
];

// Helper function to format currency
const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(amount);
};

// Helper function to format category
const formatCategory = (category: string) => {
  return category.charAt(0).toUpperCase() + category.slice(1);
};

export default function BillsPage() {
  return (
    <div className="py-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-semibold">Bills</h1>
          <p className="text-sm text-muted-foreground mt-1">Manage rent and additional charges</p>
        </div>
        <Button className="flex items-center gap-2">
          <FileEdit className="h-4 w-4" />
          Generate Bill
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-background rounded-lg p-4 shadow-sm border">
          <div className="text-sm text-muted-foreground mb-1">Total Bills (This Month)</div>
          <div className="text-2xl font-semibold">$4,300</div>
          <div className="flex items-center text-xs mt-1">
            <div className="flex gap-2">
              <div className="flex items-center">
                <span className="h-2 w-2 rounded-full bg-emerald-500 mr-1"></span>
                <span className="text-muted-foreground">Paid: $1,350</span>
              </div>
              <div className="flex items-center">
                <span className="h-2 w-2 rounded-full bg-amber-500 mr-1"></span>
                <span className="text-muted-foreground">Pending: $1,600</span>
              </div>
              <div className="flex items-center">
                <span className="h-2 w-2 rounded-full bg-red-500 mr-1"></span>
                <span className="text-muted-foreground">Overdue: $1,350</span>
              </div>
            </div>
          </div>
        </div>
        
        <div className="bg-background rounded-lg p-4 shadow-sm border">
          <div className="text-sm text-muted-foreground mb-1">Due Soon (Next 7 Days)</div>
          <div className="text-2xl font-semibold">$1,600</div>
          <div className="flex items-center text-xs text-amber-600 mt-1">
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-1"><rect width="18" height="18" x="3" y="4" rx="2" ry="2"/><line x1="16" x2="16" y1="2" y2="6"/><line x1="8" x2="8" y1="2" y2="6"/><line x1="3" x2="21" y1="10" y2="10"/></svg>
            2 bills due on June 1st
          </div>
        </div>
        
        <div className="bg-background rounded-lg p-4 shadow-sm border">
          <div className="text-sm text-muted-foreground mb-1">Overdue Bills</div>
          <div className="text-2xl font-semibold">$1,350</div>
          <div className="flex items-center text-xs text-red-600 mt-1">
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-1"><path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" x2="12" y1="9" y2="13"/><line x1="12" x2="12.01" y1="17" y2="17"/></svg>
            1 bill overdue by 5+ days
          </div>
        </div>
      </div>

      <div className="bg-background rounded-lg shadow-sm border mb-6">
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-lg font-medium">Current Bills</h2>
          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input placeholder="Search bills..." className="w-60 pl-9" />
            </div>
            <Button variant="outline" size="sm">
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2"><polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"/></svg>
              Filter
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2 p-4">
          {MOCK_BILLS.map((bill) => (
            <div key={bill.id} className={`
              border rounded-lg p-4 hover:bg-secondary/10 transition-colors relative
              ${bill.status === "overdue" ? "border-red-200" : ""}
            `}>
              {bill.status === "overdue" && (
                <div className="absolute -top-2 -right-2 h-5 w-5 rounded-full bg-red-500 flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" x2="12" y1="9" y2="13"/><line x1="12" x2="12.01" y1="17" y2="17"/></svg>
                </div>
              )}
              
              <div className="flex justify-between mb-2">
                <div className="flex items-center">
                  <div className={`
                    h-8 w-8 rounded-full mr-2 flex items-center justify-center
                    ${bill.category === "rent" ? "bg-blue-100" : bill.category === "maintenance" ? "bg-amber-100" : "bg-violet-100"}
                  `}>
                    {bill.category === "rent" && (
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-blue-700"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
                    )}
                    {bill.category === "maintenance" && (
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-amber-700"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>
                    )}
                    {bill.category === "utilities" && (
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-violet-700"><path d="M18 20V6a2 2 0 0 0-2-2H8a2 2 0 0 0-2 2v14"/><path d="M2 20h20"/><path d="M14 12v.01"/></svg>
                    )}
                  </div>
                  <div>
                    <h3 className="text-sm font-medium">{formatCategory(bill.category)}</h3>
                    <p className="text-xs text-muted-foreground">{bill.apartmentId}</p>
                  </div>
                </div>
                
                <div className={`
                  px-2 py-1 rounded-full text-xs font-medium self-start
                  ${bill.status === "paid" ? "bg-emerald-100 text-emerald-700" : 
                    bill.status === "pending" ? "bg-amber-100 text-amber-700" : 
                    "bg-red-100 text-red-700"}
                `}>
                  {bill.status}
                </div>
              </div>
              
              <div className="flex justify-between items-end mb-2">
                <div>
                  <div className="text-xs text-muted-foreground">Amount</div>
                  <div className="text-lg font-semibold">{formatCurrency(bill.amount)}</div>
                </div>
                <div>
                  <div className="text-xs text-muted-foreground text-right">Due Date</div>
                  <div className="font-medium">{new Date(bill.dueDate).toLocaleDateString()}</div>
                </div>
              </div>
              
              <div className="text-sm mb-4">
                <span className="text-muted-foreground">Tenant:</span> {bill.tenantName}
              </div>
              
              <div className="flex justify-between">
                <Button variant="outline" size="sm" className="text-xs h-8 px-2">
                  Send Reminder
                </Button>
                <Button 
                  variant={bill.status === "paid" ? "outline" : "default"} 
                  size="sm" 
                  className="text-xs h-8 px-2"
                >
                  {bill.status === "paid" ? "View Receipt" : "Mark as Paid"}
                </Button>
              </div>
            </div>
          ))}
        </div>
        
        <div className="p-4 border-t">
          <div className="flex justify-between text-sm">
            <div className="text-muted-foreground">Showing 5 of 12 bills</div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" className="h-8 px-3">Previous</Button>
              <Button variant="outline" size="sm" className="h-8 px-3">Next</Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
