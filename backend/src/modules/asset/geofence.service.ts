import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { GeofenceAlert } from './geofence-alert.entity';
import User from '../users/user.entity';

@Injectable()
export class GeofenceService {
  constructor(
    @InjectRepository(GeofenceAlert)
    private geofenceAlertRepository: Repository<GeofenceAlert>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async createAlert(
    alertData: {
      event: string;
      latitude: number;
      longitude: number;
      timestamp: string;
    },
    userId: string,
  ) {
    const user = await this.userRepository.findOne({ where: { userId } });
    if (!user) throw new Error('User not found');

    const alert = this.geofenceAlertRepository.create({
      event: alertData.event,
      latitude: alertData.latitude,
      longitude: alertData.longitude,
      timestamp: new Date(alertData.timestamp),
      user,
    });

    return this.geofenceAlertRepository.save(alert);
  }
}
