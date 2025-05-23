import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { VehicleReadingsService } from './vehicle-readings.service';
import { VehicleReading } from './vehicle-reading.entity';
import { VehicleReadingsController } from './vehicle-readings.controller';
import User from '../users/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([VehicleReading, User])],
  providers: [VehicleReadingsService],
  controllers: [VehicleReadingsController],
})
export class VehicleReadingsModule {}
