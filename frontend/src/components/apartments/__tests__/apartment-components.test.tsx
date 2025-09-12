import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { ApartmentCard } from "../apartment-card";
import { ApartmentDetailModal } from "../apartment-detail-modal";
import { generateMockData } from "@/lib/mock-data";

// Mock data
const mockData = generateMockData();
const mockApartment = mockData.apartments[0]; // Occupied apartment
const mockVacantApartment = mockData.apartments.find((a) => !a.isOccupied)!; // Vacant apartment

describe("Apartment Card", () => {
  const mockOnClick = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("renders with correct height and spacing", () => {
    const { container } = render(
      <ApartmentCard apartment={mockApartment} onClick={mockOnClick} />
    );

    // Check for fixed height
    const cardElement = container.querySelector('div[class*="h-[250px]"]');
    expect(cardElement).toBeInTheDocument();

    // Check for proper padding
    const contentSection = container.querySelector('div[class*="p-6"]');
    expect(contentSection).toBeInTheDocument();

    // Check for spacing between sections
    const pricingSection = container.querySelector('div[class*="mb-6 pb-5"]');
    expect(pricingSection).toBeInTheDocument();
  });

  test("shows occupied status for occupied apartments", () => {
    render(<ApartmentCard apartment={mockApartment} onClick={mockOnClick} />);

    const badge = screen.getByText("Occupied");
    expect(badge).toBeInTheDocument();
  });

  test("shows vacant status for vacant apartments", () => {
    render(
      <ApartmentCard apartment={mockVacantApartment} onClick={mockOnClick} />
    );

    const badge = screen.getByText("Vacant");
    expect(badge).toBeInTheDocument();
  });

  test("calls onClick when clicked", () => {
    render(<ApartmentCard apartment={mockApartment} onClick={mockOnClick} />);

    const card = screen.getByText(mockApartment.code);
    fireEvent.click(card.closest('div[role="button"]') || card);

    expect(mockOnClick).toHaveBeenCalledWith(mockApartment);
  });
});

describe("Apartment Detail Modal", () => {
  const mockOnClose = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("shows standard utility costs for vacant apartments", () => {
    render(
      <ApartmentDetailModal
        apartment={mockVacantApartment}
        isOpen={true}
        onClose={mockOnClose}
      />
    );

    // Check for vacant status indicator
    expect(screen.getByText("Vacant")).toBeInTheDocument();

    // Should display "Standard Rates" for vacant apartments
    expect(screen.getByText("Standard Rates")).toBeInTheDocument();

    // Should show "Standard Monthly Total" for vacant apartments
    expect(screen.getByText("Standard Monthly Total")).toBeInTheDocument();

    // Click on bills tab to see the standard billing structure
    fireEvent.click(screen.getByText("Bills & Charges"));

    // Check for standard billing structure heading
    expect(screen.getByText("Standard Billing Structure")).toBeInTheDocument();
  });

  test("shows tenant bill configuration for occupied apartments", () => {
    render(
      <ApartmentDetailModal
        apartment={mockApartment}
        isOpen={true}
        onClose={mockOnClose}
      />
    );

    // Check for occupied status indicator
    expect(screen.getByText("Occupied")).toBeInTheDocument();

    // Should show "Total Monthly" for occupied apartments
    expect(screen.getByText("Total Monthly")).toBeInTheDocument();

    // Click on bills tab
    fireEvent.click(screen.getByText("Bills & Charges"));

    // Should show current bill for occupied apartments
    expect(screen.getByText("Current Bill")).toBeInTheDocument();

    // Click on tenant tab
    fireEvent.click(screen.getByText("Tenant Info"));

    // Should show tenant billing configuration
    expect(screen.getByText("Billing Configuration")).toBeInTheDocument();
  });
});
