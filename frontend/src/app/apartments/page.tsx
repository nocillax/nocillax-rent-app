"use client";

import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Bath,
  Bed,
  Building,
  Eye,
  Home,
  Info,
  MapPin,
  Plus,
  PlusCircle,
  Search,
  Users,
} from "lucide-react";

// Define apartment type
type Apartment = {
  id: number;
  number: string;
  floor: number;
  building: string;
  status: "Vacant" | "Occupied";
  tenant: string | null;
  rent: number;
  bedrooms: number;
  bathrooms: number;
  squareFeet: number;
  leaseEnd: string | null;
  maintenanceRequests: number;
};

// Mock data for apartments
const apartmentsData: { apartments: Apartment[] } = {
  apartments: [
    {
      id: 1,
      number: "B1",
      floor: 1,
      building: "A",
      status: "Occupied",
      tenant: "John Doe",
      rent: 1200,
      bedrooms: 2,
      bathrooms: 1,
      squareFeet: 850,
      leaseEnd: "2025-12-31",
      maintenanceRequests: 0,
    },
    {
      id: 2,
      number: "B2",
      floor: 1,
      building: "A",
      status: "Vacant",
      tenant: null,
      rent: 1100,
      bedrooms: 1,
      bathrooms: 1,
      squareFeet: 650,
      leaseEnd: null,
      maintenanceRequests: 0,
    },
    {
      id: 3,
      number: "C1",
      floor: 2,
      building: "B",
      status: "Occupied",
      tenant: "Sarah Johnson",
      rent: 950,
      bedrooms: 1,
      bathrooms: 1,
      squareFeet: 600,
      leaseEnd: "2026-03-15",
      maintenanceRequests: 1,
    },
    {
      id: 4,
      number: "C2",
      floor: 3,
      building: "C",
      status: "Occupied",
      tenant: "Michael Brown",
      rent: 1400,
      bedrooms: 3,
      bathrooms: 2,
      squareFeet: 1100,
      leaseEnd: "2026-01-10",
      maintenanceRequests: 2,
    },
    {
      id: 5,
      number: "D1",
      floor: 2,
      building: "A",
      status: "Occupied",
      tenant: "Lisa Wilson",
      rent: 1100,
      bedrooms: 2,
      bathrooms: 1,
      squareFeet: 800,
      leaseEnd: "2025-11-20",
      maintenanceRequests: 0,
    },
    {
      id: 6,
      number: "D2",
      floor: 1,
      building: "B",
      status: "Occupied",
      tenant: "Robert Chen",
      rent: 1300,
      bedrooms: 2,
      bathrooms: 2,
      squareFeet: 950,
      leaseEnd: "2026-02-28",
      maintenanceRequests: 0,
    },
  ],
};

