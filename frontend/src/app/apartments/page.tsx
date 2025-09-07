import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { BuildingIcon, Home, PlusCircle, Search } from "lucide-react";

// Mock data for apartments
const apartmentsData = {
  apartments: [
    {
      id: 1,
      number: "A101",
      floor: 1,
      building: "A",
      status: "Occupied",
      tenant: "John Doe",
      rent: 1200,
      bedrooms: 2,
      bathrooms: 1,
      squareFeet: 850,
    },
    {
      id: 2,
      number: "A102",
      floor: 1,
      building: "A",
      status: "Vacant",
      tenant: null,
      rent: 1100,
      bedrooms: 1,
      bathrooms: 1,
      squareFeet: 650,
    },
    {
      id: 3,
      number: "B205",
      floor: 2,
      building: "B",
      status: "Occupied",
      tenant: "Sarah Johnson",
      rent: 950,
      bedrooms: 1,
      bathrooms: 1,
      squareFeet: 600,
    },
    {
      id: 4,
      number: "C310",
      floor: 3,
      building: "C",
      status: "Occupied",
      tenant: "Michael Brown",
      rent: 1400,
      bedrooms: 3,
      bathrooms: 2,
      squareFeet: 1100,
    },
    {
      id: 5,
      number: "A204",
      floor: 2,
      building: "A",
      status: "Occupied",
      tenant: "Lisa Wilson",
      rent: 1100,
      bedrooms: 2,
      bathrooms: 1,
      squareFeet: 800,
    },
    {
      id: 6,
      number: "B110",
      floor: 1,
      building: "B",
      status: "Occupied",
      tenant: "Robert Chen",
      rent: 1300,
      bedrooms: 2,
      bathrooms: 2,
      squareFeet: 950,
    },
  ],
};

export default function ApartmentsPage() {
  return (
    <div className="container mx-auto py-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Apartments</h1>
        <Button className="flex items-center gap-2">
          <PlusCircle className="h-4 w-4" />
          Add Apartment
        </Button>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-4 mb-6">
        <div className="flex-1 flex items-center space-x-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input placeholder="Search apartments..." className="pl-9" />
          </div>
          <select className="h-10 rounded-md border border-input px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2">
            <option value="">All Buildings</option>
            <option value="A">Building A</option>
            <option value="B">Building B</option>
            <option value="C">Building C</option>
          </select>
          <select className="h-10 rounded-md border border-input px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2">
            <option value="">All Status</option>
            <option value="Occupied">Occupied</option>
            <option value="Vacant">Vacant</option>
          </select>
        </div>
      </div>

      {/* Apartments Grid */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {apartmentsData.apartments.map((apartment) => (
          <Card key={apartment.id} className="overflow-hidden group hover:shadow-md transition-all duration-200 bg-background">
            <div className={`h-28 flex items-center justify-center ${apartment.status === "Vacant" ? "bg-secondary/70" : "bg-primary/5"}`}>
              <div className="flex flex-col items-center">
                <div className="text-3xl font-bold">{apartment.number}</div>
                <div className={`text-xs mt-1 px-3 py-1 rounded-full ${
                  apartment.status === "Vacant" 
                    ? "bg-emerald-100 text-emerald-700" 
                    : "bg-amber-100 text-amber-700"
                }`}>
                  {apartment.status}
                </div>
              </div>
            </div>
            <CardContent className="p-5">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <BuildingIcon className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm font-medium">Building {apartment.building}, Floor {apartment.floor}</span>
                </div>
              </div>
              
              <div className="grid grid-cols-3 gap-2 mb-4">
                <div className="bg-secondary/50 rounded-lg p-3 flex flex-col items-center justify-center">
                  <span className="text-xs text-muted-foreground">Bedrooms</span>
                  <span className="font-bold">{apartment.bedrooms}</span>
                </div>
                <div className="bg-secondary/50 rounded-lg p-3 flex flex-col items-center justify-center">
                  <span className="text-xs text-muted-foreground">Baths</span>
                  <span className="font-bold">{apartment.bathrooms}</span>
                </div>
                <div className="bg-secondary/50 rounded-lg p-3 flex flex-col items-center justify-center">
                  <span className="text-xs text-muted-foreground">Area</span>
                  <span className="font-bold">{apartment.squareFeet}<span className="text-xs">ft²</span></span>
                </div>
              </div>
              
              <div className="flex items-center justify-between mb-4">
                <div className="font-medium text-lg">${apartment.rent}<span className="text-xs text-muted-foreground">/month</span></div>
                <div className="text-xs px-3 py-1 bg-secondary rounded-full">
                  {apartment.tenant ? "Rented" : "Available"}
                </div>
              </div>
              
              {apartment.tenant && (
                <div className="py-2 px-3 bg-secondary/30 rounded-lg mb-4">
                  <div className="text-xs text-muted-foreground mb-1">Current Tenant</div>
                  <div className="font-medium">{apartment.tenant}</div>
                </div>
              )}
              
              <div className="flex justify-between mt-4">
                <Button variant="outline" size="sm" className="w-1/2 mr-2">
                  Details
                </Button>
                <Button variant="default" size="sm" className="w-1/2">
                  {apartment.status === "Vacant" ? "Assign Tenant" : "Manage"}
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
