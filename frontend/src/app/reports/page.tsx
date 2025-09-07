import { Button } from "@/components/ui/button";
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
import { BarChart, Download, FileText, PieChart } from "lucide-react";

// Mock data for available reports
const AVAILABLE_REPORTS = [
  {
    id: "r1",
    title: "Monthly Income Report",
    description: "Overview of rental income for the current month",
    category: "financial",
    lastGenerated: "2023-05-15",
  },
  {
    id: "r2",
    title: "Occupancy Rate Report",
    description: "Analysis of apartment occupancy rates",
    category: "operational",
    lastGenerated: "2023-05-10",
  },
  {
    id: "r3",
    title: "Outstanding Payments Report",
    description: "List of all pending and overdue payments",
    category: "financial",
    lastGenerated: "2023-05-16",
  },
  {
    id: "r4",
    title: "Maintenance Requests Report",
    description: "Summary of maintenance requests and their statuses",
    category: "maintenance",
    lastGenerated: "2023-05-12",
  },
  {
    id: "r5",
    title: "Yearly Revenue Comparison",
    description: "Comparison of revenue over the past 3 years",
    category: "financial",
    lastGenerated: "2023-04-30",
  },
];

// Mock data for report charts
const MOCK_MONTHLY_INCOME = [
  { month: "Jan", income: 15000 },
  { month: "Feb", income: 16500 },
  { month: "Mar", income: 14800 },
  { month: "Apr", income: 16200 },
  { month: "May", income: 17500 },
];

const MOCK_OCCUPANCY_RATE = [
  { status: "Occupied", count: 42 },
  { status: "Vacant", count: 8 },
  { status: "Maintenance", count: 3 },
  { status: "Reserved", count: 2 },
];

export default function ReportsPage() {
  return (
    <div className="container mx-auto py-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Reports</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Income Overview Card */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <div>
              <CardTitle className="text-xl">Monthly Income</CardTitle>
              <CardDescription>Last 5 months income overview</CardDescription>
            </div>
            <BarChart className="h-5 w-5 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {/* Placeholder for chart - in a real app, use a chart library */}
            <div className="h-[200px] bg-muted/20 rounded-md flex items-center justify-center">
              <span className="text-muted-foreground">
                Income Chart Visualization
              </span>
            </div>
            <div className="mt-4 space-y-2">
              {MOCK_MONTHLY_INCOME.map((item) => (
                <div
                  key={item.month}
                  className="flex items-center justify-between"
                >
                  <span>{item.month}</span>
                  <span className="font-medium">
                    ${item.income.toLocaleString()}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Occupancy Rate Card */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <div>
              <CardTitle className="text-xl">Occupancy Rate</CardTitle>
              <CardDescription>
                Current property occupancy status
              </CardDescription>
            </div>
            <PieChart className="h-5 w-5 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {/* Placeholder for chart - in a real app, use a chart library */}
            <div className="h-[200px] bg-muted/20 rounded-md flex items-center justify-center">
              <span className="text-muted-foreground">Occupancy Pie Chart</span>
            </div>
            <div className="mt-4 grid grid-cols-2 gap-4">
              {MOCK_OCCUPANCY_RATE.map((item) => (
                <div
                  key={item.status}
                  className="flex items-center justify-between"
                >
                  <span>{item.status}</span>
                  <span className="font-medium">{item.count} units</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Available Reports</CardTitle>
          <CardDescription>
            Generate and download detailed reports for your property management.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Report Title</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Last Generated</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {AVAILABLE_REPORTS.map((report) => (
                <TableRow key={report.id}>
                  <TableCell className="font-medium flex items-center gap-2">
                    <FileText className="h-4 w-4" />
                    {report.title}
                  </TableCell>
                  <TableCell>{report.description}</TableCell>
                  <TableCell className="capitalize">
                    {report.category}
                  </TableCell>
                  <TableCell>
                    {new Date(report.lastGenerated).toLocaleDateString()}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button variant="outline" size="sm">
                        Generate
                      </Button>
                      <Button variant="ghost" size="icon">
                        <Download className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
