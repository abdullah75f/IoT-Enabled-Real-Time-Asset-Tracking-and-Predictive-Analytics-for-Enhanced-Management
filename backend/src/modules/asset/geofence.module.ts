import { Module } from '@nestjs/common';
import { GeofenceController } from './geofence.controller';
import { GeofenceService } from './geofence.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GeofenceAlert } from './geofence-alert.entity';
import User from '../users/user.entity';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [TypeOrmModule.forFeature([GeofenceAlert, User]), AuthModule],

  controllers: [GeofenceController],
  providers: [GeofenceService],
})
export class GeofenceModule {}
