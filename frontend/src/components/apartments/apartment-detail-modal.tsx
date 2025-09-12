"use client";

import { useState } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Apartment, Bill } from "@/types/apartment";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";
import {
  Building,
  Home,
  Users,
  CircleDollarSign,
  CalendarIcon,
  CreditCard,
  BedDouble,
  Bath,
  SquareIcon,
  Wallet,
  Lock,
  Receipt,
  Calendar,
  ChevronsUpDown,
} from "lucide-react";
import { format } from "date-fns";

interface ApartmentDetailModalProps {
  apartment: Apartment | null;
  isOpen: boolean;
  onClose: () => void;
  onEdit?: (apartment: Apartment) => void;
}

export function ApartmentDetailModal({
  apartment,
  isOpen,
  onClose,
  onEdit,
}: ApartmentDetailModalProps) {
  const [activeTab, setActiveTab] = useState("overview");

  // Return null if the dialog shouldn't be open or if apartment is null
  if (!isOpen || !apartment) return null;

  const {
    code,
    name,
    baseRent,
    estimatedTotalRent,
    isOccupied,
    address,
    description,
    bedrooms,
    bathrooms,
    squareFeet,
    building,
    floor,
    currentTenant,
    bills,
  } = apartment;

  // Helper to format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  // Get the latest bill
  const latestBill =
    bills && bills.length > 0
      ? [...bills].sort((a, b) => {
          const dateA = new Date(a.year, a.month - 1);
          const dateB = new Date(b.year, b.month - 1);
          return dateB.getTime() - dateA.getTime();
        })[0]
      : null;

  // Standard utility costs for this apartment (whether occupied or not)
  // Use the actual values from the apartment object
  const standardUtilityCosts = {
    waterBill: apartment.standardWaterBill || 0,
    electricityBill: apartment.standardElectricityBill || 0,
    gasBill: apartment.standardGasBill || 0,
    internetBill: apartment.standardInternetBill || 0,
    serviceCharge: apartment.standardServiceCharge || 0,
    trashBill: apartment.standardTrashBill || 0,
  };

  return (
    <Dialog open={isOpen} onOpenChange={() => onClose()}>
      <DialogContent className="sm:max-w-[800px] p-0 rounded-xl overflow-hidden">
        {/* Modal Header */}
        <div className={`p-6 ${isOccupied ? "bg-amber-50" : "bg-emerald-50"}`}>
          <div className="flex items-center justify-between">
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
                <h2 className="font-display font-bold text-2xl text-navy-800">
                  {name}
                </h2>
                <div className="flex items-center gap-2 text-navy-600">
                  <code className="text-xs font-mono bg-white/50 px-1.5 py-0.5 rounded">
                    {code}
                  </code>
                  {building && (
                    <span className="text-sm">
                      Building {building}
                      {floor && `, Floor ${floor}`}
                    </span>
                  )}
                </div>
              </div>
            </div>

            <Badge
              variant="outline"
              className={`
                font-medium text-sm px-3 py-1 mt-2
                ${
                  isOccupied
                    ? "border-amber-200 bg-amber-100/70 text-amber-700"
                    : "border-emerald-200 bg-emerald-100/70 text-emerald-700"
                }
              `}
            >
              {isOccupied ? "Occupied" : "Vacant"}
            </Badge>
          </div>
        </div>

        {/* Tab Content */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="mt-2">
          <div className="px-6 py-2 border-b">
            <TabsList className="grid w-full grid-cols-3 bg-white/50">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="bills">Bills & Charges</TabsTrigger>
              <TabsTrigger value="tenant">Tenant Info</TabsTrigger>
            </TabsList>
          </div>

          <div className="bg-white px-6 py-5 max-h-[70vh] overflow-y-auto custom-scrollbar">
            <TabsContent value="overview" className="mt-0">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Rent Summary */}
                <div className="bg-skyblue-50 p-5 rounded-lg">
                  <h4 className="font-display font-semibold text-navy-800 mb-3 flex items-center justify-between">
                    <span>Rent Summary</span>
                    {!isOccupied && (
                      <Badge
                        variant="outline"
                        className="bg-navy-50 text-navy-700 border-navy-200 text-xs font-medium"
                      >
                        Standard Rates
                      </Badge>
                    )}
                  </h4>

                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-navy-600">Base Rent</span>
                      <span className="font-medium text-navy-800">
                        {formatCurrency(baseRent)}
                      </span>
                    </div>
                    {/* Always show utility costs, but use different sources based on occupancy */}
                    {/* For occupied apartments with bills, use the latest bill */}
                    {/* For vacant apartments, use the standard utility costs */}
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-navy-600">Water</span>
                      <div className="flex items-center">
                        {isOccupied &&
                        currentTenant &&
                        !currentTenant.waterBillEnabled ? (
                          <span className="text-xs text-slate-500 italic mr-2">
                            Disabled
                          </span>
                        ) : (
                          <span className="text-navy-800">
                            {formatCurrency(
                              isOccupied && latestBill
                                ? latestBill.waterBill
                                : standardUtilityCosts.waterBill
                            )}
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-navy-600">Electricity</span>
                      <div className="flex items-center">
                        {isOccupied &&
                        currentTenant &&
                        !currentTenant.electricityBillEnabled ? (
                          <span className="text-xs text-slate-500 italic mr-2">
                            Disabled
                          </span>
                        ) : (
                          <span className="text-navy-800">
                            {formatCurrency(
                              isOccupied && latestBill
                                ? latestBill.electricityBill
                                : standardUtilityCosts.electricityBill
                            )}
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-navy-600">Gas</span>
                      <div className="flex items-center">
                        {isOccupied &&
                        currentTenant &&
                        !currentTenant.gasBillEnabled ? (
                          <span className="text-xs text-slate-500 italic mr-2">
                            Disabled
                          </span>
                        ) : (
                          <span className="text-navy-800">
                            {formatCurrency(
                              isOccupied && latestBill
                                ? latestBill.gasBill
                                : standardUtilityCosts.gasBill
                            )}
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-navy-600">Internet</span>
                      <div className="flex items-center">
                        {isOccupied &&
                        currentTenant &&
                        !currentTenant.internetBillEnabled ? (
                          <span className="text-xs text-slate-500 italic mr-2">
                            Disabled
                          </span>
                        ) : (
                          <span className="text-navy-800">
                            {formatCurrency(
                              isOccupied && latestBill
                                ? latestBill.internetBill
                                : standardUtilityCosts.internetBill
                            )}
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-navy-600">Trash</span>
                      <div className="flex items-center">
                        {isOccupied &&
                        currentTenant &&
                        !currentTenant.trashBillEnabled ? (
                          <span className="text-xs text-slate-500 italic mr-2">
                            Disabled
                          </span>
                        ) : (
                          <span className="text-navy-800">
                            {formatCurrency(
                              isOccupied && latestBill
                                ? latestBill.trashBill
                                : standardUtilityCosts.trashBill
                            )}
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-navy-600">Service Charge</span>
                      <div className="flex items-center">
                        {isOccupied &&
                        currentTenant &&
                        !currentTenant.serviceChargeEnabled ? (
                          <span className="text-xs text-slate-500 italic mr-2">
                            Disabled
                          </span>
                        ) : (
                          <span className="text-navy-800">
                            {formatCurrency(
                              isOccupied && latestBill
                                ? latestBill.serviceCharge
                                : standardUtilityCosts.serviceCharge
                            )}
                          </span>
                        )}
                      </div>
                    </div>
                    {/* Show other charges if available */}
                    {apartment.otherCharges &&
                      apartment.otherCharges.length > 0 && (
                        <>
                          {apartment.otherCharges.map((charge, index) => (
                            <div
                              key={index}
                              className="flex justify-between items-center text-sm"
                            >
                              <span className="text-navy-600">
                                {charge.name}
                              </span>
                              <span className="text-navy-800">
                                {formatCurrency(charge.amount)}
                              </span>
                            </div>
                          ))}
                        </>
                      )}{" "}
                    <Separator />
                    <div className="flex justify-between items-center font-medium pt-1">
                      <span className="text-navy-800">
                        {isOccupied
                          ? "Total Monthly"
                          : "Standard Monthly Total"}
                      </span>
                      <span className="text-lg text-teal-700">
                        {formatCurrency(estimatedTotalRent)}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Apartment Details */}
                <div className="bg-beige-100/50 p-5 rounded-lg">
                  <h4 className="font-display font-semibold text-navy-800 mb-3">
                    Apartment Details
                  </h4>

                  <div className="space-y-4">
                    {description && (
                      <p className="text-sm text-navy-600">{description}</p>
                    )}

                    <div className="grid grid-cols-2 gap-4 pt-2">
                      {bedrooms !== undefined && (
                        <div className="flex items-center gap-2">
                          <div className="h-8 w-8 rounded-full bg-teal-100 flex items-center justify-center">
                            <BedDouble className="h-4 w-4 text-teal-600" />
                          </div>
                          <div>
                            <div className="text-xs text-navy-500">
                              Bedrooms
                            </div>
                            <div className="font-medium text-navy-800">
                              {bedrooms}
                            </div>
                          </div>
                        </div>
                      )}

                      {bathrooms !== undefined && (
                        <div className="flex items-center gap-2">
                          <div className="h-8 w-8 rounded-full bg-teal-100 flex items-center justify-center">
                            <Bath className="h-4 w-4 text-teal-600" />
                          </div>
                          <div>
                            <div className="text-xs text-navy-500">
                              Bathrooms
                            </div>
                            <div className="font-medium text-navy-800">
                              {bathrooms}
                            </div>
                          </div>
                        </div>
                      )}

                      {squareFeet !== undefined && (
                        <div className="flex items-center gap-2">
                          <div className="h-8 w-8 rounded-full bg-teal-100 flex items-center justify-center">
                            <SquareIcon className="h-4 w-4 text-teal-600" />
                          </div>
                          <div>
                            <div className="text-xs text-navy-500">Area</div>
                            <div className="font-medium text-navy-800">
                              {squareFeet} sq ft
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="md:col-span-2 flex justify-end gap-3 pt-4">
                  <Button
                    variant="outline"
                    className="text-navy-700 bg-white border-navy-200"
                    onClick={() => {
                      if (onEdit && apartment) {
                        onClose();
                        setTimeout(() => {
                          onEdit(apartment);
                        }, 300);
                      }
                    }}
                  >
                    {isOccupied ? "Update Details" : "Edit Apartment"}
                  </Button>
                  <Button
                    className="bg-teal-600 hover:bg-teal-700 text-white"
                    onClick={() => {
                      if (!isOccupied) {
                        onClose();
                        setTimeout(() => {
                          // We'll need to add this functionality to the parent component
                          const event = new CustomEvent("assignTenant", {
                            detail: { apartment },
                          });
                          window.dispatchEvent(event);
                        }, 300);
                      }
                    }}
                  >
                    {isOccupied ? "Manage Lease" : "Assign Tenant"}
                  </Button>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="bills" className="mt-0">
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <h3 className="font-display font-semibold text-navy-800">
                    {isOccupied ? "Current Bill" : "Standard Billing Structure"}
                  </h3>
                  {isOccupied && (
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-teal-600 border-teal-200"
                    >
                      <Receipt className="h-4 w-4 mr-1" /> Generate Bill
                    </Button>
                  )}
                </div>

                {isOccupied ? (
                  bills.length > 0 ? (
                    <>
                      {/* Current Month Bill */}
                      {(() => {
                        const currentBill = [...bills].sort((a, b) => {
                          const dateA = new Date(a.year, a.month - 1);
                          const dateB = new Date(b.year, b.month - 1);
                          return dateB.getTime() - dateA.getTime();
                        })[0];

                        return (
                          <div className="p-5 rounded-lg border border-sky-200 bg-sky-50/50">
                            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
                              <div>
                                <div className="flex items-center gap-2 mb-1">
                                  <Calendar className="h-5 w-5 text-teal-600" />
                                  <h4 className="font-display font-semibold text-xl text-navy-800">
                                    {new Date(
                                      currentBill.year,
                                      currentBill.month - 1
                                    ).toLocaleDateString("en-US", {
                                      month: "long",
                                      year: "numeric",
                                    })}
                                  </h4>
                                </div>
                                <p className="text-navy-600 text-sm">
                                  Due:{" "}
                                  {new Date(
                                    currentBill.dueDate
                                  ).toLocaleDateString("en-US", {
                                    month: "short",
                                    day: "numeric",
                                    year: "numeric",
                                  })}
                                </p>
                              </div>

                              <div className="flex items-center gap-3">
                                <Badge
                                  variant={
                                    currentBill.isPaid ? "outline" : "secondary"
                                  }
                                  className={`px-3 py-1 text-sm font-medium ${
                                    currentBill.isPaid
                                      ? "bg-emerald-100/80 text-emerald-700 border-emerald-200"
                                      : "bg-amber-100/80 text-amber-700 border-amber-200"
                                  }`}
                                >
                                  {currentBill.isPaid ? "Paid" : "Unpaid"}
                                </Badge>

                                {!currentBill.isPaid && (
                                  <Button
                                    size="sm"
                                    className="bg-teal-600 hover:bg-teal-700 text-white"
                                  >
                                    Record Payment
                                  </Button>
                                )}
                              </div>
                            </div>

                            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-4 bg-white p-4 rounded-md">
                              <div>
                                <div className="text-sm text-navy-500 mb-0.5">
                                  Base Rent
                                </div>
                                <div className="font-medium text-navy-800 text-lg">
                                  {formatCurrency(currentBill.rent)}
                                </div>
                              </div>

                              {currentBill.waterBill > 0 && (
                                <div>
                                  <div className="text-sm text-navy-500 mb-0.5">
                                    Water
                                  </div>
                                  <div className="font-medium text-navy-800">
                                    {formatCurrency(currentBill.waterBill)}
                                  </div>
                                </div>
                              )}

                              {currentBill.electricityBill > 0 && (
                                <div>
                                  <div className="text-sm text-navy-500 mb-0.5">
                                    Electricity
                                  </div>
                                  <div className="font-medium text-navy-800">
                                    {formatCurrency(
                                      currentBill.electricityBill
                                    )}
                                  </div>
                                </div>
                              )}

                              {currentBill.gasBill > 0 && (
                                <div>
                                  <div className="text-sm text-navy-500 mb-0.5">
                                    Gas
                                  </div>
                                  <div className="font-medium text-navy-800">
                                    {formatCurrency(currentBill.gasBill)}
                                  </div>
                                </div>
                              )}

                              {currentBill.internetBill > 0 && (
                                <div>
                                  <div className="text-sm text-navy-500 mb-0.5">
                                    Internet
                                  </div>
                                  <div className="font-medium text-navy-800">
                                    {formatCurrency(currentBill.internetBill)}
                                  </div>
                                </div>
                              )}

                              {currentBill.serviceCharge > 0 && (
                                <div>
                                  <div className="text-sm text-navy-500 mb-0.5">
                                    Service
                                  </div>
                                  <div className="font-medium text-navy-800">
                                    {formatCurrency(currentBill.serviceCharge)}
                                  </div>
                                </div>
                              )}

                              {currentBill.trashBill > 0 && (
                                <div>
                                  <div className="text-sm text-navy-500 mb-0.5">
                                    Trash
                                  </div>
                                  <div className="font-medium text-navy-800">
                                    {formatCurrency(currentBill.trashBill)}
                                  </div>
                                </div>
                              )}

                              {currentBill.otherCharges > 0 && (
                                <div>
                                  <div className="text-sm text-navy-500 mb-0.5">
                                    Other Charges
                                  </div>
                                  <div className="font-medium text-navy-800">
                                    {formatCurrency(currentBill.otherCharges)}
                                  </div>
                                </div>
                              )}
                            </div>

                            <div className="flex justify-between items-center pt-3 border-t border-sky-200">
                              <div className="font-display font-semibold text-navy-800 text-lg">
                                Total
                              </div>
                              <div className="text-xl font-bold text-teal-700">
                                {formatCurrency(currentBill.total)}
                              </div>
                            </div>
                          </div>
                        );
                      })()}

                      {/* Previous Bills Summary */}
                      <div className="mt-8">
                        <div className="flex justify-between items-center mb-3">
                          <h4 className="font-display font-medium text-navy-800">
                            Previous Bills
                          </h4>
                          <Button
                            variant="link"
                            className="text-teal-600 p-0 h-auto"
                          >
                            View Full History
                          </Button>
                        </div>

                        <div className="bg-white rounded-lg border border-slate-200 overflow-hidden">
                          <table className="w-full text-sm">
                            <thead className="bg-slate-50 text-navy-600">
                              <tr>
                                <th className="py-3 px-4 text-left">Month</th>
                                <th className="py-3 px-4 text-right">Amount</th>
                                <th className="py-3 px-4 text-right">Status</th>
                              </tr>
                            </thead>
                            <tbody>
                              {bills.slice(1, 4).map((bill) => (
                                <tr
                                  key={bill.id}
                                  className="border-t border-slate-200"
                                >
                                  <td className="py-2.5 px-4">
                                    {new Date(
                                      bill.year,
                                      bill.month - 1
                                    ).toLocaleDateString("en-US", {
                                      month: "short",
                                      year: "numeric",
                                    })}
                                  </td>
                                  <td className="py-2.5 px-4 text-right font-medium">
                                    {formatCurrency(bill.total)}
                                  </td>
                                  <td className="py-2.5 px-4 text-right">
                                    <Badge
                                      variant="outline"
                                      className={`text-xs ${
                                        bill.isPaid
                                          ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                                          : "bg-amber-50 text-amber-700 border-amber-200"
                                      }`}
                                    >
                                      {bill.isPaid ? "Paid" : "Unpaid"}
                                    </Badge>
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    </>
                  ) : (
                    <div className="text-center py-10 bg-beige-50 rounded-lg">
                      <Receipt className="h-10 w-10 mx-auto text-navy-400 mb-3" />
                      <h3 className="font-display font-medium text-navy-700 mb-1">
                        No Bills Found
                      </h3>
                      <p className="text-navy-500 text-sm">
                        There are no bills associated with this apartment yet.
                      </p>
                    </div>
                  )
                ) : (
                  <div className="space-y-6">
                    <div className="bg-beige-50 p-5 rounded-lg">
                      <div className="flex items-start gap-4">
                        <div className="bg-white/70 p-3 rounded-full">
                          <Receipt className="h-6 w-6 text-navy-500" />
                        </div>
                        <div>
                          <h4 className="font-display font-medium text-navy-700 mb-1">
                            Vacant Apartment
                          </h4>
                          <p className="text-navy-500 text-sm">
                            This apartment is currently vacant. The standard
                            billing structure is shown below. When a tenant is
                            assigned, bills will be generated based on their
                            specific configuration.
                          </p>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h4 className="font-display font-medium text-navy-800 mb-3">
                        Standard Billing Structure
                      </h4>

                      <div className="bg-white rounded-lg border border-slate-200">
                        <div className="p-4 border-b border-slate-200">
                          <span className="text-sm font-medium text-navy-800">
                            Base Rent + Standard Utilities
                          </span>
                        </div>

                        <div className="p-4">
                          <div className="space-y-3">
                            <div className="flex justify-between items-center">
                              <span>Base Rent</span>
                              <span className="font-medium">
                                {formatCurrency(baseRent)}
                              </span>
                            </div>

                            <div className="flex justify-between items-center text-sm">
                              <span>Water</span>
                              <span>
                                {formatCurrency(standardUtilityCosts.waterBill)}
                              </span>
                            </div>

                            <div className="flex justify-between items-center text-sm">
                              <span>Electricity</span>
                              <span>
                                {formatCurrency(
                                  standardUtilityCosts.electricityBill
                                )}
                              </span>
                            </div>

                            <div className="flex justify-between items-center text-sm">
                              <span>Gas</span>
                              <span>
                                {formatCurrency(standardUtilityCosts.gasBill)}
                              </span>
                            </div>

                            <div className="flex justify-between items-center text-sm">
                              <span>Internet</span>
                              <span>
                                {formatCurrency(
                                  standardUtilityCosts.internetBill
                                )}
                              </span>
                            </div>

                            <div className="flex justify-between items-center text-sm">
                              <span>Service Charge</span>
                              <span>
                                {formatCurrency(
                                  standardUtilityCosts.serviceCharge
                                )}
                              </span>
                            </div>

                            <div className="flex justify-between items-center text-sm">
                              <span>Trash</span>
                              <span>
                                {formatCurrency(standardUtilityCosts.trashBill)}
                              </span>
                            </div>

                            {/* Show other charges if available */}
                            {apartment.otherCharges &&
                              apartment.otherCharges.length > 0 && (
                                <>
                                  <div className="mt-3 mb-1 text-sm text-navy-600 font-medium">
                                    Other Charges:
                                  </div>
                                  {apartment.otherCharges.map(
                                    (charge, index) => (
                                      <div
                                        key={index}
                                        className="flex justify-between items-center text-sm"
                                      >
                                        <span>{charge.name}</span>
                                        <span>
                                          {formatCurrency(charge.amount)}
                                        </span>
                                      </div>
                                    )
                                  )}
                                </>
                              )}

                            <div className="border-t border-slate-200 mt-3 pt-3 flex justify-between font-medium">
                              <span>Standard Total</span>
                              <span className="text-teal-700">
                                {formatCurrency(estimatedTotalRent)}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="mt-6 flex justify-end">
                        <Button
                          variant="outline"
                          className="bg-teal-50 text-teal-700 border-teal-200"
                        >
                          Edit Billing Structure
                        </Button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </TabsContent>

            <TabsContent value="tenant" className="mt-0">
              {currentTenant ? (
                <div className="space-y-6">
                  <div className="flex items-center gap-4">
                    <div className="h-16 w-16 rounded-full bg-teal-100 flex items-center justify-center overflow-hidden">
                      {currentTenant.photoUrl ? (
                        <img
                          src={currentTenant.photoUrl}
                          alt={currentTenant.name}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <Users className="h-8 w-8 text-teal-600" />
                      )}
                    </div>
                    <div>
                      <h3 className="font-display font-semibold text-xl text-navy-800">
                        {currentTenant.name}
                      </h3>
                      {currentTenant.phoneNumber && (
                        <p className="text-navy-600 text-sm">
                          {currentTenant.phoneNumber}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-beige-50 p-5 rounded-lg">
                      <h4 className="font-display font-medium text-navy-800 mb-3">
                        Financial Summary
                      </h4>
                      <div className="space-y-4">
                        <div className="flex justify-between items-center">
                          <div className="flex items-center gap-2">
                            <Lock className="h-4 w-4 text-purple-600" />
                            <span className="text-sm text-navy-600">
                              Security Deposit
                            </span>
                          </div>
                          <span className="font-medium text-navy-800">
                            {formatCurrency(currentTenant.securityDeposit)}
                          </span>
                        </div>

                        <div className="flex justify-between items-center">
                          <div className="flex items-center gap-2">
                            <Wallet className="h-4 w-4 text-teal-600" />
                            <span className="text-sm text-navy-600">
                              Credit Balance
                            </span>
                          </div>
                          <span className="font-medium text-navy-800">
                            {formatCurrency(currentTenant.creditBalance)}
                          </span>
                        </div>

                        <div className="text-xs text-navy-500 bg-beige-50 p-2 rounded-md -mt-2 mb-2 border-l-2 border-amber-300">
                          <strong>Note:</strong> Security deposit is refundable
                          at the end of lease. Credit balance represents
                          overpayments that will be applied to future bills
                          automatically.
                        </div>

                        <div className="flex justify-between items-center">
                          <div className="flex items-center gap-2">
                            <CalendarIcon className="h-4 w-4 text-amber-600" />
                            <span className="text-sm text-navy-600">
                              Move In Date
                            </span>
                          </div>
                          <span className="font-medium text-navy-800">
                            {new Date(
                              currentTenant.moveInDate
                            ).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="bg-skyblue-50 p-5 rounded-lg">
                      <h4 className="font-display font-medium text-navy-800 mb-3">
                        Billing Configuration
                      </h4>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-navy-600">Water</span>
                          <Badge
                            variant="outline"
                            className={
                              currentTenant.waterBillEnabled
                                ? "bg-emerald-100/50 text-emerald-700 border-emerald-200"
                                : "bg-slate-100 text-slate-700 border-slate-200"
                            }
                          >
                            {currentTenant.waterBillEnabled
                              ? "Enabled"
                              : "Disabled"}
                          </Badge>
                        </div>

                        <div className="flex items-center justify-between">
                          <span className="text-sm text-navy-600">
                            Electricity
                          </span>
                          <Badge
                            variant="outline"
                            className={
                              currentTenant.electricityBillEnabled
                                ? "bg-emerald-100/50 text-emerald-700 border-emerald-200"
                                : "bg-slate-100 text-slate-700 border-slate-200"
                            }
                          >
                            {currentTenant.electricityBillEnabled
                              ? "Enabled"
                              : "Disabled"}
                          </Badge>
                        </div>

                        <div className="flex items-center justify-between">
                          <span className="text-sm text-navy-600">Gas</span>
                          <Badge
                            variant="outline"
                            className={
                              currentTenant.gasBillEnabled
                                ? "bg-emerald-100/50 text-emerald-700 border-emerald-200"
                                : "bg-slate-100 text-slate-700 border-slate-200"
                            }
                          >
                            {currentTenant.gasBillEnabled
                              ? "Enabled"
                              : "Disabled"}
                          </Badge>
                        </div>

                        <div className="flex items-center justify-between">
                          <span className="text-sm text-navy-600">
                            Internet
                          </span>
                          <Badge
                            variant="outline"
                            className={
                              currentTenant.internetBillEnabled
                                ? "bg-emerald-100/50 text-emerald-700 border-emerald-200"
                                : "bg-slate-100 text-slate-700 border-slate-200"
                            }
                          >
                            {currentTenant.internetBillEnabled
                              ? "Enabled"
                              : "Disabled"}
                          </Badge>
                        </div>

                        <div className="flex items-center justify-between">
                          <span className="text-sm text-navy-600">
                            Service Charge
                          </span>
                          <Badge
                            variant="outline"
                            className={
                              currentTenant.serviceChargeEnabled
                                ? "bg-emerald-100/50 text-emerald-700 border-emerald-200"
                                : "bg-slate-100 text-slate-700 border-slate-200"
                            }
                          >
                            {currentTenant.serviceChargeEnabled
                              ? "Enabled"
                              : "Disabled"}
                          </Badge>
                        </div>

                        <div className="flex items-center justify-between">
                          <span className="text-sm text-navy-600">Trash</span>
                          <Badge
                            variant="outline"
                            className={
                              currentTenant.trashBillEnabled
                                ? "bg-emerald-100/50 text-emerald-700 border-emerald-200"
                                : "bg-slate-100 text-slate-700 border-slate-200"
                            }
                          >
                            {currentTenant.trashBillEnabled
                              ? "Enabled"
                              : "Disabled"}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-end gap-3 pt-4">
                    <Button
                      variant="outline"
                      className="text-navy-700 border-navy-200"
                    >
                      Edit Tenant
                    </Button>
                    <Button className="bg-teal-600 hover:bg-teal-700 text-white">
                      View All Payments
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="text-center py-12 bg-beige-50 rounded-lg">
                  <Users className="h-12 w-12 mx-auto text-navy-400 mb-3" />
                  <h3 className="font-display font-medium text-navy-700 mb-1">
                    No Tenant Assigned
                  </h3>
                  <p className="text-navy-500 text-sm mb-5">
                    This apartment is currently vacant and has no tenant
                    assigned.
                  </p>
                  <Button className="bg-teal-600 hover:bg-teal-700 text-white">
                    Assign New Tenant
                  </Button>
                </div>
              )}
            </TabsContent>
          </div>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
