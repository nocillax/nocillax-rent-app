import { Apartment, Bill, Tenant } from "@/types/apartment";

/**
 * Generate mock data for the application based on backend data structure
 */
export function generateMockData() {
  // Mock bills
  const generateBills = (
    apartmentId: number,
    tenantId: number,
    isOccupied: boolean
  ): Bill[] => {
    if (!isOccupied) return [];

    const currentDate = new Date();
    const currentYear = currentDate.getFullYear();
    const currentMonth = currentDate.getMonth() + 1;

    const bills: Bill[] = [];

    // Generate 5 months of bills (including current month)
    for (let i = 0; i < 5; i++) {
      const billMonth = currentMonth - i;
      const billYear = billMonth <= 0 ? currentYear - 1 : currentYear;
      const adjustedMonth = billMonth <= 0 ? billMonth + 12 : billMonth;

      const waterBill = Math.round(Math.random() * 50 + 30);
      const electricityBill = Math.round(Math.random() * 80 + 50);
      const gasBill = Math.round(Math.random() * 40 + 20);
      const internetBill = Math.round(Math.random() * 30 + 40);
      const serviceCharge = Math.round(Math.random() * 20 + 80);
      const trashBill = Math.round(Math.random() * 10 + 20);
      const otherCharges = i === 0 ? Math.round(Math.random() * 50) : 0;

      // Add some previous balance and advance payment for realism
      const previousBalance = i === 0 ? Math.round(Math.random() * 100) : 0;
      const advancePayment =
        i === 0 && Math.random() > 0.7 ? Math.round(Math.random() * 200) : 0;

      const baseRent = apartmentId % 2 === 0 ? 1000 : 1200;
      const totalBeforeAdvance =
        baseRent +
        waterBill +
        electricityBill +
        gasBill +
        internetBill +
        serviceCharge +
        trashBill +
        otherCharges +
        previousBalance;

      const totalBill = Math.max(0, totalBeforeAdvance - advancePayment);

      // Older bills are more likely to be paid
      const isPaid = i > 0 ? Math.random() > 0.2 : Math.random() > 0.6;

      bills.push({
        id: 1000 + apartmentId * 10 + i,
        month: adjustedMonth,
        year: billYear,
        dueDate: `${billYear}-${String(adjustedMonth).padStart(2, "0")}-15`,
        rent: baseRent,
        waterBill,
        electricityBill,
        gasBill,
        internetBill,
        serviceCharge,
        trashBill,
        otherCharges,
        previousBalance,
        advancePayment,
        total: totalBill,
        isPaid,
        otherChargeItems:
          otherCharges > 0
            ? [
                {
                  id: 5000 + i,
                  description: "Maintenance fee",
                  amount: otherCharges,
                },
              ]
            : undefined,
      });
    }

    return bills;
  };

  // Mock tenants with different configurations
  const tenants: Tenant[] = [
    {
      id: 1,
      name: "John Smith",
      phoneNumber: "+1 (555) 123-4567",
      securityDeposit: 1500,
      creditBalance: 200,
      moveInDate: "2024-05-15",
      waterBillEnabled: true,
      gasBillEnabled: true,
      electricityBillEnabled: true,
      internetBillEnabled: true,
      serviceChargeEnabled: true,
      trashBillEnabled: true,
    },
    {
      id: 2,
      name: "Emma Wilson",
      phoneNumber: "+1 (555) 987-6543",
      securityDeposit: 2000,
      creditBalance: 0,
      moveInDate: "2023-11-01",
      waterBillEnabled: true,
      gasBillEnabled: false,
      electricityBillEnabled: true,
      internetBillEnabled: false,
      serviceChargeEnabled: true,
      trashBillEnabled: true,
    },
    {
      id: 3,
      name: "Michael Johnson",
      phoneNumber: "+1 (555) 456-7890",
      securityDeposit: 1800,
      creditBalance: 500,
      moveInDate: "2024-02-20",
      waterBillEnabled: false,
      gasBillEnabled: true,
      electricityBillEnabled: true,
      internetBillEnabled: true,
      serviceChargeEnabled: true,
      trashBillEnabled: false,
    },
    {
      id: 4,
      name: "Sarah Chang",
      phoneNumber: "+1 (555) 234-5678",
      securityDeposit: 1600,
      creditBalance: 100,
      moveInDate: "2023-09-10",
      waterBillEnabled: true,
      gasBillEnabled: true,
      electricityBillEnabled: true,
      internetBillEnabled: true,
      serviceChargeEnabled: true,
      trashBillEnabled: true,
    },
  ];

  // Generate mock apartments
  const apartments: Apartment[] = [
    {
      id: 101,
      code: "A101",
      name: "Oceanview Apartment 101",
      address: "123 Main Street, Apt 101",
      description: "Spacious apartment with ocean view and modern amenities",
      baseRent: 1200,
      standardWaterBill: 40,
      standardElectricityBill: 65,
      standardGasBill: 30,
      standardInternetBill: 45,
      standardServiceCharge: 90,
      standardTrashBill: 25,
      estimatedTotalRent: 1450,
      isActive: true,
      isOccupied: true,
      building: "A",
      floor: 1,
      bedrooms: 2,
      bathrooms: 1,
      squareFeet: 850,
      currentTenant: tenants[0],
      bills: generateBills(101, 1, true),
    },
    {
      id: 102,
      code: "A102",
      name: "Garden Suite 102",
      address: "123 Main Street, Apt 102",
      description: "Cozy apartment with garden access",
      baseRent: 1000,
      standardWaterBill: 35,
      standardElectricityBill: 60,
      standardGasBill: 25,
      standardInternetBill: 40,
      standardServiceCharge: 85,
      standardTrashBill: 20,
      estimatedTotalRent: 1200,
      isActive: true,
      isOccupied: false,
      building: "A",
      floor: 1,
      bedrooms: 1,
      bathrooms: 1,
      squareFeet: 650,
      bills: [],
    },
    {
      id: 201,
      code: "B201",
      name: "Sunset Heights 201",
      address: "123 Main Street, Apt 201",
      description: "Luxury apartment with sunset view and premium finishes",
      baseRent: 1500,
      standardWaterBill: 45,
      standardElectricityBill: 75,
      standardGasBill: 35,
      standardInternetBill: 50,
      standardServiceCharge: 100,
      standardTrashBill: 30,
      estimatedTotalRent: 1850,
      isActive: true,
      isOccupied: true,
      building: "B",
      floor: 2,
      bedrooms: 2,
      bathrooms: 2,
      squareFeet: 950,
      currentTenant: tenants[1],
      bills: generateBills(201, 2, true),
    },
    {
      id: 202,
      code: "B202",
      name: "City View 202",
      address: "123 Main Street, Apt 202",
      description: "Modern apartment with city skyline views",
      baseRent: 1400,
      standardWaterBill: 42,
      standardElectricityBill: 70,
      standardGasBill: 32,
      standardInternetBill: 48,
      standardServiceCharge: 95,
      standardTrashBill: 28,
      estimatedTotalRent: 1700,
      isActive: true,
      isOccupied: true,
      building: "B",
      floor: 2,
      bedrooms: 2,
      bathrooms: 1,
      squareFeet: 800,
      currentTenant: tenants[2],
      bills: generateBills(202, 3, true),
    },
    {
      id: 301,
      code: "C301",
      name: "Penthouse Suite 301",
      address: "123 Main Street, Apt 301",
      description: "Premium penthouse with private terrace and panoramic views",
      baseRent: 2000,
      standardWaterBill: 55,
      standardElectricityBill: 85,
      standardGasBill: 40,
      standardInternetBill: 55,
      standardServiceCharge: 120,
      standardTrashBill: 35,
      estimatedTotalRent: 2350,
      isActive: true,
      isOccupied: true,
      building: "C",
      floor: 3,
      bedrooms: 3,
      bathrooms: 2,
      squareFeet: 1200,
      currentTenant: tenants[3],
      bills: generateBills(301, 4, true),
    },
    {
      id: 302,
      code: "C302",
      name: "Executive Suite 302",
      address: "123 Main Street, Apt 302",
      description: "Executive living with premium amenities",
      baseRent: 1800,
      standardWaterBill: 50,
      standardElectricityBill: 80,
      standardGasBill: 38,
      standardInternetBill: 52,
      standardServiceCharge: 110,
      standardTrashBill: 32,
      estimatedTotalRent: 2100,
      isActive: true,
      isOccupied: false,
      building: "C",
      floor: 3,
      bedrooms: 2,
      bathrooms: 2,
      squareFeet: 1000,
      bills: [],
    },
    {
      id: 401,
      code: "D401",
      name: "Courtyard Studio 401",
      address: "123 Main Street, Apt 401",
      description: "Cozy studio apartment with courtyard access",
      baseRent: 900,
      standardWaterBill: 30,
      standardElectricityBill: 55,
      standardGasBill: 20,
      standardInternetBill: 40,
      standardServiceCharge: 70,
      standardTrashBill: 18,
      estimatedTotalRent: 1050,
      isActive: true,
      isOccupied: false,
      building: "D",
      floor: 4,
      bedrooms: 0,
      bathrooms: 1,
      squareFeet: 500,
      bills: [],
    },
    {
      id: 402,
      code: "D402",
      name: "Deluxe Loft 402",
      address: "123 Main Street, Apt 402",
      description: "Modern loft-style apartment with high ceilings",
      baseRent: 1300,
      standardWaterBill: 38,
      standardElectricityBill: 65,
      standardGasBill: 28,
      standardInternetBill: 45,
      standardServiceCharge: 85,
      standardTrashBill: 25,
      estimatedTotalRent: 1550,
      isActive: true,
      isOccupied: false,
      building: "D",
      floor: 4,
      bedrooms: 1,
      bathrooms: 1,
      squareFeet: 750,
      bills: [],
    },
  ];

  return { apartments, tenants };
}
