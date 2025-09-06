import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

@ApiTags('api')
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @ApiOperation({ summary: 'Get API information' })
  @ApiResponse({
    status: 200,
    description: 'Returns API information including version and endpoints',
  })
  @Get()
  getHello(): object {
    return this.appService.getHello();
  }
}
