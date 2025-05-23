import {
  Injectable,
  OnModuleInit,
  OnModuleDestroy,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { VehicleReading } from './vehicle-reading.entity';
import * as path from 'path';
import * as fs from 'fs';
import User from '../users/user.entity';

const pythonBridge = require('python-bridge');

@Injectable()
export class VehicleReadingsService implements OnModuleInit, OnModuleDestroy {
  private pythonBridge: any;
  private modelLoaded = false;

  constructor(
    @InjectRepository(VehicleReading)
    private vehicleReadingsRepository: Repository<VehicleReading>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  private resolveModelPath(): string {
    // __dirname points to compiled JS file location, e.g. backend/dist/modules/vehicle-readings
    // We want to resolve to backend/maintenance_model.pkl
    const modelPath = path.resolve(process.cwd(), 'maintenance_model.pkl');

    if (fs.existsSync(modelPath)) {
      console.log('Model file found at:', modelPath);
      return modelPath;
    }

    throw new Error(
      'maintenance_model.pkl not found in expected location: ' + modelPath,
    );
  }

  async onModuleInit() {
    this.pythonBridge = pythonBridge({ python: 'python3' });

    try {
      console.log('Initializing Python environment...');
      await this.pythonBridge.ex`import joblib`;
      await this.pythonBridge.ex`import pandas as pd`;

      const modelPath = this.resolveModelPath();

      console.log('Loading model from:', modelPath);

      await this.pythonBridge
        .ex`model = joblib.load(r${modelPath.replace(/\\/g, '\\\\')})`;

      this.modelLoaded = true;
      console.log('Python model loaded successfully');
    } catch (error) {
      console.error('Failed to load Python model:', error);
      throw new Error('Model initialization failed');
    }
  }

  async onModuleDestroy() {
    if (this.pythonBridge) {
      console.log('Shutting down Python bridge...');
      await this.pythonBridge.end();
      console.log('Python bridge shut down');
    }
  }
  // works
  async getLatestReading() {
    const latestRecords = await this.vehicleReadingsRepository
      .createQueryBuilder('vehicle_reading')
      .select('vehicle_reading.car_name', 'car_name')
      .addSelect('vehicle_reading.speed', 'speed')
      .addSelect('vehicle_reading.engine_temperature', 'engine_temperature')
      .addSelect('vehicle_reading.reading_timestamp', 'reading_timestamp')
      .orderBy('vehicle_reading.reading_timestamp', 'DESC')
      .getRawMany();

    // Group by car_name and get the latest reading for each car
    const latestByCar = latestRecords.reduce((acc, record) => {
      if (!acc[record.car_name]) {
        acc[record.car_name] = record;
      }
      return acc;
    }, {});

    return latestByCar;
  }

  async getDistinctCarNames(): Promise<string[]> {
    const cars = await this.vehicleReadingsRepository
      .createQueryBuilder('vehicle_reading')
      .select('DISTINCT vehicle_reading.car_name', 'car_name')
      .getRawMany();

    return cars.map((car) => car.car_name);
  }

  async updateLatestReadingTempSpeed(data: {
    speed: number;
    engineTemperature: number;
    readingTimestamp: Date;
  }) {
    const latestRecord = await this.vehicleReadingsRepository.findOne({
      where: {},
      order: { reading_timestamp: 'DESC' },
    });

    if (!latestRecord) {
      throw new Error('No vehicle reading found to update.');
    }

    latestRecord.speed = data.speed;
    latestRecord.engine_temperature = data.engineTemperature;
    latestRecord.reading_timestamp = data.readingTimestamp;

    return this.vehicleReadingsRepository.save(latestRecord);
  }

  // Add or update vehicle reading for the last inserted car
  async addReading(reading: {
    engine_temperature: number;
    speed: number;
  }): Promise<VehicleReading> {
    const lastReading = await this.vehicleReadingsRepository.findOne({
      order: { reading_timestamp: 'DESC' },
    });

    if (!lastReading) {
      throw new Error(
        'No car name found in the database. Please add a car name first.',
      );
    }

    lastReading.engine_temperature = reading.engine_temperature;
    lastReading.speed = reading.speed;
    lastReading.reading_timestamp = new Date();

    console.log(
      `Updating reading for car "${lastReading.car_name}" with temp=${reading.engine_temperature}, speed=${reading.speed}`,
    );

    return this.vehicleReadingsRepository.save(lastReading);
  }

  // Add a new car entry with default readings
  async addCarName(carName: string, carValue: number, userId: string): Promise<VehicleReading> {
    const user = await this.userRepository.findOne({ where: { userId } });
    if (!user) throw new Error('User not found');

    const newReading = this.vehicleReadingsRepository.create({
      car_name: carName,
      car_value: carValue,
      engine_temperature: null,
      speed: null,
      reading_timestamp: null,
      user: user
    });

    console.log(`Adding new car: ${carName} with value: ${carValue}`);

    return this.vehicleReadingsRepository.save(newReading);
  }

  // Get all distinct car names
  async getCarNames(): Promise<string[]> {
    const cars = await this.vehicleReadingsRepository
      .createQueryBuilder('vehicle_reading')
      .select('DISTINCT vehicle_reading.car_name', 'car_name')
      .where('vehicle_reading.engine_temperature IS NOT NULL')
      .andWhere('vehicle_reading.speed IS NOT NULL')
      .getRawMany();

    return cars.map((car) => car.car_name);
  }

  // Predict anomaly given temperature and speed
  async predictAnomaly(temp: number, speed: number): Promise<string> {
    if (!this.modelLoaded) {
      throw new Error('Python model not loaded');
    }

    try {
      console.log(`Predicting anomaly for temp=${temp}, speed=${speed}`);
      const prediction = await this.pythonBridge`
        model.predict(pd.DataFrame([[${temp}, ${speed}]], columns=['engine_temperature', 'speed']))[0]
      `;
      console.log('Prediction result:', prediction);
      return prediction.toString();
    } catch (error) {
      console.error('Prediction error:', error);
      throw new Error('Failed to predict anomaly');
    }
  }

  // Get latest anomaly data for a car
  async getAnomalyData(carName: string) {
    const readings = await this.vehicleReadingsRepository.find({
      where: { car_name: carName },
      order: { reading_timestamp: 'DESC' },
    });

    if (!readings.length) {
      console.log(`No readings found for car: ${carName}`);
      return null;
    }

    const latestReading = readings[0];
    console.log(`Latest reading for car "${carName}":`, latestReading);

    const detectedAnomaly = await this.predictAnomaly(
      latestReading.engine_temperature,
      latestReading.speed,
    );

    return {
      highestSpeed: latestReading.speed,
      temperatureAlert: latestReading.engine_temperature,
      boundaryBreach: 'Pending', // Placeholder for future feature
      detectedAnomaly,
    };
  }

  async getCarValues() {
    // Get all car values
    const cars = await this.vehicleReadingsRepository
      .createQueryBuilder('vehicle_reading')
      .select('vehicle_reading.car_name', 'car_name')
      .addSelect('vehicle_reading.car_value', 'car_value')
      .where('vehicle_reading.car_value IS NOT NULL')
      .getRawMany();

    // Calculate total value
    const totalValue = cars.reduce((sum, car) => sum + (car.car_value || 0), 0);
    
    // Get total assets (count all rows in the table)
    const totalAssetsResult = await this.vehicleReadingsRepository
      .createQueryBuilder('vehicle_reading')
      .select('COUNT(*)', 'count')
      .getRawOne();
    
    const totalAssets = parseInt(totalAssetsResult.count) || 0;
    
    // Set industries to 1 if there are any cars (any rows in the table)
    const industries = totalAssets > 0 ? 1 : 0;

    return {
      cars,
      totalValue,
      totalAssets,
      industries
    };
  }
}
