import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module.js';
import { DatabaseModule } from '../database/database.module.js';
import {
  CargoRequestController,
  StaffCargoRequestController,
} from './cargo-request.controller.js';
import { CargoRequestService } from './cargo-request.service.js';

@Module({
  imports: [AuthModule, DatabaseModule],
  controllers: [CargoRequestController, StaffCargoRequestController],
  providers: [CargoRequestService],
})
export class CargoRequestModule {}
