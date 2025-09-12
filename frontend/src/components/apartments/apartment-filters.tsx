"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ApartmentFilters } from "@/types/apartment";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Building, Home, Search, SlidersHorizontal, X } from "lucide-react";

interface ApartmentFilterProps {
  filters: ApartmentFilters;
  onFilterChange: (filters: ApartmentFilters) => void;
  buildings: string[];
}

export function ApartmentFilters({
  filters,
  onFilterChange,
  buildings,
}: ApartmentFilterProps) {
  const [isAdvancedFilters, setIsAdvancedFilters] = useState(false);

  const handleQueryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onFilterChange({ ...filters, query: e.target.value });
  };

  const handleStatusChange = (value: string) => {
    onFilterChange({
      ...filters,
      status: (value as "all" | "occupied" | "vacant") || "all",
    });
  };

  const handleBuildingChange = (value: string) => {
    onFilterChange({ ...filters, building: value || undefined });
  };

  const handleSortChange = (value: string) => {
    const [sortBy, sortOrder] = value.split("-");
    onFilterChange({
      ...filters,
      sortBy: sortBy as "name" | "rent" | "totalRent",
      sortOrder: sortOrder as "asc" | "desc",
    });
  };

  const clearFilters = () => {
    onFilterChange({
      query: "",
      building: undefined,
      status: "all",
      sortBy: "name",
      sortOrder: "asc",
    });
  };

  return (
    <div className="rounded-xl bg-white shadow-sm border border-slate-100">
      <div className="p-5">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
          <div className="relative flex-1 w-full">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-navy-400" />
            <Input
              placeholder="Search by code or address..."
              value={filters.query || ""}
              onChange={handleQueryChange}
              className="pl-9 bg-slate-50 border-slate-200 w-full h-12 text-base"
            />
          </div>

          <div className="flex flex-wrap gap-3 w-full sm:w-auto">
            <Select
              value={filters.status || "all"}
              onValueChange={handleStatusChange}
            >
              <SelectTrigger className="w-[140px] bg-slate-50 border-slate-200 h-12">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="occupied">Occupied</SelectItem>
                  <SelectItem value="vacant">Vacant</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>

            {/* Advanced filters button removed as per request */}

            {(filters.query ||
              filters.building ||
              filters.status !== "all") && (
              <Button
                variant="ghost"
                onClick={clearFilters}
                className="h-12 text-sm font-medium"
              >
                <X className="h-4 w-4 mr-1.5" />
                Clear Filters
              </Button>
            )}
          </div>
        </div>
      </div>

      {isAdvancedFilters && (
        <div className="px-5 pb-5 pt-0 border-t border-slate-100">
          <div className="pt-5 grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-navy-700 flex items-center gap-2">
                <Building className="h-4 w-4 text-navy-500" />
                Building
              </label>
              <Select
                value={filters.building || ""}
                onValueChange={handleBuildingChange}
              >
                <SelectTrigger className="w-full bg-slate-50 border-slate-200">
                  <SelectValue placeholder="Select building" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectItem value="">All Buildings</SelectItem>
                    {buildings.map((building) => (
                      <SelectItem key={building} value={building}>
                        Building {building}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-navy-700 flex items-center gap-2">
                <Home className="h-4 w-4 text-navy-500" />
                Sort By
              </label>
              <Select
                value={`${filters.sortBy || "name"}-${
                  filters.sortOrder || "asc"
                }`}
                onValueChange={handleSortChange}
              >
                <SelectTrigger className="w-full bg-slate-50 border-slate-200">
                  <SelectValue placeholder="Sort apartments" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectItem value="name-asc">Name (A-Z)</SelectItem>
                    <SelectItem value="name-desc">Name (Z-A)</SelectItem>
                    <SelectItem value="rent-asc">Rent (Low to High)</SelectItem>
                    <SelectItem value="rent-desc">
                      Rent (High to Low)
                    </SelectItem>
                    <SelectItem value="totalRent-asc">
                      Total Cost (Low to High)
                    </SelectItem>
                    <SelectItem value="totalRent-desc">
                      Total Cost (High to Low)
                    </SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
