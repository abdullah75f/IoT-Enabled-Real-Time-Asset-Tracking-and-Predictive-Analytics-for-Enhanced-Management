import { Controller, Get, Post, Body } from '@nestjs/common';
import { AssetService } from './asset.service';
import { log } from 'console';

@Controller('assets')
export class AssetController {
  constructor(private readonly assetService: AssetService) {}

  @Post('gps-data')
  async receiveGPSData(@Body() data: { latitude: number; longitude: number }) {
    try {
      const location = await this.assetService.createAssetReading(data);
      console.log('Received GPS data:', data);
      return { message: 'Data stored successfully', data: location };
    } catch (error) {
      console.error('Error storing GPS data:', error);
      throw error;
    }
  }

  @Get('location')
  async getAssetLocation() {
    try {
      const location = await this.assetService.getLatestAssetReadingLocation();
      console.log(location);
      return location;
    } catch (error) {
      throw error;
    }
  }

  @Get('locations')
  async getAllLocations() {
    try {
      const locations = await this.assetService.getAllAssetReadingLocations();
      return locations;
    } catch (error) {
      throw error;
    }
  }
}