export default function ApartmentsPage() {
  const [selectedApartment, setSelectedApartment] = useState<Apartment | null>(
    null
  );
  const [isDetailOpen, setIsDetailOpen] = useState(false);

  const openApartmentDetails = (apartment: Apartment) => {
    setSelectedApartment(apartment);
    setIsDetailOpen(true);
  };

  // Function to determine status badge color
  const getStatusBadgeClass = (status: string) => {
    return status === "Vacant"
      ? "bg-emerald-600 text-white hover:bg-emerald-700 font-semibold"
      : "bg-amber-600 text-white hover:bg-amber-700 font-semibold";
  };

  return (
    <div className="container mx-auto py-6 min-h-screen bg-beige-50">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div className="px-1">
          <h1 className="text-3xl font-display font-bold text-navy-800">
            Apartments
          </h1>
          <p className="mt-1 text-navy-600 font-medium">
            Manage your property units
          </p>
        </div>
        <Button className="flex items-center gap-2 bg-teal-600 hover:bg-teal-700 text-white rounded-full h-10 px-3 shadow-subtle font-display font-medium">
          <Plus className="h-4 w-4" />
        </Button>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-4 mb-8 bg-white/20 border-white/30 backdrop-blur-md p-5 rounded-2xl ">
        <div className="flex-1 flex flex-col sm:flex-row items-start sm:items-center gap-4">
          <div className="relative flex-1 w-full">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-skyblue-600" />
            <Input
              placeholder="Search apartments..."
              className="pl-9 border-skyblue-200 focus-visible:ring-teal-600 w-full bg-beige-50 font-display font-medium rounded-lg"
            />
          </div>
          <div className="flex gap-2 w-full sm:w-auto">
            <select className="h-10 rounded-lg border-1 border-white/30 px-3 py-2 text-sm bg-skyblue-100 text-skyblue-700 font-display font-medium focus:ring-1 focus:ring-teal-600 min-w-[120px]">
              <option value="">All Buildings</option>
              <option value="A">Building A</option>
              <option value="B">Building B</option>
              <option value="C">Building C</option>
            </select>
            <select className="h-10 rounded-lg border-1 border-white/30 px-3 py-2 text-sm bg-skyblue-100 text-skyblue-700 font-display font-medium focus:ring-1 focus:ring-skyblue-600 min-w-[120px]">
              <option value="">All Status</option>
              <option value="Occupied">Occupied</option>
              <option value="Vacant">Vacant</option>
            </select>
          </div>
        </div>
      </div>

      {/* Apartments Grid */}
      <div className="grid grid-cols-1 gap-7 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 2xl:grid-cols-4">
        {apartmentsData.apartments.map((apartment) => (
          <div
            key={apartment.id}
            className={`overflow-hidden cursor-pointer group hover:shadow-xl transition-all duration-200 border border-white/30 rounded-2xl shadow-lg backdrop-blur-md
              ${
                apartment.status === "Vacant"
                  ? "bg-emerald-100/40"
                  : "bg-amber-100/40"
              }`}
            onClick={() => openApartmentDetails(apartment)}
          >
            {/* Card Header - Status Bar */}
            <div
              className={`h-1 w-full ${
                apartment.status === "Vacant"
                  ? "bg-emerald-300/50"
                  : "bg-amber-300/50"
              }`}
            ></div>

            {/* Apartment Identifier Section */}
            <div className="relative px-6 pt-6 pb-5 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className=" p-2.5 rounded-full shadow-sm">
                  <Home className="h-5 w-5 text-teal-600" />
                </div>
                <div>
                  <div className="text-2xl font-display font-bold text-navy-800">
                    {apartment.building}.{apartment.number}
                  </div>
                </div>
              </div>
              {apartment.status === "Vacant" ? (
                <Badge className=" text-emerald-700 font-semibold px-3 py-1">
                  Vacant
                </Badge>
              ) : (
                <Badge className=" text-amber-700 font-semibold px-3 py-1">
                  Occupied
                </Badge>
              )}
            </div>

            {/* Divider */}
            <div className="border-t border-slate-200/50 mx-6"></div>

            {/* Pricing & Features Section */}
            <div className="px-6 pt-5 pb-5">
              <div className="flex justify-between items-center mb-6">
                <div>
                  <div className="text-xs uppercase tracking-wide font-display font-medium text-navy-500">
                    Rent
                  </div>
                  <div className="flex items-center mt-1">
                    <span className="font-display font-bold text-2xl text-navy-800">
                      ${apartment.rent}
                    </span>
                    <span className="text-xs font-display font-bold text-navy-600 ml-1 mt-1">
                      /mo
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-4 py-2 px-4 ">
                  <div className="flex flex-col items-center">
                    <Bed
                      className="h-5 w-5 text-skyblue-600 mb-1"
                      strokeWidth={2}
                    />
                    <span className="text-sm font-display font-bold text-navy-700">
                      {apartment.bedrooms}
                    </span>
                  </div>
                  <div className="flex flex-col items-center">
                    <Bath
                      className="h-5 w-5 text-skyblue-600 mb-1"
                      strokeWidth={2}
                    />
                    <span className="text-sm font-display font-bold text-navy-700">
                      {apartment.bathrooms}
                    </span>
                  </div>
                </div>
              </div>

              {/* Tenant & Details Section */}
              <div className="flex items-center justify-between pt-3 mt-1 border-t border-slate-200/50">
                {apartment.tenant ? (
                  <div className="flex items-center  py-1.5 px-3 rounded-full">
                    <Users
                      className="h-4 w-4 text-purple-600 mr-2"
                      strokeWidth={2}
                    />
                    <span className="font-display font-medium text-navy-800">
                      {apartment.tenant}
                    </span>
                  </div>
                ) : (
                  <div className="flex items-center  py-1.5 px-3 rounded-full">
                    <Users
                      className="h-4 w-4 text-beige-600 mr-2"
                      strokeWidth={2}
                    />
                    <span className="font-display font-medium text-navy-600">
                      Available
                    </span>
                  </div>
                )}

                <button className=" p-2  hover:bg-teal-50 transition-colors">
                  <Info className="h-5 w-5 text-teal-600" strokeWidth={2} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Apartment Details Modal */}
      <Dialog open={isDetailOpen} onOpenChange={setIsDetailOpen}>
        {selectedApartment && (
          <DialogContent className="sm:max-w-[700px] p-0 bg-white/30 shadow-xl rounded-2xl border border-white/30 backdrop-blur-md">
            <div
              className={`relative py-6 px-7 ${
                selectedApartment.status === "Vacant"
                  ? "border-b border-white/30 bg-emerald-50/30"
                  : "border-b border-white/30 bg-amber-50/30"
              }`}
            >
              <DialogHeader className="pb-2">
                <DialogTitle className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl font-display font-bold text-navy-800">
                      Apartment {selectedApartment.number}
                    </span>
                  </div>
                </DialogTitle>
                <DialogDescription className="text-navy-600 font-display font-medium flex items-center mt-1">
                  <Building className="h-4 w-4 mr-1" />
                  Building {selectedApartment.building}, Floor{" "}
                  {selectedApartment.floor}
                </DialogDescription>
              </DialogHeader>
            </div>

            <div className="p-7">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-7">
                <div className="md:col-span-2 flex flex-wrap md:flex-nowrap justify-between items-start gap-7 border-b border-white/30 pb-7">
                  <div>
                    <div className="text-sm uppercase tracking-wide font-display font-medium text-navy-500">
                      Address
                    </div>
                    <div className="text-lg font-display font-medium text-navy-800 mt-1">
                      123 Main Street, Apt {selectedApartment.number}
                    </div>
                  </div>

                  <div>
                    <div className="text-sm uppercase tracking-wide font-display font-medium text-navy-500">
                      Monthly Rent
                    </div>
                    <div className="text-2xl font-display font-bold text-navy-800">
                      ${selectedApartment.rent}
                    </div>
                  </div>

                  <div>
                    <div className="text-sm uppercase tracking-wide font-display font-medium text-navy-500">
                      Status
                    </div>
                    <div className="font-display font-medium text-base">
                      {selectedApartment.status === "Vacant" ? (
                        <span className="text-emerald-600">Available</span>
                      ) : (
                        <span className="text-amber-600">Occupied</span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="border-b border-beige-200 pb-6">
                  <h3 className="font-display font-semibold text-lg text-navy-800 mb-3">
                    Details
                  </h3>

                  <div className="space-y-3">
                    <div className="flex items-center">
                      <div className="w-9 h-9 rounded-full bg-white/60 shadow-sm flex items-center justify-center mr-3">
                        <MapPin
                          className="h-4 w-4 text-teal-600"
                          strokeWidth={1.5}
                        />
                      </div>
                      <div>
                        <div className="text-sm font-display font-medium text-navy-500">
                          Size
                        </div>
                        <div className="font-display font-medium text-navy-700">
                          {selectedApartment.squareFeet} sq ft
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center">
                      <div className="w-9 h-9 rounded-full bg-white/60 shadow-sm flex items-center justify-center mr-3">
                        <Bed
                          className="h-4 w-4 text-teal-600"
                          strokeWidth={1.5}
                        />
                      </div>
                      <div>
                        <div className="text-sm font-medium text-navy-500">
                          Bedrooms
                        </div>
                        <div className="font-medium text-navy-700">
                          {selectedApartment.bedrooms}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center">
                      <div className="w-9 h-9 rounded-full bg-white/60 shadow-sm flex items-center justify-center mr-3">
                        <Bath
                          className="h-4 w-4 text-teal-600"
                          strokeWidth={1.5}
                        />
                      </div>
                      <div>
                        <div className="text-sm font-medium text-navy-500">
                          Bathrooms
                        </div>
                        <div className="font-medium text-navy-700">
                          {selectedApartment.bathrooms}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="border-b border-beige-200 pb-6">
                  <h3 className="font-display font-semibold text-lg text-navy-800 mb-3">
                    Tenant Information
                  </h3>

                  {selectedApartment.tenant ? (
                    <div>
                      <div className="font-display font-semibold text-navy-800 text-lg">
                        {selectedApartment.tenant}
                      </div>

                      <div className="mt-4 space-y-2">
                        <div className="flex justify-between">
                          <span className="text-sm font-medium text-navy-500">
                            Lease End Date
                          </span>
                          <span className="font-medium text-navy-700">
                            {selectedApartment.leaseEnd
                              ? new Date(
                                  selectedApartment.leaseEnd
                                ).toLocaleDateString()
                              : "N/A"}
                          </span>
                        </div>

                        <div className="flex justify-between">
                          <span className="text-sm font-medium text-navy-500">
                            Security Deposit
                          </span>
                          <span className="font-medium text-navy-700">
                            $1,000
                          </span>
                        </div>

                        <div className="flex justify-between">
                          <span className="text-sm font-medium text-navy-500">
                            Advance Payment
                          </span>
                          <span className="font-medium text-navy-700">$0</span>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="text-navy-600 font-display font-medium bg-white/40 p-5 rounded-xl border border-white/30 shadow-sm backdrop-blur-sm">
                      No tenant currently assigned to this apartment
                    </div>
                  )}
                </div>

                <div className="md:col-span-2 flex justify-end gap-3 mt-2">
                  <Button
                    variant="outline"
                    className="border-white/40 bg-white/20 backdrop-blur-sm text-teal-700 hover:bg-teal-600/20 font-display font-medium px-5 py-2.5"
                  >
                    {selectedApartment.status === "Vacant"
                      ? "Assign Tenant"
                      : "Update"}
                  </Button>
                  <Button className="bg-teal-600/90 hover:bg-teal-700 text-white font-display font-medium px-5 py-2.5 backdrop-blur-sm">
                    {selectedApartment.status === "Vacant"
                      ? "List Apartment"
                      : "Manage Lease"}
                  </Button>
                </div>
              </div>
            </div>
          </DialogContent>
        )}
      </Dialog>
    </div>
  );
}
