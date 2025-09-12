"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ApartmentCard } from "@/components/apartments/apartment-card";
import { ApartmentDetailModal } from "@/components/apartments/apartment-detail-modal";
import { ApartmentFilters } from "@/components/apartments/apartment-filters";
import { ApartmentForm } from "@/components/apartments/apartment-form";
import { TenantAssignForm } from "@/components/apartments/tenant-assign-form";
import { Button } from "@/components/ui/button";
import {
  Apartment,
  ApartmentFilters as ApartmentFiltersType,
  Tenant,
} from "@/types/apartment";
import { PlusCircle, AlertCircle } from "lucide-react";
import { generateMockData } from "@/lib/mock-data";

export default function ApartmentsPage() {
  const [apartments, setApartments] = useState<Apartment[]>([]);
  const [selectedApartment, setSelectedApartment] = useState<Apartment | null>(
    null
  );
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [isApartmentFormOpen, setIsApartmentFormOpen] = useState(false);
  const [isEditApartmentFormOpen, setIsEditApartmentFormOpen] = useState(false);
  const [isTenantAssignOpen, setIsTenantAssignOpen] = useState(false);
  const [filters, setFilters] = useState<ApartmentFiltersType>({
    query: "",
    status: "all",
    sortBy: "name",
    sortOrder: "asc",
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate API call with mock data
    const fetchData = async () => {
      setIsLoading(true);
      try {
        // In a real app, this would be an API call
        const data = generateMockData();
        setApartments(data.apartments);
      } catch (error) {
        console.error("Error fetching apartments:", error);
      } finally {
        setIsLoading(false);
      }
    };

    // Add custom event listener for assigning tenant
    const handleAssignTenant = (event: any) => {
      const { apartment } = event.detail;
      if (apartment) {
        openTenantAssignForm(apartment);
      }
    };

    window.addEventListener(
      "assignTenant",
      handleAssignTenant as EventListener
    );

    fetchData();

    // Clean up event listener
    return () => {
      window.removeEventListener(
        "assignTenant",
        handleAssignTenant as EventListener
      );
    };
  }, []);

  const openApartmentDetails = (apartment: Apartment) => {
    // Make sure to set the apartment first, then open the modal
    setSelectedApartment(apartment);
    setTimeout(() => {
      setIsDetailOpen(true);
    }, 10);
  };

  const openEditApartment = (apartment: Apartment) => {
    setSelectedApartment(apartment);
    setIsEditApartmentFormOpen(true);
  };

  const openTenantAssignForm = (apartment: Apartment) => {
    setSelectedApartment(apartment);
    setIsTenantAssignOpen(true);
  };

  const handleFilterChange = (newFilters: ApartmentFiltersType) => {
    setFilters(newFilters);
  };

  const handleApartmentSubmit = (apartment: Partial<Apartment>) => {
    // In a real app, this would make an API call to create/update the apartment
    console.log("Apartment submitted:", apartment);

    // Calculate the estimated total rent properly
    const baseRent = apartment.baseRent || 0;
    const waterBill = apartment.standardWaterBill || 0;
    const electricityBill = apartment.standardElectricityBill || 0;
    const gasBill = apartment.standardGasBill || 0;
    const internetBill = apartment.standardInternetBill || 0;
    const serviceCharge = apartment.standardServiceCharge || 0;
    const trashBill = apartment.standardTrashBill || 0;

    // Calculate other charges total if any
    const otherChargesTotal = apartment.otherCharges
      ? apartment.otherCharges.reduce(
          (sum, charge) => sum + (charge.amount || 0),
          0
        )
      : 0;

    // Calculate the estimated total
    const estimatedTotal =
      baseRent +
      waterBill +
      electricityBill +
      gasBill +
      internetBill +
      serviceCharge +
      trashBill +
      otherChargesTotal;

    // Check if we're editing an existing apartment
    if (selectedApartment && isEditApartmentFormOpen) {
      // Update existing apartment
      const updatedApartments = apartments.map((apt) => {
        if (apt.id === selectedApartment.id) {
          return {
            ...apt,
            name: apartment.name || apt.name,
            code: apartment.code || apt.code,
            building: apartment.building || apt.building,
            floor: apartment.floor || apt.floor,
            bedrooms: apartment.bedrooms || apt.bedrooms,
            bathrooms: apartment.bathrooms || apt.bathrooms,
            squareFeet: apartment.squareFeet || apt.squareFeet,
            baseRent: baseRent,
            address: apartment.address || apt.address,
            estimatedTotalRent: estimatedTotal,
            standardWaterBill: waterBill,
            standardElectricityBill: electricityBill,
            standardGasBill: gasBill,
            standardInternetBill: internetBill,
            standardServiceCharge: serviceCharge,
            standardTrashBill: trashBill,
            otherCharges: apartment.otherCharges || [],
            description: apartment.description || apt.description,
          };
        }
        return apt;
      });

      setApartments(updatedApartments);
      setIsEditApartmentFormOpen(false);
      setSelectedApartment(null);
    } else {
      // Add new apartment
      const newApartment: Apartment = {
        id: Math.floor(Math.random() * 10000),
        name: apartment.name || "New Apartment",
        code: apartment.code || `A-${Math.floor(Math.random() * 1000)}`,
        building: apartment.building || "Main Building",
        floor: apartment.floor || 1,
        bedrooms: apartment.bedrooms || 1,
        bathrooms: apartment.bathrooms || 1,
        squareFeet: apartment.squareFeet || 0,
        baseRent: baseRent,
        isOccupied: false,
        isActive: true,
        address: apartment.address || "",
        estimatedTotalRent: estimatedTotal,
        bills: [],
        standardWaterBill: waterBill,
        standardElectricityBill: electricityBill,
        standardGasBill: gasBill,
        standardInternetBill: internetBill,
        standardServiceCharge: serviceCharge,
        standardTrashBill: trashBill,
        otherCharges: apartment.otherCharges || [],
        description: apartment.description || "",
      };

      setApartments([...apartments, newApartment]);
      setIsApartmentFormOpen(false);
    }
  };

  const handleTenantAssign = (tenant: Partial<Tenant>) => {
    // In a real app, this would make an API call to assign the tenant
    console.log("Tenant assigned:", tenant);

    if (selectedApartment) {
      // Update the apartment status
      const updatedApartments = apartments.map((apt) =>
        apt.id === selectedApartment.id
          ? { ...apt, isOccupied: true, status: "occupied" }
          : apt
      );

      setApartments(updatedApartments);
      setIsTenantAssignOpen(false);
    }
  };

  // Apply filters to apartments
  const filteredApartments = apartments.filter((apartment) => {
    // Filter by query
    if (
      filters.query &&
      !apartment.name.toLowerCase().includes(filters.query.toLowerCase()) &&
      !apartment.code.toLowerCase().includes(filters.query.toLowerCase()) &&
      !apartment.address.toLowerCase().includes(filters.query.toLowerCase())
    ) {
      return false;
    }

    // Filter by status
    if (
      (filters.status === "occupied" && !apartment.isOccupied) ||
      (filters.status === "vacant" && apartment.isOccupied)
    ) {
      return false;
    }

    // Filter by building
    if (filters.building && apartment.building !== filters.building) {
      return false;
    }

    return true;
  });

  // Sort apartments
  const sortedApartments = [...filteredApartments].sort((a, b) => {
    const sortOrder = filters.sortOrder === "asc" ? 1 : -1;

    switch (filters.sortBy) {
      case "name":
        return a.name.localeCompare(b.name) * sortOrder;
      case "rent":
        return (a.baseRent - b.baseRent) * sortOrder;
      case "totalRent":
        return (a.estimatedTotalRent - b.estimatedTotalRent) * sortOrder;
      default:
        return 0;
    }
  });

  // Get unique buildings for filter dropdown
  const buildings = Array.from(
    new Set(apartments.map((apt) => apt.building).filter(Boolean))
  ) as string[];

  return (
    <div className="space-y-8 py-8">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-5 mb-8">
        <div>
          <motion.h1
            className="text-4xl font-display font-bold text-navy-800 mb-2"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            Apartments
          </motion.h1>
          <motion.p
            className="text-navy-600 text-lg"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
          >
            Manage your properties and tenants
          </motion.p>
        </div>
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3, duration: 0.5 }}
        >
          <Button
            className="bg-teal-600 hover:bg-teal-700 text-white h-12 px-5 text-base"
            onClick={() => setIsApartmentFormOpen(true)}
          >
            <PlusCircle className="h-5 w-5 mr-2" />
            Add Apartment
          </Button>
        </motion.div>
      </div>

      {/* Filters */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.5 }}
      >
        <ApartmentFilters
          filters={filters}
          onFilterChange={handleFilterChange}
          buildings={buildings}
        />
      </motion.div>

      {/* Results Counter */}
      {!isLoading && (
        <motion.div
          className="flex items-center justify-between my-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.5 }}
        >
          <p className="text-base text-navy-600">
            Showing{" "}
            <span className="font-medium text-navy-800">
              {sortedApartments.length}
            </span>{" "}
            of{" "}
            <span className="font-medium text-navy-800">
              {apartments.length}
            </span>{" "}
            apartments
          </p>
        </motion.div>
      )}

      {/* Apartments Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className="rounded-xl bg-slate-100 animate-pulse h-[250px]"
            ></div>
          ))}
        </div>
      ) : sortedApartments.length > 0 ? (
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.5 }}
        >
          <AnimatePresence>
            {sortedApartments.map((apartment) => (
              <motion.div
                key={apartment.id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.3 }}
              >
                <ApartmentCard
                  apartment={apartment}
                  onClick={openApartmentDetails}
                />
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      ) : (
        <motion.div
          className="flex flex-col items-center justify-center py-16 bg-beige-50 rounded-xl"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.5 }}
        >
          <div className="bg-white/70 p-4 rounded-full mb-4">
            <AlertCircle className="h-10 w-10 text-navy-400" />
          </div>
          <h3 className="font-display font-medium text-navy-700 text-lg mb-1">
            No apartments found
          </h3>
          <p className="text-navy-500 text-center max-w-md mb-6">
            No apartments match your current filters. Try adjusting your search
            criteria or add a new apartment.
          </p>
          <Button
            variant="outline"
            className="border-navy-200"
            onClick={() =>
              setFilters({
                query: "",
                status: "all",
                sortBy: "name",
                sortOrder: "asc",
              })
            }
          >
            Clear All Filters
          </Button>
        </motion.div>
      )}

      {/* Apartment Detail Modal */}
      <ApartmentDetailModal
        apartment={selectedApartment}
        isOpen={isDetailOpen}
        onClose={() => setIsDetailOpen(false)}
        onEdit={openEditApartment}
      />

      {/* Add Apartment Form Modal */}
      <ApartmentForm
        isOpen={isApartmentFormOpen}
        onClose={() => setIsApartmentFormOpen(false)}
        onSave={handleApartmentSubmit}
        title="Add New Apartment"
      />

      {/* Edit Apartment Form Modal */}
      <ApartmentForm
        isOpen={isEditApartmentFormOpen}
        onClose={() => {
          setIsEditApartmentFormOpen(false);
          setSelectedApartment(null);
        }}
        onSave={handleApartmentSubmit}
        apartment={selectedApartment || undefined}
        title="Edit Apartment"
      />

      {/* Tenant Assignment Form */}
      {selectedApartment && (
        <TenantAssignForm
          isOpen={isTenantAssignOpen}
          onClose={() => setIsTenantAssignOpen(false)}
          onSave={handleTenantAssign}
          apartment={selectedApartment}
        />
      )}
    </div>
  );
}
