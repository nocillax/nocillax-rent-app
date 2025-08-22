import PDFDocument from 'pdfkit';
import * as fs from 'fs-extra';
import { Injectable } from '@nestjs/common';
import { Bill } from '../entities/bill.entity';
import { Payment } from '../entities/payment.entity';
import { Tenant } from '../entities/tenant.entity';

@Injectable()
export class ReportsGenerator {
  async generateMonthlyPdfReport(
    bills: Bill[],
    payments: Payment[],
    year: number,
    month: number,
  ): Promise<Buffer> {
    // Create a document
    const doc = new PDFDocument({ margin: 50 });
    
    // Create a buffer to store the PDF
    const buffers: Buffer[] = [];
    doc.on('data', buffers.push.bind(buffers));
    
    // Add content to the PDF
    this.addHeader(doc, year, month);
    this.addBillsTable(doc, bills);
    this.addPaymentsTable(doc, payments);
    this.addSummary(doc, bills, payments);
    
    // Finalize the PDF and end the stream
    doc.end();
    
    // Wait for the PDF to be fully generated
    return new Promise((resolve) => {
      doc.on('end', () => {
        const pdfBuffer = Buffer.concat(buffers);
        resolve(pdfBuffer);
      });
    });
  }

  async generateTenantStatementPdf(
    tenant: Tenant,
    bills: Bill[],
    payments: Payment[],
    startDate: Date,
    endDate: Date,
  ): Promise<Buffer> {
    // Create a document
    const doc = new PDFDocument({ margin: 50 });
    
    // Create a buffer to store the PDF
    const buffers: Buffer[] = [];
    doc.on('data', buffers.push.bind(buffers));
    
    // Add content to the PDF
    this.addTenantHeader(doc, tenant, startDate, endDate);
    this.addTenantBillsTable(doc, bills);
    this.addTenantPaymentsTable(doc, payments);
    this.addTenantSummary(doc, bills, payments);
    
    // Finalize the PDF and end the stream
    doc.end();
    
    // Wait for the PDF to be fully generated
    return new Promise((resolve) => {
      doc.on('end', () => {
        const pdfBuffer = Buffer.concat(buffers);
        resolve(pdfBuffer);
      });
    });
  }

  private addHeader(doc: PDFKit.PDFDocument, year: number, month: number): void {
    const monthName = new Date(year, month - 1, 1).toLocaleString('default', { month: 'long' });
    
    doc.fontSize(20).text('Monthly Rent Report', { align: 'center' });
    doc.fontSize(16).text(`${monthName} ${year}`, { align: 'center' });
    doc.moveDown();
    doc.fontSize(10).text(`Report Generated: ${new Date().toLocaleString()}`, { align: 'right' });
    doc.moveDown(2);
  }

  private addBillsTable(doc: PDFKit.PDFDocument, bills: Bill[]): void {
    doc.fontSize(16).text('Bills', { underline: true });
    doc.moveDown();
    
    // Table headers
    const tableTop = doc.y;
    const tableLeft = 50;
    const colWidths = [150, 70, 70, 70, 70, 70];
    
    doc.fontSize(10).text('Tenant', tableLeft, tableTop);
    doc.text('Rent', tableLeft + colWidths[0], tableTop);
    doc.text('Utilities', tableLeft + colWidths[0] + colWidths[1], tableTop);
    doc.text('Total', tableLeft + colWidths[0] + colWidths[1] + colWidths[2], tableTop);
    doc.text('Paid', tableLeft + colWidths[0] + colWidths[1] + colWidths[2] + colWidths[3], tableTop);
    doc.text('Balance', tableLeft + colWidths[0] + colWidths[1] + colWidths[2] + colWidths[3] + colWidths[4], tableTop);
    
    doc.moveDown();
    
    // Table content
    let yPos = doc.y;
    bills.forEach((bill, i) => {
      const utilities = (bill.water_bill || 0) + 
                        (bill.gas_bill || 0) + 
                        (bill.electricity_bill || 0) + 
                        (bill.internet_bill || 0) + 
                        (bill.service_charge || 0) + 
                        (bill.other_charges || 0);
      
      doc.fontSize(10).text(bill.tenant?.name || `Tenant #${bill.tenant_id}`, tableLeft, yPos);
      doc.text(`$${bill.rent.toFixed(2)}`, tableLeft + colWidths[0], yPos);
      doc.text(`$${utilities.toFixed(2)}`, tableLeft + colWidths[0] + colWidths[1], yPos);
      doc.text(`$${bill.total.toFixed(2)}`, tableLeft + colWidths[0] + colWidths[1] + colWidths[2], yPos);
      doc.text(bill.is_paid ? 'Yes' : 'No', tableLeft + colWidths[0] + colWidths[1] + colWidths[2] + colWidths[3], yPos);
      doc.text(bill.is_paid ? '$0.00' : `$${bill.total.toFixed(2)}`, tableLeft + colWidths[0] + colWidths[1] + colWidths[2] + colWidths[3] + colWidths[4], yPos);
      
      yPos += 20;
      
      // Add a new page if we're near the bottom
      if (yPos > doc.page.height - 100 && i < bills.length - 1) {
        doc.addPage();
        yPos = 50;
      }
    });
    
    doc.moveDown(2);
  }

