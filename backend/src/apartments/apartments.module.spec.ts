import { Test } from '@nestjs/testing';
import { ApartmentsModule } from './apartments.module';
import { ApartmentsService } from './apartments.service';
import { ApartmentsController } from './apartments.controller';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Apartment } from '../entities/apartment.entity';
import { Bill } from '../entities/bill.entity';
import { Tenant } from '../entities/tenant.entity';

describe('ApartmentsModule', () => {
  let apartmentsModule: ApartmentsModule;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      imports: [ApartmentsModule],
    })
      .overrideProvider(getRepositoryToken(Apartment))
      .useValue({})
      .overrideProvider(getRepositoryToken(Bill))
      .useValue({})
      .overrideProvider(getRepositoryToken(Tenant))
      .useValue({})
      .compile();

    apartmentsModule = module.get<ApartmentsModule>(ApartmentsModule);
  });

  it('should be defined', () => {
    expect(apartmentsModule).toBeDefined();
  });

  describe('module components', () => {
    let apartmentsService: ApartmentsService;
    let apartmentsController: ApartmentsController;

    beforeEach(async () => {
      const moduleRef = await Test.createTestingModule({
        imports: [ApartmentsModule],
      })
        .overrideProvider(getRepositoryToken(Apartment))
        .useValue({})
        .overrideProvider(getRepositoryToken(Bill))
        .useValue({})
        .overrideProvider(getRepositoryToken(Tenant))
        .useValue({})
        .compile();

      apartmentsService = moduleRef.get<ApartmentsService>(ApartmentsService);
      apartmentsController =
        moduleRef.get<ApartmentsController>(ApartmentsController);
    });

    it('should have apartments service defined', () => {
      expect(apartmentsService).toBeDefined();
    });

    it('should have apartments controller defined', () => {
      expect(apartmentsController).toBeDefined();
    });
  });
});
