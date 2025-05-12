import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import User from '../users/user.entity';

@Entity('geo_fence_alert')
export class GeofenceAlert {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  event: string;

  @Column('decimal', { precision: 10, scale: 7 })
  latitude: number;

  @Column('decimal', { precision: 10, scale: 7 })
  longitude: number;

  @Column({ type: 'timestamp' })
  timestamp: Date;

  // Linking GeofenceAlert to User (One-to-Many relation)
  @ManyToOne(() => User, (user) => user.geofenceAlerts)
  user: User;
}
