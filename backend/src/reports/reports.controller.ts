import { Controller, Get, Param, Query, Res, HttpStatus, HttpException, UseGuards } from '@nestjs/common';
import { ReportsService } from './reports.service';
import type { Response } from 'express';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('reports')
export class ReportsController {
  constructor(private readonly reportsService: ReportsService) {}

  @Get('monthly/:year/:month')
  @UseGuards(JwtAuthGuard)
  async generateMonthlyReport(
    @Param('year') year: number,
    @Param('month') month: number,
    @Res() res: Response,
  ): Promise<void> {
    try {
      const pdfBuffer = await this.reportsService.generateMonthlyPdfReport(year, month);
      
      // Set headers for PDF download
      const monthName = new Date(year, month - 1, 1).toLocaleString('default', { month: 'long' });
      const filename = `monthly-report-${monthName}-${year}.pdf`;
      
      res.set({
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename=${filename}`,
        'Content-Length': pdfBuffer.length,
      });
      
      res.end(pdfBuffer);
    } catch (error) {
      throw new HttpException(
        `Failed to generate monthly report: ${error.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
  
  @Get('monthly-pdf')
  @UseGuards(JwtAuthGuard)
  async generateMonthlyPdf(
    @Query('year') year: number,
    @Query('month') month: number,
    @Res() res: Response,
  ): Promise<void> {
    if (!year || !month) {
      throw new HttpException('Year and month are required', HttpStatus.BAD_REQUEST);
    }

    try {
      const pdfBuffer = await this.reportsService.generateMonthlyPdfReport(year, month);
      
      // Set headers for PDF download
      const monthName = new Date(year, month - 1, 1).toLocaleString('default', { month: 'long' });
      const filename = `monthly-report-${monthName}-${year}.pdf`;
      
      res.set({
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename=${filename}`,
        'Content-Length': pdfBuffer.length,
      });
      
      res.end(pdfBuffer);
    } catch (error) {
      throw new HttpException(
        `Failed to generate monthly PDF report: ${error.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get('tenant/:id')
  @UseGuards(JwtAuthGuard)
  async generateTenantReport(
    @Param('id') tenantId: number,
    @Query('startDate') startDate: string,
    @Query('endDate') endDate: string,
    @Res() res: Response,
  ): Promise<void> {
    if (!startDate || !endDate) {
      throw new HttpException('Start date and end date are required', HttpStatus.BAD_REQUEST);
    }

    try {
      const pdfBuffer = await this.reportsService.generateTenantStatement(
        tenantId,
        new Date(startDate),
        new Date(endDate),
      );
      
      // Set headers for PDF download
      const filename = `tenant-${tenantId}-statement.pdf`;
      
      res.set({
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename=${filename}`,
        'Content-Length': pdfBuffer.length,
      });
      
      res.end(pdfBuffer);
    } catch (error) {
      throw new HttpException(
        `Failed to generate tenant report: ${error.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
  
  @Get('tenant/:id/statement')
  @UseGuards(JwtAuthGuard)
  async generateTenantStatement(
    @Param('id') tenantId: number,
    @Query('startDate') startDate: string,
    @Query('endDate') endDate: string,
    @Res() res: Response,
  ): Promise<void> {
    if (!startDate || !endDate) {
      throw new HttpException('Start date and end date are required', HttpStatus.BAD_REQUEST);
    }

    try {
      const pdfBuffer = await this.reportsService.generateTenantStatement(
        tenantId,
        new Date(startDate),
        new Date(endDate),
      );
      
      // Set headers for PDF download
      const filename = `tenant-${tenantId}-statement-${startDate}-to-${endDate}.pdf`;
      
      res.set({
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename=${filename}`,
        'Content-Length': pdfBuffer.length,
      });
      
      res.end(pdfBuffer);
    } catch (error) {
      throw new HttpException(
        `Failed to generate tenant statement: ${error.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
