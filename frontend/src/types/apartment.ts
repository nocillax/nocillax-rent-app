export interface Bill {
  id: number;
  month: number;
  year: number;
  dueDate: string;
  rent: number;
  waterBill: number;
  gasBill: number;
  electricityBill: number;
  internetBill: number;
  serviceCharge: number;
  trashBill: number;
  otherCharges: number;
  previousBalance: number;
  advancePayment: number;
  total: number;
  isPaid: boolean;
  otherChargeItems?: {
    id: number;
    description: string;
    amount: number;
  }[];
}

export interface Tenant {
  id: number;
  name: string;
  phoneNumber?: string;
  nid?: string;
  photoUrl?: string;
  securityDeposit: number;
  creditBalance: number; // Renamed from advancePayment to match backend
  moveInDate: string;
  waterBillEnabled: boolean;
  gasBillEnabled: boolean;
  electricityBillEnabled: boolean;
  internetBillEnabled: boolean;
  serviceChargeEnabled: boolean;
  trashBillEnabled: boolean;
}

export interface OtherCharge {
  id?: number;
  name: string;
  amount: number;
  description?: string;
}

export interface Apartment {
  id: number;
  code: string;
  name: string;
  address: string;
  description?: string;
  baseRent: number;
  standardWaterBill?: number;
  standardElectricityBill?: number;
  standardGasBill?: number;
  standardInternetBill?: number;
  standardServiceCharge?: number;
  standardTrashBill?: number;
  otherCharges?: OtherCharge[];
  estimatedTotalRent: number;
  isActive: boolean;
  isOccupied: boolean;
  floor?: number;
  building?: string;
  bedrooms?: number;
  bathrooms?: number;
  squareFeet?: number;
  currentTenant?: Tenant;
  bills: Bill[];
}

export interface ApartmentFilters {
  query?: string;
  building?: string;
  status?: "all" | "occupied" | "vacant";
  sortBy?: "name" | "rent" | "totalRent";
  sortOrder?: "asc" | "desc";
}
