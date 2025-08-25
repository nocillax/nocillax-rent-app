import {
  Controller,
  Get,
  Param,
  Query,
  Res,
  HttpStatus,
  HttpException,
  UseGuards,
  ParseIntPipe,
} from '@nestjs/common';
import { ReportsService } from './reports.service';
import type { Response } from 'express';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { MonthlyReportDto } from '../dto/reports/monthly-report.dto';
import { TenantStatementDto } from '../dto/reports/tenant-statement.dto';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiParam,
  ApiQuery,
} from '@nestjs/swagger';

@ApiTags('reports')
@ApiBearerAuth()
@Controller('reports')
export class ReportsController {
  constructor(private readonly reportsService: ReportsService) {}

  @ApiOperation({
    summary: 'Generate monthly report PDF',
    description: 'Creates a PDF report for a specific month and year',
  })
  @ApiParam({ name: 'year', description: 'Year for the report', type: Number })
  @ApiParam({
    name: 'month',
    description: 'Month for the report (1-12)',
    type: Number,
  })
  @ApiResponse({
    status: 200,
    description: 'Returns a PDF document with the monthly report',
  })
  @ApiResponse({
    status: 500,
    description: 'Failed to generate monthly report',
  })
  @Get('monthly/:year/:month')
  @UseGuards(JwtAuthGuard)
  async generateMonthlyReport(
    @Param('year', ParseIntPipe) year: number,
    @Param('month', ParseIntPipe) month: number,
    @Res() res: Response,
  ): Promise<void> {
    try {
      const pdfBuffer = await this.reportsService.generateMonthlyPdfReport(
        year,
        month,
      );

      // Set headers for PDF download
      const monthName = new Date(year, month - 1, 1).toLocaleString('default', {
        month: 'long',
      });
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

  @ApiOperation({
    summary: 'Generate monthly report with query parameters',
    description:
      'Creates a PDF report using query parameters for month and year',
  })
  @ApiQuery({
    name: 'year',
    required: true,
    description: 'Year for the report',
    type: Number,
  })
  @ApiQuery({
    name: 'month',
    required: true,
    description: 'Month for the report (1-12)',
    type: Number,
  })
  @ApiResponse({
    status: 200,
    description: 'Returns a PDF document with the monthly report',
  })
  @ApiResponse({ status: 400, description: 'Year and month are required' })
  @ApiResponse({
    status: 500,
    description: 'Failed to generate monthly PDF report',
  })
  @Get('monthly-pdf')
  @UseGuards(JwtAuthGuard)
  async generateMonthlyPdf(
    @Query('year') year: number,
    @Query('month') month: number,
    @Res() res: Response,
  ): Promise<void> {
    if (!year || !month) {
      throw new HttpException(
        'Year and month are required',
        HttpStatus.BAD_REQUEST,
      );
    }

    try {
      const pdfBuffer = await this.reportsService.generateMonthlyPdfReport(
        year,
        month,
      );

      // Set headers for PDF download
      const monthName = new Date(year, month - 1, 1).toLocaleString('default', {
        month: 'long',
      });
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

  @ApiOperation({
    summary: 'Generate tenant report',
    description:
      'Creates a PDF report for a specific tenant within a date range',
  })
  @ApiParam({ name: 'id', description: 'Tenant ID', type: Number })
  @ApiQuery({
    name: 'startDate',
    required: true,
    description: 'Start date (YYYY-MM-DD)',
    type: String,
  })
  @ApiQuery({
    name: 'endDate',
    required: true,
    description: 'End date (YYYY-MM-DD)',
    type: String,
  })
  @ApiResponse({
    status: 200,
    description: 'Returns a PDF document with the tenant report',
  })
  @ApiResponse({
    status: 400,
    description: 'Start date and end date are required',
  })
  @ApiResponse({ status: 500, description: 'Failed to generate tenant report' })
  @Get('tenant/:id')
  @UseGuards(JwtAuthGuard)
  async generateTenantReport(
    @Param('id', ParseIntPipe) tenantId: number,
    @Query('startDate') startDate: string,
    @Query('endDate') endDate: string,
    @Res() res: Response,
  ): Promise<void> {
    if (!startDate || !endDate) {
      throw new HttpException(
        'Start date and end date are required',
        HttpStatus.BAD_REQUEST,
      );
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

  @ApiOperation({
    summary: 'Generate detailed tenant statement',
    description:
      'Creates a comprehensive statement PDF for a tenant showing payment history and bills',
  })
  @ApiParam({ name: 'id', description: 'Tenant ID', type: Number })
  @ApiQuery({
    name: 'startDate',
    required: true,
    description: 'Start date (YYYY-MM-DD)',
    type: String,
  })
  @ApiQuery({
    name: 'endDate',
    required: true,
    description: 'End date (YYYY-MM-DD)',
    type: String,
  })
  @ApiResponse({
    status: 200,
    description: 'Returns a PDF document with the tenant statement',
  })
  @ApiResponse({
    status: 400,
    description: 'Start date and end date are required',
  })
  @ApiResponse({
    status: 500,
    description: 'Failed to generate tenant statement',
  })
  @Get('tenant/:id/statement')
  @UseGuards(JwtAuthGuard)
  async generateTenantStatement(
    @Param('id', ParseIntPipe) tenantId: number,
    @Query('startDate') startDate: string,
    @Query('endDate') endDate: string,
    @Res() res: Response,
  ): Promise<void> {
    if (!startDate || !endDate) {
      throw new HttpException(
        'Start date and end date are required',
        HttpStatus.BAD_REQUEST,
      );
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