  private addPaymentsTable(doc: PDFKit.PDFDocument, payments: Payment[]): void {
    doc.fontSize(16).text('Payments', { underline: true });
    doc.moveDown();
    
    // Table headers
    const tableTop = doc.y;
    const tableLeft = 50;
    const colWidths = [150, 100, 100, 150];
    
    doc.fontSize(10).text('Tenant', tableLeft, tableTop);
    doc.text('Date', tableLeft + colWidths[0], tableTop);
    doc.text('Amount', tableLeft + colWidths[0] + colWidths[1], tableTop);
    doc.text('Payment Method', tableLeft + colWidths[0] + colWidths[1] + colWidths[2], tableTop);
    
    doc.moveDown();
    
    // Table content
    let yPos = doc.y;
    payments.forEach((payment, i) => {
      doc.fontSize(10).text(payment.tenant?.name || `Tenant #${payment.tenant_id}`, tableLeft, yPos);
      doc.text(payment.date.toLocaleDateString(), tableLeft + colWidths[0], yPos);
      doc.text(`$${payment.amount.toFixed(2)}`, tableLeft + colWidths[0] + colWidths[1], yPos);
      doc.text(payment.payment_method || 'N/A', tableLeft + colWidths[0] + colWidths[1] + colWidths[2], yPos);
      
      yPos += 20;
      
      // Add a new page if we're near the bottom
      if (yPos > doc.page.height - 100 && i < payments.length - 1) {
        doc.addPage();
        yPos = 50;
      }
    });
    
    doc.moveDown(2);
  }

  private addSummary(doc: PDFKit.PDFDocument, bills: Bill[], payments: Payment[]): void {
    doc.fontSize(16).text('Summary', { underline: true });
    doc.moveDown();
    
    const totalBills = bills.reduce((sum, bill) => sum + bill.total, 0);
    const totalPayments = payments.reduce((sum, payment) => sum + payment.amount, 0);
    const outstanding = totalBills - totalPayments;
    
    doc.fontSize(12).text(`Total Bills: $${totalBills.toFixed(2)}`);
    doc.text(`Total Payments: $${totalPayments.toFixed(2)}`);
    doc.text(`Outstanding Balance: $${outstanding.toFixed(2)}`);
    
    doc.moveDown(2);
  }

