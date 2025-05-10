import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AssetReading } from '../asset/asset.entity'; // Updated to the correct entity
import { Repository } from 'typeorm';

@Injectable()
export class AssetService {
  constructor(
    @InjectRepository(AssetReading)
    private assetReadingRepository: Repository<AssetReading>,
  ) {}

  async getLatestAssetReadingLocation(): Promise<{
    latitude: number;
    longitude: number;
  }> {
    try {
      const latestReading = await this.assetReadingRepository.find({
        take: 1,
        order: {
          id: 'DESC',
        },
      });

      if (latestReading.length === 0) {
        throw new Error('No asset readings found');
      }

      const reading = latestReading[0];

      return {
        latitude: reading.latitude ?? 0,
        longitude: reading.longitude ?? 0,
      };
    } catch (error) {
      throw error;
    }
  }

  async getAllAssetReadingLocations(): Promise<
    { latitude: number; longitude: number }[]
  > {
    try {
      const assetReadings = await this.assetReadingRepository.find();
      return assetReadings.map((reading) => ({
        latitude: reading.latitude,
        longitude: reading.longitude,
      }));
    } catch (error) {
      throw error;
    }
  }
}
