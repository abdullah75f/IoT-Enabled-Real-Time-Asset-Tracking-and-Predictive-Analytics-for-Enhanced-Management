import { Controller, Get } from '@nestjs/common';
import { AssetService } from './asset.service';
import { log } from 'console';

@Controller('assets')
export class AssetController {
  constructor(private readonly assetService: AssetService) {}

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
