import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { ConfigModule } from '@nestjs/config';
import { AppService } from './app.service';
import { UsersModule } from './modules/users/users.module';

import { TypeOrmModule } from '@nestjs/typeorm';
import User from './modules/users/user.entity';
import { JwtModule } from '@nestjs/jwt';
import { AuthModule } from './auth/auth.module';
import { AssetModule } from './modules/asset/asset.module';
import { GeofenceModule } from './modules/asset/geofence.module';
import { VehicleReadingsModule } from './modules/vehicle-readings/vehicle-readings.module';
import { GeofenceAlert } from './modules/asset/geofence-alert.entity';

@Module({
  imports: [
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '1h' },
    }),
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      useFactory: () => ({
        type: 'postgres',
        url: process.env.DATABASE_URL,
        autoLoadEntities: true,
        synchronize: true,
        entities: [User, GeofenceAlert],
        ssl: {
          rejectUnauthorized: false,
        },
      }),
    }),
    UsersModule,
    AuthModule,
    AssetModule,
    GeofenceModule,
    VehicleReadingsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