  private addTenantHeader(
    doc: PDFKit.PDFDocument, 
    tenant: Tenant, 
    startDate: Date, 
    endDate: Date
  ): void {
    doc.fontSize(20).text(`Tenant Statement`, { align: 'center' });
    doc.fontSize(16).text(`${tenant.name}`, { align: 'center' });
    doc.moveDown();
    doc.fontSize(12).text(`Apartment: ${tenant.apartment?.name || `#${tenant.apartment_id}`}`);
    doc.text(`Period: ${startDate.toLocaleDateString()} to ${endDate.toLocaleDateString()}`);
    doc.text(`Generated: ${new Date().toLocaleString()}`);
    doc.moveDown(2);
  }

  private addTenantBillsTable(doc: PDFKit.PDFDocument, bills: Bill[]): void {
    doc.fontSize(16).text('Bills', { underline: true });
    doc.moveDown();
    
    // Table headers
    const tableTop = doc.y;
    const tableLeft = 50;
    const colWidths = [70, 70, 70, 70, 70, 70, 70];
    
    doc.fontSize(10).text('Period', tableLeft, tableTop);
    doc.text('Rent', tableLeft + colWidths[0], tableTop);
    doc.text('Water', tableLeft + colWidths[0] + colWidths[1], tableTop);
    doc.text('Gas', tableLeft + colWidths[0] + colWidths[1] + colWidths[2], tableTop);
    doc.text('Electric', tableLeft + colWidths[0] + colWidths[1] + colWidths[2] + colWidths[3], tableTop);
    doc.text('Other', tableLeft + colWidths[0] + colWidths[1] + colWidths[2] + colWidths[3] + colWidths[4], tableTop);
    doc.text('Total', tableLeft + colWidths[0] + colWidths[1] + colWidths[2] + colWidths[3] + colWidths[4] + colWidths[5], tableTop);
    
    doc.moveDown();
    
    // Table content
    let yPos = doc.y;
    bills.forEach((bill, i) => {
      const otherCharges = (bill.internet_bill || 0) + 
                         (bill.service_charge || 0) + 
                         (bill.other_charges || 0);
      
      const monthName = new Date(bill.year, bill.month - 1, 1).toLocaleString('default', { month: 'short' });
      
      doc.fontSize(10).text(`${monthName} ${bill.year}`, tableLeft, yPos);
      doc.text(`$${bill.rent.toFixed(2)}`, tableLeft + colWidths[0], yPos);
      doc.text(`$${bill.water_bill.toFixed(2)}`, tableLeft + colWidths[0] + colWidths[1], yPos);
      doc.text(`$${bill.gas_bill.toFixed(2)}`, tableLeft + colWidths[0] + colWidths[1] + colWidths[2], yPos);
      doc.text(`$${bill.electricity_bill.toFixed(2)}`, tableLeft + colWidths[0] + colWidths[1] + colWidths[2] + colWidths[3], yPos);
      doc.text(`$${otherCharges.toFixed(2)}`, tableLeft + colWidths[0] + colWidths[1] + colWidths[2] + colWidths[3] + colWidths[4], yPos);
      doc.text(`$${bill.total.toFixed(2)}`, tableLeft + colWidths[0] + colWidths[1] + colWidths[2] + colWidths[3] + colWidths[4] + colWidths[5], yPos);
      
      yPos += 20;
      
      // Add a new page if we're near the bottom
      if (yPos > doc.page.height - 100 && i < bills.length - 1) {
        doc.addPage();
        yPos = 50;
      }
    });
    
    doc.moveDown(2);
  }

  private addTenantPaymentsTable(doc: PDFKit.PDFDocument, payments: Payment[]): void {
    doc.fontSize(16).text('Payments', { underline: true });
    doc.moveDown();
    
    // Table headers
    const tableTop = doc.y;
    const tableLeft = 50;
    const colWidths = [100, 100, 100, 150];
    
    doc.fontSize(10).text('Date', tableLeft, tableTop);
    doc.text('Amount', tableLeft + colWidths[0], tableTop);
    doc.text('Payment Method', tableLeft + colWidths[0] + colWidths[1], tableTop);
    doc.text('Reference', tableLeft + colWidths[0] + colWidths[1] + colWidths[2], tableTop);
    
    doc.moveDown();
    
    // Table content
    let yPos = doc.y;
    payments.forEach((payment, i) => {
      doc.fontSize(10).text(payment.date.toLocaleDateString(), tableLeft, yPos);
      doc.text(`$${payment.amount.toFixed(2)}`, tableLeft + colWidths[0], yPos);
      doc.text(payment.payment_method || 'N/A', tableLeft + colWidths[0] + colWidths[1], yPos);
      doc.text(payment.reference_number || 'N/A', tableLeft + colWidths[0] + colWidths[1] + colWidths[2], yPos);
      
      yPos += 20;
      
      // Add a new page if we're near the bottom
      if (yPos > doc.page.height - 100 && i < payments.length - 1) {
        doc.addPage();
        yPos = 50;
      }
    });
    
    doc.moveDown(2);
  }

  private addTenantSummary(doc: PDFKit.PDFDocument, bills: Bill[], payments: Payment[]): void {
    doc.fontSize(16).text('Account Summary', { underline: true });
    doc.moveDown();
    
    const totalBills = bills.reduce((sum, bill) => sum + bill.total, 0);
    const totalPayments = payments.reduce((sum, payment) => sum + payment.amount, 0);
    const outstanding = totalBills - totalPayments;
    
    doc.fontSize(12).text(`Total Charges: $${totalBills.toFixed(2)}`);
    doc.text(`Total Payments: $${totalPayments.toFixed(2)}`);
    
    if (outstanding > 0) {
      doc.text(`Outstanding Balance: $${outstanding.toFixed(2)}`, { underline: true });
    } else {
      doc.text(`Outstanding Balance: $${outstanding.toFixed(2)}`);
    }
    
    doc.moveDown(2);
  }
}
