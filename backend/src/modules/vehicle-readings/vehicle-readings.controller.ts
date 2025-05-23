import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  BadRequestException,
  Patch,
  UseGuards,
  Request,
} from '@nestjs/common';
import { VehicleReadingsService } from './vehicle-readings.service';
import { VehicleReading } from './vehicle-reading.entity';

import { IsNumber, IsOptional, IsDateString } from 'class-validator';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

class UpdateLatestReadingTempSpeedDto {
  @IsOptional()
  @IsNumber()
  speed?: number;

  @IsOptional()
  @IsNumber()
  engineTemperature?: number;

  @IsOptional()
  @IsDateString()
  readingTimestamp?: string;
}

@Controller('vehicle-readings')
export class VehicleReadingsController {
  constructor(
    private readonly vehicleReadingsService: VehicleReadingsService,
  ) {}

  // works
  @Post()
  async addReading(
    @Body() reading: { engine_temperature: number; speed: number },
  ): Promise<VehicleReading> {
    return this.vehicleReadingsService.addReading(reading);
  }

  // // works
  // @Post('car-name')
  // async addCarName(@Body('carName') carName: string): Promise<VehicleReading> {
  //   console.log('Received carName:', carName);
  //   if (!carName) {
  //     throw new BadRequestException('carName is required');
  //   }
  //   return this.vehicleReadingsService.addCarName(carName);
  // }

  @UseGuards(JwtAuthGuard)
  @Post('car-name')
  async addCarName(
    @Body('carName') carName: string,
    @Body('carValue') carValue: number,
    @Request() req,
  ): Promise<VehicleReading> {
    if (!carName) {
      throw new BadRequestException('carName is required');
    }
    if (!carValue || isNaN(carValue)) {
      throw new BadRequestException('carValue is required and must be a number');
    }
    const userId = req.user.userId;
    return this.vehicleReadingsService.addCarName(carName, carValue, userId);
  }

  // works
  @Get('cars')
  async getCarNames(): Promise<string[]> {
    return this.vehicleReadingsService.getDistinctCarNames();
  }

  // works
  @Patch('update-latest-temp-speed')
  async updateLatestReadingTempSpeed(
    @Body() dto: UpdateLatestReadingTempSpeedDto,
  ) {
    return this.vehicleReadingsService.updateLatestReadingTempSpeed({
      speed: dto.speed,
      engineTemperature: dto.engineTemperature,
      readingTimestamp: dto.readingTimestamp
        ? new Date(dto.readingTimestamp)
        : undefined,
    });
  }

  // works
  @Get('latest')
  async getLatestReading() {
    const reading = await this.vehicleReadingsService.getLatestReading();
    return reading || {}; // Avoid sending 404 or error
  }

  @Get('anomaly/:carName')
  async getAnomalyData(@Param('carName') carName: string) {
    return this.vehicleReadingsService.getAnomalyData(carName);
  }

  @Get('car-values')
  async getCarValues() {
    return this.vehicleReadingsService.getCarValues();
  }
}
