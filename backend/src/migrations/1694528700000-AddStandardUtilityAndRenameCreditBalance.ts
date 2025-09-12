import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddStandardUtilityAndRenameCreditBalance1694528700000
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Add standard utility costs columns to apartments table
    await queryRunner.query(`
      ALTER TABLE apartments
      ADD COLUMN standard_water_bill DECIMAL(10,2) NOT NULL DEFAULT 0,
      ADD COLUMN standard_electricity_bill DECIMAL(10,2) NOT NULL DEFAULT 0,
      ADD COLUMN standard_gas_bill DECIMAL(10,2) NOT NULL DEFAULT 0,
      ADD COLUMN standard_internet_bill DECIMAL(10,2) NOT NULL DEFAULT 0,
      ADD COLUMN standard_service_charge DECIMAL(10,2) NOT NULL DEFAULT 0,
      ADD COLUMN standard_trash_bill DECIMAL(10,2) NOT NULL DEFAULT 0,
      ADD COLUMN estimated_total_rent DECIMAL(10,2) NOT NULL DEFAULT 0;
    `);

    // Set some default values for standard utility costs (can be updated later)
    await queryRunner.query(`
      UPDATE apartments 
      SET standard_water_bill = 40, 
          standard_electricity_bill = 65, 
          standard_gas_bill = 30, 
          standard_internet_bill = 45, 
          standard_service_charge = 90, 
          standard_trash_bill = 25,
          estimated_total_rent = base_rent + 40 + 65 + 30 + 45 + 90 + 25;
    `);

    // Rename advance_payment column to credit_balance in tenants table
    await queryRunner.query(`
      ALTER TABLE tenants
      CHANGE COLUMN advance_payment credit_balance DECIMAL(10,2) NOT NULL DEFAULT 0;
    `);

    // Note: We're not renaming the column in the bills table to maintain compatibility with existing code
    // In a production system, you might want to handle this with more care to avoid breaking changes
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Remove standard utility costs columns from apartments table
    await queryRunner.query(`
      ALTER TABLE apartments
      DROP COLUMN standard_water_bill,
      DROP COLUMN standard_electricity_bill,
      DROP COLUMN standard_gas_bill,
      DROP COLUMN standard_internet_bill,
      DROP COLUMN standard_service_charge,
      DROP COLUMN standard_trash_bill,
      DROP COLUMN estimated_total_rent;
    `);

    // Rename credit_balance back to advance_payment in tenants table
    await queryRunner.query(`
      ALTER TABLE tenants
      CHANGE COLUMN credit_balance advance_payment DECIMAL(10,2) NOT NULL DEFAULT 0;
    `);
  }
}
