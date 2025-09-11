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
import { PlusCircle, Search } from "lucide-react";

// Mock data for tenants
const MOCK_TENANTS = [
  {
    id: "t1",
    name: "John Doe",
    email: "john.doe@example.com",
    phone: "+1234567890",
    leaseStart: "2023-01-01",
    leaseEnd: "2024-01-01",
    apartmentId: "A101",
    status: "active",
  },
  {
    id: "t2",
    name: "Jane Smith",
    email: "jane.smith@example.com",
    phone: "+1234567891",
    leaseStart: "2023-02-15",
    leaseEnd: "2024-02-15",
    apartmentId: "B202",
    status: "active",
  },
  {
    id: "t3",
    name: "Robert Johnson",
    email: "robert.j@example.com",
    phone: "+1234567892",
    leaseStart: "2023-03-10",
    leaseEnd: "2023-12-10",
    apartmentId: "C303",
    status: "pending",
  },
  {
    id: "t4",
    name: "Emily Wilson",
    email: "emily.w@example.com",
    phone: "+1234567893",
    leaseStart: "2022-11-05",
    leaseEnd: "2023-11-05",
    apartmentId: "D404",
    status: "inactive",
  },
  {
    id: "t5",
    name: "Michael Brown",
    email: "michael.b@example.com",
    phone: "+1234567894",
    leaseStart: "2023-06-20",
    leaseEnd: "2024-06-20",
    apartmentId: "E505",
    status: "active",
  },
];

export default function TenantsPage() {
  return (
    <div className="py-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-semibold">Tenants</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Manage tenant information and leases
          </p>
        </div>
        <Button className="flex items-center gap-2">
          <PlusCircle className="h-4 w-4" />
          Add Tenant
        </Button>
      </div>

      <div className="bg-background rounded-xl shadow-sm border p-4 mb-6">
        <div className="flex items-center gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Find tenant by name, email, or apartment..."
              className="pl-9"
            />
          </div>
          <Button variant="outline" size="icon" className="h-10 w-10">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="lucide lucide-filter"
            >
              <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" />
            </svg>
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {MOCK_TENANTS.map((tenant) => (
            <div
              key={tenant.id}
              className="bg-secondary/20 rounded-lg p-4 hover:bg-secondary/40 transition-colors group relative"
            >
              <div className="absolute top-3 right-3">
                <Badge
                  variant="outline"
                  className={`capitalize ${
                    tenant.status === "active"
                      ? "bg-emerald-100 text-emerald-700 border-emerald-200"
                      : tenant.status === "pending"
                      ? "bg-amber-100 text-amber-700 border-amber-200"
                      : "bg-slate-100 text-slate-700 border-slate-200"
                  }`}
                >
                  {tenant.status}
                </Badge>
              </div>

              <div className="flex items-center mb-3">
                <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-sm font-medium mr-3">
                  {tenant.name
                    .split(" ")
                    .map((part) => part[0])
                    .join("")}
                </div>
                <div>
                  <h3 className="font-medium">{tenant.name}</h3>
                  <p className="text-xs text-muted-foreground">
                    {tenant.email}
                  </p>
                </div>
              </div>

              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <div className="flex items-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="14"
                      height="14"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="mr-2 text-muted-foreground"
                    >
                      <path d="M19 21V5a2 2 0 0 0-2-2H7a2 2 0 0 0-2 2v16" />
                      <path d="M1 21h22" />
                      <path d="M18 21v-4h-6v4" />
                      <path d="M6 21v-2" />
                      <path d="M2 9h20" />
                      <path d="M2 13h20" />
                      <path d="M2 17h20" />
                    </svg>
                    <span>Apartment</span>
                  </div>
                  <span className="font-medium">{tenant.apartmentId}</span>
                </div>

                <div className="flex justify-between">
                  <div className="flex items-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="14"
                      height="14"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="mr-2 text-muted-foreground"
                    >
                      <rect width="18" height="18" x="3" y="4" rx="2" ry="2" />
                      <line x1="16" x2="16" y1="2" y2="6" />
                      <line x1="8" x2="8" y1="2" y2="6" />
                      <line x1="3" x2="21" y1="10" y2="10" />
                    </svg>
                    <span>Lease Period</span>
                  </div>
                  <span className="font-medium">
                    {new Date(tenant.leaseStart).toLocaleDateString()} -{" "}
                    {new Date(tenant.leaseEnd).toLocaleDateString()}
                  </span>
                </div>

                <div className="flex justify-between">
                  <div className="flex items-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="14"
                      height="14"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="mr-2 text-muted-foreground"
                    >
                      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                    </svg>
                    <span>Phone</span>
                  </div>
                  <span className="font-medium">{tenant.phone}</span>
                </div>
              </div>

              <div className="mt-4 pt-4 border-t border-border flex justify-between">
                <Button variant="ghost" size="sm" className="text-xs px-2 h-8">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="mr-1"
                  >
                    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                  </svg>
                  Edit Details
                </Button>
                <Button variant="ghost" size="sm" className="text-xs px-2 h-8">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="mr-1"
                  >
                    <rect width="18" height="18" x="3" y="4" rx="2" ry="2" />
                    <line x1="16" x2="16" y1="2" y2="6" />
                    <line x1="8" x2="8" y1="2" y2="6" />
                    <line x1="3" x2="21" y1="10" y2="10" />
                  </svg>
                  Lease Info
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
