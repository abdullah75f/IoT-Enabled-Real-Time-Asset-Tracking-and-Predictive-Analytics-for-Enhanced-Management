import { Controller, Post, Body, UseGuards, Request } from '@nestjs/common';
import { GeofenceService } from './geofence.service';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

@Controller('geofence')
export class GeofenceController {
  constructor(private readonly geofenceService: GeofenceService) {}

  @Post('alert')
  @UseGuards(JwtAuthGuard)
  async createAlert(
    @Request() req,
    @Body()
    alertData: {
      event: string;
      latitude: number;
      longitude: number;
      timestamp: string;
    },
  ) {
    const userId = req.user['userId'];
    console.log(`Received alert from userId: ${userId}`);
    return this.geofenceService.createAlert(alertData, userId);
  }
}
