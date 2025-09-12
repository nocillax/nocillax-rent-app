"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Apartment, OtherCharge } from "@/types/apartment";
import {
  Building,
  Home,
  BedDouble,
  Bath,
  SquareIcon,
  DollarSign,
  Droplet,
  Lightbulb,
  Flame,
  Wifi,
  Wrench,
  Trash2,
  X,
} from "lucide-react";

interface ApartmentFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (apartment: Partial<Apartment>) => void;
  apartment?: Apartment; // Optional for edit mode
  title: string;
}

export function ApartmentForm({
  isOpen,
  onClose,
  onSave,
  apartment,
  title,
}: ApartmentFormProps) {
  // Initialize form state with existing apartment data or empty values
  const [formData, setFormData] = useState<Partial<Apartment>>(
    apartment || {
      code: "",
      name: "",
      address: "",
      description: "",
      baseRent: 0,
      standardWaterBill: 0,
      standardElectricityBill: 0,
      standardGasBill: 0,
      standardInternetBill: 0,
      standardServiceCharge: 0,
      standardTrashBill: 0,
      building: "",
      floor: 0,
      bedrooms: 0,
      bathrooms: 0,
      squareFeet: 0,
      isActive: true,
    }
  );

  // State for other charges - initialize with apartment.otherCharges if available
  const [otherCharges, setOtherCharges] = useState<OtherCharge[]>(
    apartment?.otherCharges || []
  );

  // Update form data when apartment prop changes
  useEffect(() => {
    if (apartment) {
      setFormData(apartment);
      setOtherCharges(apartment.otherCharges || []);
    }
  }, [apartment]);

  // State for new charge being added
  const [newCharge, setNewCharge] = useState<OtherCharge>({
    name: "",
    amount: 0,
    description: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = e.target;

    // Convert number fields to actual numbers
    if (type === "number") {
      setFormData({
        ...formData,
        [name]: value !== "" ? parseFloat(value) : undefined,
      });
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }
  };

  // Handle changes to a new charge being added
  const handleNewChargeChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = e.target;

    setNewCharge({
      ...newCharge,
      [name]: type === "number" && value !== "" ? parseFloat(value) : value,
    });
  };

  // Add a new charge to the list
  const addCharge = () => {
    if (newCharge.name && newCharge.amount > 0) {
      setOtherCharges([...otherCharges, { ...newCharge, id: Date.now() }]);
      // Reset the new charge form
      setNewCharge({ name: "", amount: 0, description: "" });
    }
  };

  // Remove a charge from the list
  const removeCharge = (id: number) => {
    setOtherCharges(otherCharges.filter((charge) => charge.id !== id));
  };

  const calculateEstimatedTotal = () => {
    const baseRent =
      typeof formData.baseRent === "number" ? formData.baseRent : 0;
    const waterBill =
      typeof formData.standardWaterBill === "number"
        ? formData.standardWaterBill
        : 0;
    const electricityBill =
      typeof formData.standardElectricityBill === "number"
        ? formData.standardElectricityBill
        : 0;
    const gasBill =
      typeof formData.standardGasBill === "number"
        ? formData.standardGasBill
        : 0;
    const internetBill =
      typeof formData.standardInternetBill === "number"
        ? formData.standardInternetBill
        : 0;
    const serviceCharge =
      typeof formData.standardServiceCharge === "number"
        ? formData.standardServiceCharge
        : 0;
    const trashBill =
      typeof formData.standardTrashBill === "number"
        ? formData.standardTrashBill
        : 0;

    // Add the total of other charges
    const otherChargesTotal = otherCharges.reduce(
      (sum, charge) => sum + (charge.amount || 0),
      0
    );

    return (
      baseRent +
      waterBill +
      electricityBill +
      gasBill +
      internetBill +
      serviceCharge +
      trashBill +
      otherChargesTotal
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Make sure all utility costs are numbers
    const updatedFormData = {
      ...formData,
      // Ensure all utility fields have numeric values
      baseRent: typeof formData.baseRent === "number" ? formData.baseRent : 0,
      standardWaterBill:
        typeof formData.standardWaterBill === "number"
          ? formData.standardWaterBill
          : 0,
      standardElectricityBill:
        typeof formData.standardElectricityBill === "number"
          ? formData.standardElectricityBill
          : 0,
      standardGasBill:
        typeof formData.standardGasBill === "number"
          ? formData.standardGasBill
          : 0,
      standardInternetBill:
        typeof formData.standardInternetBill === "number"
          ? formData.standardInternetBill
          : 0,
      standardServiceCharge:
        typeof formData.standardServiceCharge === "number"
          ? formData.standardServiceCharge
          : 0,
      standardTrashBill:
        typeof formData.standardTrashBill === "number"
          ? formData.standardTrashBill
          : 0,
      // Include the other charges
      otherCharges: otherCharges,
      // Calculate the estimated total rent
      estimatedTotalRent: calculateEstimatedTotal(),
    };

    onSave(updatedFormData);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[700px] p-0 overflow-hidden">
        <DialogHeader className="p-8 bg-gradient-to-r from-teal-50 to-teal-100 border-b border-teal-200">
          <DialogTitle className="text-2xl font-display font-bold text-navy-800 flex items-center">
            <Home className="h-6 w-6 text-teal-600 mr-2" />
            {title}
          </DialogTitle>
        </DialogHeader>

        <form
          onSubmit={handleSubmit}
          className="space-y-8 p-8 max-h-[70vh] overflow-y-auto"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Basic Info Section */}
            <div className="space-y-6 md:col-span-2 bg-white/80 p-6 rounded-lg border border-slate-100 shadow-sm backdrop-blur-sm">
              <h3 className="text-lg font-semibold text-navy-800 flex items-center gap-2 pb-2 border-b-2 border-slate-200">
                <Building className="h-5 w-5 text-teal-600" />
                Basic Information
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label
                    htmlFor="code"
                    className="text-sm font-medium text-navy-700 flex items-center gap-1"
                  >
                    Apartment Code <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="code"
                    name="code"
                    value={formData.code || ""}
                    onChange={handleChange}
                    placeholder="e.g., A101"
                    required
                    className="h-10 text-base placeholder:text-slate-400"
                  />
                </div>

                <div className="space-y-2">
                  <Label
                    htmlFor="name"
                    className="text-sm font-medium text-navy-700 flex items-center gap-1"
                  >
                    Apartment Name <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="name"
                    name="name"
                    value={formData.name || ""}
                    onChange={handleChange}
                    placeholder="e.g., Oceanview Apartment 101"
                    required
                    className="h-10 text-base placeholder:text-slate-400"
                  />
                </div>
              </div>

              <div className="space-y-2 mt-2">
                <Label
                  htmlFor="address"
                  className="text-sm font-medium text-navy-700"
                >
                  Address
                </Label>
                <Input
                  id="address"
                  name="address"
                  value={formData.address || ""}
                  onChange={handleChange}
                  placeholder="Full address"
                  className="h-10 text-base placeholder:text-slate-400"
                />
              </div>
            </div>

            {/* Building Details Section */}
            <div className="space-y-6 md:col-span-2 bg-white/80 p-6 rounded-lg border border-slate-100 shadow-sm backdrop-blur-sm mt-4">
              <h3 className="text-lg font-semibold text-navy-800 flex items-center gap-2 pb-2 border-b-2 border-slate-200">
                <Home className="h-5 w-5 text-teal-600" />
                Building Details
              </h3>

              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label
                    htmlFor="building"
                    className="text-sm font-medium text-navy-700"
                  >
                    Building
                  </Label>
                  <Input
                    id="building"
                    name="building"
                    value={formData.building || ""}
                    onChange={handleChange}
                    placeholder="e.g., A"
                    className="h-10 text-base placeholder:text-slate-400"
                  />
                </div>

                <div className="space-y-2">
                  <Label
                    htmlFor="floor"
                    className="text-sm font-medium text-navy-700"
                  >
                    Floor
                  </Label>
                  <Input
                    id="floor"
                    name="floor"
                    type="number"
                    value={formData.floor || ""}
                    onChange={handleChange}
                    placeholder="e.g., 1"
                    className="h-10 text-base placeholder:text-slate-400"
                  />
                </div>
              </div>
            </div>

            {/* Apartment Details Section */}
            <div className="space-y-6 md:col-span-2 bg-white/80 p-6 rounded-lg border border-slate-100 shadow-sm backdrop-blur-sm mt-4">
              <h3 className="text-lg font-semibold text-navy-800 flex items-center gap-2 pb-2 border-b-2 border-slate-200">
                <Home className="h-5 w-5 text-teal-600" />
                Apartment Details
              </h3>

              <div className="grid grid-cols-3 gap-6">
                <div className="space-y-2">
                  <Label
                    htmlFor="bedrooms"
                    className="flex items-center gap-2 text-sm font-medium text-navy-700"
                  >
                    <BedDouble className="h-5 w-5 text-teal-600" />
                    Bedrooms
                  </Label>
                  <Input
                    id="bedrooms"
                    name="bedrooms"
                    type="number"
                    value={formData.bedrooms || ""}
                    onChange={handleChange}
                    placeholder="0"
                    className="h-10 text-base placeholder:text-slate-400"
                  />
                </div>

                <div className="space-y-2">
                  <Label
                    htmlFor="bathrooms"
                    className="flex items-center gap-2 text-sm font-medium text-navy-700"
                  >
                    <Bath className="h-5 w-5 text-teal-600" />
                    Bathrooms
                  </Label>
                  <Input
                    id="bathrooms"
                    name="bathrooms"
                    type="number"
                    value={formData.bathrooms || ""}
                    onChange={handleChange}
                    placeholder="0"
                    className="h-10 text-base placeholder:text-slate-400"
                  />
                </div>

                <div className="space-y-2">
                  <Label
                    htmlFor="squareFeet"
                    className="flex items-center gap-2 text-sm font-medium text-navy-700"
                  >
                    <SquareIcon className="h-5 w-5 text-teal-600" />
                    Square Feet
                  </Label>
                  <Input
                    id="squareFeet"
                    name="squareFeet"
                    type="number"
                    value={formData.squareFeet || ""}
                    onChange={handleChange}
                    placeholder="0"
                    className="h-10 text-base placeholder:text-slate-400"
                  />
                </div>
              </div>
            </div>

            {/* Base Rent Section */}
            <div className="space-y-6 md:col-span-2 bg-teal-50/70 p-6 rounded-lg border border-teal-100 shadow-sm backdrop-blur-sm mt-4">
              <h3 className="text-lg font-semibold text-navy-800 flex items-center gap-2 pb-2 border-b-2 border-teal-200">
                <DollarSign className="h-5 w-5 text-teal-600" />
                Base Rent
              </h3>

              <div className="space-y-2">
                <Label
                  htmlFor="baseRent"
                  className="text-lg font-medium text-navy-700 flex items-center gap-1"
                >
                  Base Rent Amount <span className="text-red-500">*</span>
                </Label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-lg font-bold text-teal-600">
                    $
                  </span>
                  <Input
                    id="baseRent"
                    name="baseRent"
                    type="number"
                    value={formData.baseRent || ""}
                    onChange={handleChange}
                    placeholder="0"
                    required
                    className="pl-8 font-medium text-lg h-12 border-teal-200 focus:border-teal-400 focus:ring-teal-400 placeholder:text-slate-400"
                  />
                </div>
              </div>
            </div>

            {/* Standard Utility Costs */}
            <div className="space-y-6 md:col-span-2 bg-white/80 p-6 rounded-lg border border-slate-100 shadow-sm backdrop-blur-sm mt-4">
              <h3 className="text-lg font-semibold text-navy-800 flex items-center gap-2 pb-2 border-b-2 border-slate-200">
                <DollarSign className="h-5 w-5 text-teal-600" />
                Standard Utility Costs
              </h3>

              <div className="grid grid-cols-2 md:grid-cols-3 gap-6 mt-2">
                <div className="space-y-2">
                  <Label
                    htmlFor="standardWaterBill"
                    className="flex items-center gap-2 text-sm font-medium text-navy-700"
                  >
                    <Droplet className="h-4 w-4 text-blue-500" /> Water
                  </Label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-slate-500">
                      $
                    </span>
                    <Input
                      id="standardWaterBill"
                      name="standardWaterBill"
                      type="number"
                      value={formData.standardWaterBill || ""}
                      onChange={handleChange}
                      placeholder="0"
                      className="pl-6 h-10 text-base placeholder:text-slate-400"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label
                    htmlFor="standardElectricityBill"
                    className="flex items-center gap-2 text-sm font-medium text-navy-700"
                  >
                    <Lightbulb className="h-4 w-4 text-yellow-500" />{" "}
                    Electricity
                  </Label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-slate-500">
                      $
                    </span>
                    <Input
                      id="standardElectricityBill"
                      name="standardElectricityBill"
                      type="number"
                      value={formData.standardElectricityBill || ""}
                      onChange={handleChange}
                      placeholder="0"
                      className="pl-6 h-10 text-base placeholder:text-slate-400"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label
                    htmlFor="standardGasBill"
                    className="flex items-center gap-2 text-sm font-medium text-navy-700"
                  >
                    <Flame className="h-4 w-4 text-orange-500" /> Gas
                  </Label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-slate-500">
                      $
                    </span>
                    <Input
                      id="standardGasBill"
                      name="standardGasBill"
                      type="number"
                      value={formData.standardGasBill || ""}
                      onChange={handleChange}
                      placeholder="0"
                      className="pl-6 h-10 text-base placeholder:text-slate-400"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label
                    htmlFor="standardInternetBill"
                    className="flex items-center gap-2 text-sm font-medium text-navy-700"
                  >
                    <Wifi className="h-4 w-4 text-cyan-500" /> Internet
                  </Label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-slate-500">
                      $
                    </span>
                    <Input
                      id="standardInternetBill"
                      name="standardInternetBill"
                      type="number"
                      value={formData.standardInternetBill || ""}
                      onChange={handleChange}
                      placeholder="0"
                      className="pl-6 h-10 text-base placeholder:text-slate-400"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label
                    htmlFor="standardServiceCharge"
                    className="flex items-center gap-2 text-sm font-medium text-navy-700"
                  >
                    <Wrench className="h-4 w-4 text-indigo-500" /> Service
                    Charge
                  </Label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-slate-500">
                      $
                    </span>
                    <Input
                      id="standardServiceCharge"
                      name="standardServiceCharge"
                      type="number"
                      value={formData.standardServiceCharge || ""}
                      onChange={handleChange}
                      placeholder="0"
                      className="pl-6 h-10 text-base placeholder:text-slate-400"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label
                    htmlFor="standardTrashBill"
                    className="flex items-center gap-2 text-sm font-medium text-navy-700"
                  >
                    <Trash2 className="h-4 w-4 text-gray-500" /> Trash
                  </Label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-slate-500">
                      $
                    </span>
                    <Input
                      id="standardTrashBill"
                      name="standardTrashBill"
                      type="number"
                      value={formData.standardTrashBill || ""}
                      onChange={handleChange}
                      placeholder="0"
                      className="pl-6 h-10 text-base placeholder:text-slate-400"
                    />
                  </div>
                </div>
              </div>

              {/* Add Other Charges section */}
              <div className="space-y-4 mt-6 pt-6 border-t border-slate-200 md:col-span-3">
                <Label className="flex items-center gap-2 text-sm font-medium text-navy-700">
                  <DollarSign className="h-4 w-4 text-purple-500" /> Other
                  Standard Charges
                </Label>
                <p className="text-xs text-slate-500 mb-3 bg-slate-50 p-3 rounded-md border-l-2 border-slate-300">
                  These charges will be applied by default to all tenants.
                  Tenant-specific charges can be added when creating bills.
                </p>

                {/* Display existing charges */}
                {otherCharges.length > 0 && (
                  <div className="space-y-3">
                    <div className="text-sm font-medium text-navy-700 mb-2">
                      Current Charges:
                    </div>
                    <div className="space-y-2">
                      {otherCharges.map((charge) => (
                        <div
                          key={charge.id}
                          className="flex items-center justify-between bg-white/80 p-3 rounded-md border border-slate-200 backdrop-blur-sm"
                        >
                          <div className="flex-1">
                            <div className="font-medium">{charge.name}</div>
                            <div className="text-sm text-slate-500">
                              {charge.description}
                            </div>
                          </div>
                          <div className="flex items-center gap-3">
                            <div className="font-medium text-teal-700">
                              ${charge.amount}
                            </div>
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 text-slate-500 hover:text-red-500"
                              onClick={() => removeCharge(charge.id!)}
                            >
                              <X className="h-4 w-4" />
                              <span className="sr-only">Remove</span>
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Form to add new charges */}
                <div className="bg-slate-50/90 p-4 rounded-md border border-slate-200 mt-4 backdrop-blur-sm">
                  <div className="text-sm font-medium text-navy-700 mb-3">
                    Add New Charge:
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="chargeName" className="text-xs ">
                        Charge Name
                      </Label>
                      <Input
                        id="chargeName"
                        name="name"
                        value={newCharge.name}
                        onChange={handleNewChargeChange}
                        placeholder="e.g., Parking Fee"
                        className="text-base placeholder:text-slate-400"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="chargeAmount" className="text-xs">
                        Amount
                      </Label>
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs text-slate-500">
                          $
                        </span>
                        <Input
                          id="chargeAmount"
                          name="amount"
                          type="number"
                          value={newCharge.amount || ""}
                          onChange={handleNewChargeChange}
                          placeholder="0"
                          className="pl-6 h-9 text-sm placeholder:text-slate-400"
                        />
                      </div>
                    </div>
                  </div>
                  <div className="mt-3 flex justify-end">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      className="text-xs px-3 py-1 h-auto border-teal-300 text-teal-700 hover:bg-teal-50 hover:text-teal-800 hover:border-teal-400"
                      onClick={addCharge}
                      disabled={!newCharge.name || !newCharge.amount}
                    >
                      <span className="mr-1">+</span> Add Charge
                    </Button>
                  </div>
                </div>
              </div>

              <div className="md:col-span-2 border-t border-slate-200 pt-6 mt-6">
                <div className="bg-gradient-to-r from-teal-50 to-teal-100 p-5 rounded-lg border border-teal-200 shadow-sm backdrop-blur-sm">
                  <div className="flex justify-between items-center">
                    <Label className="text-teal-800 font-semibold text-lg">
                      Estimated Monthly Total
                    </Label>
                    <div className="text-2xl font-bold text-teal-700 bg-white px-4 py-2 rounded-md border border-teal-200 shadow-sm">
                      ${calculateEstimatedTotal()}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <DialogFooter className="pt-6 pb-4 mt-4 border-t border-slate-200 bg-slate-50 px-6">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="h-11 px-5 border-slate-300 text-slate-700 hover:bg-slate-100 hover:text-slate-900"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="bg-teal-600 hover:bg-teal-700 text-white h-11 px-6 text-base font-medium shadow-sm"
            >
              {apartment ? "Update Apartment" : "Create Apartment"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
