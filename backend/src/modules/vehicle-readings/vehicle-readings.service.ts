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
import { spawn } from 'child_process';
import { Not, IsNull } from 'typeorm';

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
    const venvPythonPath = path.resolve(process.cwd(), 'venv', 'bin', 'python3');
    this.pythonBridge = pythonBridge({ python: venvPythonPath });

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
    try {
      // Get all readings ordered by timestamp
      const allReadings = await this.vehicleReadingsRepository
      .createQueryBuilder('vehicle_reading')
        .select([
          'vehicle_reading.car_name',
          'vehicle_reading.speed',
          'vehicle_reading.engine_temperature',
          'vehicle_reading.reading_timestamp'
        ])
      .orderBy('vehicle_reading.reading_timestamp', 'DESC')
        .getMany();

      console.log('All readings from DB:', allReadings);

      // Group by car_name and get the latest 5 readings for each car
      const latestByCar = allReadings.reduce((acc, record) => {
      if (!acc[record.car_name]) {
          acc[record.car_name] = [];
        }
        // Only add if we don't have 5 readings yet
        if (acc[record.car_name].length < 5) {
          acc[record.car_name].push({
            speed: record.speed,
            engine_temperature: record.engine_temperature,
            reading_timestamp: record.reading_timestamp
          });
      }
      return acc;
    }, {});

      console.log('Processed readings by car:', latestByCar);
    return latestByCar;
    } catch (error) {
      console.error('Error fetching latest readings:', error);
      throw error;
    }
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
    // Find the latest reading by ID
    const latestRecord = await this.vehicleReadingsRepository
      .createQueryBuilder('vehicle_reading')
      .leftJoinAndSelect('vehicle_reading.user', 'user')
      .orderBy('vehicle_reading.id', 'DESC')
      .getOne();

    if (!latestRecord) {
      throw new Error('No vehicle found in the system');
    }

    console.log('Found latest record:', {
      id: latestRecord.id,
      car_name: latestRecord.car_name,
      current_temp: latestRecord.engine_temperature,
      current_speed: latestRecord.speed,
      user_id: latestRecord.user?.userId
    });

    // Check if this is the first reading (has null temperature and speed)
    if (latestRecord.engine_temperature === null && latestRecord.speed === null) {
      // First time: Update the existing row
    latestRecord.speed = data.speed;
    latestRecord.engine_temperature = data.engineTemperature;
    latestRecord.reading_timestamp = data.readingTimestamp;
      console.log(
        `First reading - Updating row ID ${latestRecord.id} for car "${latestRecord.car_name}" with temp=${data.engineTemperature}, speed=${data.speed}`,
      );
    return this.vehicleReadingsRepository.save(latestRecord);
    } else {
      // Subsequent times: Create a new row with the same car info and user
      const newReading = this.vehicleReadingsRepository.create({
        car_name: latestRecord.car_name,
        car_value: latestRecord.car_value,
        engine_temperature: data.engineTemperature,
        speed: data.speed,
        reading_timestamp: data.readingTimestamp,
        user: latestRecord.user // Use the user from the latest record
      });
      console.log(
        `Creating new reading row for car "${latestRecord.car_name}" with temp=${data.engineTemperature}, speed=${data.speed}`,
      );
      return this.vehicleReadingsRepository.save(newReading);
    }
  }

  // Add or update vehicle reading for the last inserted car
  async addReading(reading: {
    engine_temperature: number;
    speed: number;
  }, userId: string): Promise<VehicleReading> {
    console.log(`[addReading] Adding reading for user: ${userId}`);
    
    const user = await this.userRepository.findOne({ where: { userId } });
    if (!user) {
      console.error(`[addReading] User not found with ID: ${userId}`);
      throw new Error('User not found');
    }

    const lastReading = await this.vehicleReadingsRepository.findOne({
      where: { user: { userId } },
      order: { reading_timestamp: 'DESC' },
    });

    if (!lastReading) {
      console.error(`[addReading] No car found for user: ${userId}`);
      throw new Error('No car found for this user. Please add a car first.');
    }

    // Check if this is the first reading for this car
    const existingReadings = await this.vehicleReadingsRepository.find({
      where: { 
        car_name: lastReading.car_name,
        user: { userId }
      },
      order: { reading_timestamp: 'DESC' }
    });

    if (existingReadings.length === 1 && !existingReadings[0].reading_timestamp) {
      // First time: Update the existing row
    lastReading.engine_temperature = reading.engine_temperature;
    lastReading.speed = reading.speed;
    lastReading.reading_timestamp = new Date();
    console.log(
        `[addReading] First reading - Updating row for car "${lastReading.car_name}" with temp=${reading.engine_temperature}, speed=${reading.speed}`,
    );
    return this.vehicleReadingsRepository.save(lastReading);
    } else {
      // Subsequent times: Create a new row
      const newReading = this.vehicleReadingsRepository.create({
        car_name: lastReading.car_name,
        car_value: lastReading.car_value,
        engine_temperature: reading.engine_temperature,
        speed: reading.speed,
        reading_timestamp: new Date(),
        user: user
      });
      console.log(
        `[addReading] Creating new row for car "${lastReading.car_name}" with temp=${reading.engine_temperature}, speed=${reading.speed}`,
      );
      return this.vehicleReadingsRepository.save(newReading);
    }
  }

  // Add a new car entry with default readings
  async addCarName(carName: string, carValue: number, userId: string): Promise<VehicleReading> {
    console.log(`[addCarName] Adding car: ${carName} with value: ${carValue} for user: ${userId}`);
    
    const user = await this.userRepository.findOne({ where: { userId } });
    if (!user) {
      console.error(`[addCarName] User not found with ID: ${userId}`);
      throw new Error('User not found');
    }

    const newReading = this.vehicleReadingsRepository.create({
      car_name: carName,
      car_value: carValue,
      engine_temperature: null,
      speed: null,
      reading_timestamp: null,
      user: user // This will set the user_id column
    });

    console.log(`[addCarName] Created new reading with user association:`, {
      carName,
      carValue,
      userId: user.userId,
      userEmail: user.email
    });

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
  async predictAnomaly(temp: number, speed: number): Promise<{anomaly: string, recommendation: string}> {
    return new Promise((resolve, reject) => {
      console.log(`[predictAnomaly] Starting prediction with temp=${temp}, speed=${speed}`);
      
      const scriptPath = path.join(__dirname, 'ml-service.py');
      const modelPath = path.join(__dirname, 'engine_health_rf_model.pkl');
      const encoderPath = path.join(__dirname, 'engine_health_label_encoder.pkl');

      // Check if files exist
      if (!fs.existsSync(scriptPath)) {
        console.error(`[predictAnomaly] Python script not found at ${scriptPath}`);
        reject(new Error(`Python script not found at ${scriptPath}`));
        return;
      }
      if (!fs.existsSync(modelPath)) {
        console.error(`[predictAnomaly] Model file not found at ${modelPath}`);
        reject(new Error(`Model file not found at ${modelPath}`));
        return;
      }
      if (!fs.existsSync(encoderPath)) {
        console.error(`[predictAnomaly] Label encoder file not found at ${encoderPath}`);
        reject(new Error(`Label encoder file not found at ${encoderPath}`));
        return;
      }

      // Validate input parameters
      if (temp === undefined || temp === null || speed === undefined || speed === null) {
        console.error(`[predictAnomaly] Invalid input parameters: temp=${temp}, speed=${speed}`);
        resolve({
          anomaly: 'Insufficient Data',
          recommendation: 'Please ensure both temperature and speed readings are available'
        });
        return;
      }

      // Ensure we have valid numbers
      const tempNum = Number(temp);
      const speedNum = Number(speed);

      if (isNaN(tempNum) || isNaN(speedNum)) {
        console.error(`[predictAnomaly] Invalid number conversion: temp=${tempNum}, speed=${speedNum}`);
        resolve({
          anomaly: 'Invalid Data',
          recommendation: 'Please ensure temperature and speed are valid numbers'
        });
        return;
      }

      console.log(`[predictAnomaly] Using values: temp=${tempNum}, speed=${speedNum}`);

      // Get the latest 5 readings from the database
      this.vehicleReadingsRepository.find({
        where: {
          engine_temperature: Not(IsNull()),
          speed: Not(IsNull())
        },
        order: { reading_timestamp: 'DESC' },
        take: 5
      }).then(readings => {
        console.log(`[predictAnomaly] Found ${readings.length} recent readings`);
        
        if (readings.length === 0) {
          console.log('[predictAnomaly] No recent readings, using provided values');
          const pythonProcess = spawn('python3', [
            scriptPath,
            '--temp', tempNum.toString(),
            '--speed', speedNum.toString()
          ]);

          let result = '';
          let error = '';

          pythonProcess.stdout.on('data', (data) => {
            result += data.toString();
            console.log(`[predictAnomaly] Python stdout: ${data.toString()}`);
          });

          pythonProcess.stderr.on('data', (data) => {
            error += data.toString();
            console.error(`[predictAnomaly] Python stderr: ${data.toString()}`);
          });

          pythonProcess.on('close', (code) => {
            console.log(`[predictAnomaly] Python process exited with code ${code}`);
            if (code !== 0) {
              resolve({
                anomaly: 'Analysis Failed',
                recommendation: 'Unable to analyze the current readings. Please try again.'
              });
              return;
            }
            try {
              const prediction = JSON.parse(result);
              console.log(`[predictAnomaly] Successfully parsed prediction: ${JSON.stringify(prediction)}`);
              resolve(prediction);
            } catch (e) {
              console.error(`[predictAnomaly] Failed to parse prediction: ${e.message}`);
              resolve({
                anomaly: 'Analysis Error',
                recommendation: 'Failed to process the readings. Please try again.'
              });
            }
          });
          return;
        }

        // Calculate average temperature and speed from the last 5 readings
        const validReadings = readings.filter(r => r.engine_temperature != null && r.speed != null);
        console.log(`[predictAnomaly] Found ${validReadings.length} valid readings`);
        
        if (validReadings.length === 0) {
          console.log('[predictAnomaly] No valid readings, using provided values');
          const pythonProcess = spawn('python3', [
            scriptPath,
            '--temp', tempNum.toString(),
            '--speed', speedNum.toString()
          ]);

          let result = '';
          let error = '';

          pythonProcess.stdout.on('data', (data) => {
            result += data.toString();
            console.log(`[predictAnomaly] Python stdout: ${data.toString()}`);
          });

          pythonProcess.stderr.on('data', (data) => {
            error += data.toString();
            console.error(`[predictAnomaly] Python stderr: ${data.toString()}`);
          });

          pythonProcess.on('close', (code) => {
            console.log(`[predictAnomaly] Python process exited with code ${code}`);
            if (code !== 0) {
              resolve({
                anomaly: 'Analysis Failed',
                recommendation: 'Unable to analyze the current readings. Please try again.'
              });
              return;
            }
            try {
              const prediction = JSON.parse(result);
              console.log(`[predictAnomaly] Successfully parsed prediction: ${JSON.stringify(prediction)}`);
              resolve(prediction);
            } catch (e) {
              console.error(`[predictAnomaly] Failed to parse prediction: ${e.message}`);
              resolve({
                anomaly: 'Analysis Error',
                recommendation: 'Failed to process the readings. Please try again.'
              });
            }
          });
          return;
        }

        const avgTemp = validReadings.reduce((sum, r) => sum + Number(r.engine_temperature), 0) / validReadings.length;
        const avgSpeed = validReadings.reduce((sum, r) => sum + Number(r.speed), 0) / validReadings.length;

        console.log(`[predictAnomaly] Using averages from ${validReadings.length} readings: temp=${avgTemp}, speed=${avgSpeed}`);

        // Use the averages for prediction
        const pythonProcess = spawn('python3', [
          scriptPath,
          '--temp', avgTemp.toString(),
          '--speed', avgSpeed.toString()
        ]);

        let result = '';
        let error = '';

        pythonProcess.stdout.on('data', (data) => {
          result += data.toString();
          console.log(`[predictAnomaly] Python stdout: ${data.toString()}`);
        });

        pythonProcess.stderr.on('data', (data) => {
          error += data.toString();
          console.error(`[predictAnomaly] Python stderr: ${data.toString()}`);
        });

        pythonProcess.on('close', (code) => {
          console.log(`[predictAnomaly] Python process exited with code ${code}`);
          if (code !== 0) {
            resolve({
              anomaly: 'Analysis Failed',
              recommendation: 'Unable to analyze the readings. Please try again.'
            });
            return;
          }
          try {
            const prediction = JSON.parse(result);
            console.log(`[predictAnomaly] Successfully parsed prediction: ${JSON.stringify(prediction)}`);
            resolve(prediction);
          } catch (e) {
            console.error(`[predictAnomaly] Failed to parse prediction: ${e.message}`);
            resolve({
              anomaly: 'Analysis Error',
              recommendation: 'Failed to process the readings. Please try again.'
            });
          }
        });
      }).catch(error => {
        console.error(`[predictAnomaly] Error fetching readings: ${error.message}`);
        resolve({
          anomaly: 'System Error',
          recommendation: 'An error occurred while analyzing the readings. Please try again.'
        });
      });
    });
  }

  // Get latest anomaly data for a car
  async getAnomalyData(carName: string, userId: string) {
    try {
      console.log(`[getAnomalyData] Starting for car: ${carName} and user: ${userId}`);
      
      // Get the latest 5 readings for this car, ordered by ID DESC to get the most recent ones
      const latestReadings = await this.vehicleReadingsRepository
        .createQueryBuilder('vehicle_reading')
        .where('LOWER(vehicle_reading.car_name) = LOWER(:carName)', { carName })
        .andWhere('vehicle_reading.engine_temperature IS NOT NULL')
        .andWhere('vehicle_reading.speed IS NOT NULL')
        .orderBy('vehicle_reading.id', 'DESC')  // Order by ID DESC to get the most recent readings
        .take(5)
        .getMany();
      
      console.log(`[getAnomalyData] Found ${latestReadings.length} readings for ${carName}`);
      
      // Log each reading's details
      latestReadings.forEach((reading, index) => {
        console.log(`[getAnomalyData] Reading ${index + 1}:`, {
          id: reading.id,  // Added ID to verify we're getting the latest ones
          car_name: reading.car_name,
          engine_temperature: reading.engine_temperature,
          speed: reading.speed,
          reading_timestamp: reading.reading_timestamp
        });
      });

      if (latestReadings.length === 0) {
        console.log(`[getAnomalyData] No valid readings found for car: ${carName}`);
        return {
          highestSpeed: 0,
          temperatureAlert: 0,
          boundaryBreach: 'No Data',
          detectedAnomaly: {
            anomaly: 'No readings available',
            recommendation: 'Please add some readings for this vehicle'
          }
        };
      }

      // Calculate averages from the latest readings
      const avgTemp = latestReadings.reduce((sum, r) => sum + Number(r.engine_temperature), 0) / latestReadings.length;
      const avgSpeed = latestReadings.reduce((sum, r) => sum + Number(r.speed), 0) / latestReadings.length;

      console.log(`[getAnomalyData] Using averages from ${latestReadings.length} readings: temp=${avgTemp}, speed=${avgSpeed}`);

      if (isNaN(avgTemp) || isNaN(avgSpeed)) {
        console.error(`[getAnomalyData] Invalid averages calculated: temp=${avgTemp}, speed=${avgSpeed}`);
        return {
          highestSpeed: 0,
          temperatureAlert: 0,
          boundaryBreach: 'No Data',
          detectedAnomaly: {
            anomaly: 'Invalid readings',
            recommendation: 'Please ensure temperature and speed readings are valid numbers'
          }
        };
      }

      const detectedAnomaly = await this.predictAnomaly(avgTemp, avgSpeed);

      return {
        highestSpeed: avgSpeed,
        temperatureAlert: avgTemp,
        boundaryBreach: 'Pending', // Placeholder for future feature
        detectedAnomaly,
      };
    } catch (error) {
      console.error(`[getAnomalyData] Error getting anomaly data for car ${carName}:`, error);
      throw error;
    }
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
    
    // Get total assets (count of unique car names)
    const totalAssetsResult = await this.vehicleReadingsRepository
      .createQueryBuilder('vehicle_reading')
      .select('COUNT(DISTINCT vehicle_reading.car_name)', 'count')
      .getRawOne();
    
    const totalAssets = parseInt(totalAssetsResult.count) || 0;
    
    // Set industries to 1 if there are any cars
    const industries = totalAssets > 0 ? 1 : 0;

    return {
      cars,
      totalValue,
      totalAssets,
      industries
    };
  }
}
