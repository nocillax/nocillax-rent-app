"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Apartment, Tenant } from "@/types/apartment";
import {
  Calendar,
  Phone,
  User,
  DollarSign,
  Shield,
  Droplet,
  Lightbulb,
  Flame,
  Wifi,
  Wrench,
  Trash2,
} from "lucide-react";

interface TenantAssignFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (tenantData: Partial<Tenant>) => void;
  apartment: Apartment;
}

export function TenantAssignForm({
  isOpen,
  onClose,
  onSave,
  apartment,
}: TenantAssignFormProps) {
  const [formData, setFormData] = useState<Partial<Tenant>>({
    name: "",
    phoneNumber: "",
    securityDeposit: 0,
    creditBalance: 0,
    moveInDate: new Date().toISOString().split("T")[0], // Today's date in YYYY-MM-DD
    waterBillEnabled: true,
    gasBillEnabled: true,
    electricityBillEnabled: true,
    internetBillEnabled: true,
    serviceChargeEnabled: true,
    trashBillEnabled: true,
  });

  const [useStandardRates, setUseStandardRates] = useState(true);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type } = e.target;

    if (
      type === "number" ||
      name === "securityDeposit" ||
      name === "creditBalance"
    ) {
      setFormData({
        ...formData,
        [name]: value !== "" ? parseFloat(value) : 0,
      });
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }
  };

  const handleCheckboxChange = (name: string, checked: boolean) => {
    setFormData({
      ...formData,
      [name]: checked,
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Create a new tenant with the form data
    const newTenant: Partial<Tenant> = {
      ...formData,
      // Add any additional fields needed
    };

    onSave(newTenant);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] p-0 overflow-hidden">
        <DialogHeader className="p-6 bg-teal-50">
          <DialogTitle className="text-2xl font-display font-bold text-navy-800">
            Assign New Tenant
          </DialogTitle>
        </DialogHeader>

        <form
          onSubmit={handleSubmit}
          className="space-y-6 p-6 max-h-[70vh] overflow-y-auto"
        >
          {/* Basic Tenant Info */}
          <div className="space-y-4">
            <h3 className="font-medium text-navy-700 flex items-center gap-2">
              <User className="h-4 w-4 text-teal-600" />
              Tenant Information
            </h3>

            <div className="space-y-3">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  name="name"
                  value={formData.name || ""}
                  onChange={handleChange}
                  placeholder="Enter tenant's full name"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="phoneNumber">Phone Number</Label>
                <Input
                  id="phoneNumber"
                  name="phoneNumber"
                  value={formData.phoneNumber || ""}
                  onChange={handleChange}
                  placeholder="Enter phone number"
                  required
                />
              </div>
            </div>
          </div>

          {/* Financial Details */}
          <div className="space-y-4">
            <h3 className="font-medium text-navy-700 flex items-center gap-2">
              <DollarSign className="h-4 w-4 text-teal-600" />
              Financial Details
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label
                  htmlFor="securityDeposit"
                  className="flex items-center gap-1"
                >
                  <Shield className="h-3 w-3" /> Security Deposit
                </Label>
                <Input
                  id="securityDeposit"
                  name="securityDeposit"
                  type="number"
                  value={formData.securityDeposit || ""}
                  onChange={handleChange}
                  placeholder="0"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label
                  htmlFor="creditBalance"
                  className="flex items-center gap-1"
                >
                  Initial Credit Balance
                </Label>
                <Input
                  id="creditBalance"
                  name="creditBalance"
                  type="number"
                  value={formData.creditBalance || ""}
                  onChange={handleChange}
                  placeholder="0"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="moveInDate" className="flex items-center gap-1">
                <Calendar className="h-3 w-3" /> Move In Date
              </Label>
              <Input
                id="moveInDate"
                name="moveInDate"
                type="date"
                value={formData.moveInDate}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          {/* Billing Configuration */}
          <div className="space-y-4">
            <h3 className="font-medium text-navy-700 flex items-center gap-2">
              <Calendar className="h-4 w-4 text-teal-600" />
              Billing Configuration
            </h3>

            <div className="flex items-center space-x-2 pb-2">
              <Checkbox
                id="useStandardRates"
                checked={useStandardRates}
                onCheckedChange={(checked) =>
                  setUseStandardRates(checked as boolean)
                }
              />
              <label
                htmlFor="useStandardRates"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                Use apartment's standard utility rates
              </label>
            </div>

            <div className="space-y-3 border p-4 rounded-md bg-slate-50">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="waterBillEnabled"
                    checked={formData.waterBillEnabled}
                    onCheckedChange={(checked) =>
                      handleCheckboxChange(
                        "waterBillEnabled",
                        checked as boolean
                      )
                    }
                  />
                  <label
                    htmlFor="waterBillEnabled"
                    className="text-sm font-medium leading-none flex items-center gap-1"
                  >
                    <Droplet className="h-3 w-3 text-blue-500" /> Water Bill
                  </label>
                </div>
                <span className="text-sm text-slate-600">
                  ${apartment.standardWaterBill || 0} /month
                </span>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="electricityBillEnabled"
                    checked={formData.electricityBillEnabled}
                    onCheckedChange={(checked) =>
                      handleCheckboxChange(
                        "electricityBillEnabled",
                        checked as boolean
                      )
                    }
                  />
                  <label
                    htmlFor="electricityBillEnabled"
                    className="text-sm font-medium leading-none flex items-center gap-1"
                  >
                    <Lightbulb className="h-3 w-3 text-yellow-500" />{" "}
                    Electricity Bill
                  </label>
                </div>
                <span className="text-sm text-slate-600">
                  ${apartment.standardElectricityBill || 0} /month
                </span>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="gasBillEnabled"
                    checked={formData.gasBillEnabled}
                    onCheckedChange={(checked) =>
                      handleCheckboxChange("gasBillEnabled", checked as boolean)
                    }
                  />
                  <label
                    htmlFor="gasBillEnabled"
                    className="text-sm font-medium leading-none flex items-center gap-1"
                  >
                    <Flame className="h-3 w-3 text-orange-500" /> Gas Bill
                  </label>
                </div>
                <span className="text-sm text-slate-600">
                  ${apartment.standardGasBill || 0} /month
                </span>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="internetBillEnabled"
                    checked={formData.internetBillEnabled}
                    onCheckedChange={(checked) =>
                      handleCheckboxChange(
                        "internetBillEnabled",
                        checked as boolean
                      )
                    }
                  />
                  <label
                    htmlFor="internetBillEnabled"
                    className="text-sm font-medium leading-none flex items-center gap-1"
                  >
                    <Wifi className="h-3 w-3 text-cyan-500" /> Internet Bill
                  </label>
                </div>
                <span className="text-sm text-slate-600">
                  ${apartment.standardInternetBill || 0} /month
                </span>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="serviceChargeEnabled"
                    checked={formData.serviceChargeEnabled}
                    onCheckedChange={(checked) =>
                      handleCheckboxChange(
                        "serviceChargeEnabled",
                        checked as boolean
                      )
                    }
                  />
                  <label
                    htmlFor="serviceChargeEnabled"
                    className="text-sm font-medium leading-none flex items-center gap-1"
                  >
                    <Wrench className="h-3 w-3 text-indigo-500" /> Service
                    Charge
                  </label>
                </div>
                <span className="text-sm text-slate-600">
                  ${apartment.standardServiceCharge || 0} /month
                </span>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="trashBillEnabled"
                    checked={formData.trashBillEnabled}
                    onCheckedChange={(checked) =>
                      handleCheckboxChange(
                        "trashBillEnabled",
                        checked as boolean
                      )
                    }
                  />
                  <label
                    htmlFor="trashBillEnabled"
                    className="text-sm font-medium leading-none flex items-center gap-1"
                  >
                    <Trash2 className="h-3 w-3 text-gray-500" /> Trash Bill
                  </label>
                </div>
                <span className="text-sm text-slate-600">
                  ${apartment.standardTrashBill || 0} /month
                </span>
              </div>
            </div>
          </div>

          <DialogFooter className="pt-2">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button
              type="submit"
              className="bg-teal-600 hover:bg-teal-700 text-white"
            >
              Assign Tenant
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
