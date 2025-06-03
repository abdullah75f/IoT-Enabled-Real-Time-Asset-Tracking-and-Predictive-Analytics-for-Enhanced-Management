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
  UnauthorizedException,
  Req,
} from '@nestjs/common';
import { VehicleReadingsService } from './vehicle-readings.service';
import { VehicleReading } from './vehicle-reading.entity';
import { Request as ExpressRequest } from 'express';

import { IsNumber, IsOptional, IsDateString } from 'class-validator';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

interface RequestWithUser extends ExpressRequest {
  user: {
    userId: string;
  };
}

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

class PredictAnomalyDto {
  @IsNumber()
  temp: number;

  @IsNumber()
  speed: number;
}

class AddTestReadingDto {
  @IsNumber()
  engine_temperature: number;

  @IsNumber()
  speed: number;

  @IsNumber()
  carValue: number;
}

@Controller('vehicle-readings')
export class VehicleReadingsController {
  constructor(
    private readonly vehicleReadingsService: VehicleReadingsService,
  ) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  async addReading(
    @Body() reading: { engine_temperature: number; speed: number },
    @Req() request: RequestWithUser
  ): Promise<VehicleReading> {
    return this.vehicleReadingsService.addReading(reading, request.user.userId);
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
    @Req() request: RequestWithUser
  ): Promise<VehicleReading> {
    if (!carName) {
      throw new BadRequestException('carName is required');
    }
    if (!carValue || isNaN(carValue)) {
      throw new BadRequestException('carValue is required and must be a number');
    }
    const userId = request.user.userId;
    if (!userId) {
      throw new UnauthorizedException('User not authenticated');
    }
    return this.vehicleReadingsService.addCarName(carName, carValue, userId);
  }

  // works
  @Get('cars')
  async getCarNames(): Promise<string[]> {
    return this.vehicleReadingsService.getDistinctCarNames();
  }

  @Patch('update-latest-temp-speed')
  async updateLatestReadingTempSpeed(
    @Body() dto: UpdateLatestReadingTempSpeedDto,
  ) {
    return this.vehicleReadingsService.updateLatestReadingTempSpeed({
      speed: dto.speed,
      engineTemperature: dto.engineTemperature,
      readingTimestamp: dto.readingTimestamp
        ? new Date(dto.readingTimestamp)
        : undefined
    });
  }

  // works
  @Get('latest')
  async getLatestReading() {
    const reading = await this.vehicleReadingsService.getLatestReading();
    return reading || {}; // Avoid sending 404 or error
  }

  @UseGuards(JwtAuthGuard)
  @Get('anomaly/:carName')
  async getAnomalyData(
    @Param('carName') carName: string,
    @Req() request: RequestWithUser
  ) {
    const userId = request.user.userId;
    if (!userId) {
      throw new UnauthorizedException('User not authenticated');
    }
    return this.vehicleReadingsService.getAnomalyData(carName, userId);
  }

  @Get('car-values')
  async getCarValues() {
    return this.vehicleReadingsService.getCarValues();
  }

  @Post('predict-anomaly')
  async predictAnomaly(@Body() dto: PredictAnomalyDto) {
    return this.vehicleReadingsService.predictAnomaly(dto.temp, dto.speed);
  }

  @UseGuards(JwtAuthGuard)
  @Post('add-test-reading')
  async addTestReading(
    @Body() dto: AddTestReadingDto,
    @Req() request: RequestWithUser
  ) {
    const reading = await this.vehicleReadingsService.addReading({
      engine_temperature: dto.engine_temperature,
      speed: dto.speed
    }, request.user.userId);
    return reading;
  }
}
