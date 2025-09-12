"use client";

import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { Apartment } from "@/types/apartment";
import {
  Building,
  Home,
  Users,
  CircleDollarSign,
  BedDouble,
  Bath,
  Key,
} from "lucide-react";

interface ApartmentCardProps {
  apartment: Apartment;
  onClick: (apartment: Apartment) => void;
}

export function ApartmentCard({ apartment, onClick }: ApartmentCardProps) {
  const {
    name,
    isOccupied,
    baseRent,
    estimatedTotalRent,
    currentTenant,
    code,
  } = apartment;

  return (
    <motion.div
      className="relative rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-all duration-300 cursor-pointer h-[250px] flex flex-col"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -5 }}
      onClick={() => onClick(apartment)}
    >
      {/* Status indicator bar at the top */}
      <div
        className={`h-2 w-full ${
          isOccupied ? "bg-amber-400" : "bg-emerald-400"
        }`}
      ></div>

      <div
        className={`p-6 flex flex-col flex-grow relative ${
          isOccupied
            ? "bg-gradient-to-br from-white to-amber-50"
            : "bg-gradient-to-br from-white to-emerald-50"
        }`}
      >
        {/* Header with code and status */}
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-3">
            <div
              className={`w-12 h-12 rounded-full flex items-center justify-center 
              ${
                isOccupied
                  ? "bg-amber-100 text-amber-600"
                  : "bg-emerald-100 text-emerald-600"
              }`}
            >
              <Home className="h-6 w-6" />
            </div>
            <div>
              <p className="text-base font-mono font-semibold text-navy-700">
                {code}
              </p>
            </div>
          </div>
          <Badge
            variant="outline"
            className={`
              font-medium text-sm px-3 py-1 rounded-full 
              ${
                isOccupied
                  ? "border-amber-200 bg-amber-100/70 text-amber-700 hover:bg-amber-100"
                  : "border-emerald-200 bg-emerald-100/70 text-emerald-700 hover:bg-emerald-100"
              }
            `}
          >
            {isOccupied ? "Occupied" : "Vacant"}
          </Badge>
        </div>

        {/* Pricing section with more space */}
        <div className="flex items-center justify-between mb-6 pb-5 border-b border-slate-200/50">
          <div>
            <p className="text-sm uppercase tracking-wide font-display font-medium text-navy-500 mb-1">
              Base Rent
            </p>
            <div className="flex items-baseline">
              <span className="font-display font-bold text-2xl text-navy-800">
                ${baseRent}
              </span>
              <span className="text-sm font-display font-medium text-navy-600 ml-1">
                /mo
              </span>
            </div>
          </div>

          <div className="text-right">
            <p className="text-sm uppercase tracking-wide font-display font-medium text-navy-500 mb-1">
              Est. Total
            </p>
            <div className="flex items-baseline">
              <span className="font-display font-bold text-2xl text-teal-700">
                ${estimatedTotalRent}
              </span>
              <span className="text-sm font-display font-medium text-navy-600 ml-1">
                /mo
              </span>
            </div>
          </div>
        </div>

        {/* Tenant section */}
        <div className="mt-auto">
          <div className="flex items-center gap-3">
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center 
              ${
                isOccupied
                  ? "bg-teal-100 text-teal-600"
                  : "bg-slate-100 text-slate-500"
              }`}
            >
              <Users className="h-4 w-4" />
            </div>
            <span className="font-display font-medium text-base text-navy-700 truncate">
              {currentTenant?.name || "Unavailable"}
            </span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
