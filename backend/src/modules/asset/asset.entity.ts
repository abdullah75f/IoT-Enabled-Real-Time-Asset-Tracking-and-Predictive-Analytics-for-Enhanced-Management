import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('vehicle_readings')
export class AssetReading {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('float')
  latitude: number;

  @Column('float')
  longitude: number;
}
