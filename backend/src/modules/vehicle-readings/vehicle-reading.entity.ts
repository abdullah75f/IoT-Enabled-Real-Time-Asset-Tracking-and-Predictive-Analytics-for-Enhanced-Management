import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import User from '../users/user.entity';

@Entity('vehicle_readings_temp_speed')
export class VehicleReading {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  car_name: string;

  @Column({ type: 'float', nullable: true })
  engine_temperature: number | null;

  @Column({ type: 'float', nullable: true })
  speed: number | null;

  @Column({ type: 'timestamp', nullable: true })
  reading_timestamp: Date | null;

  @Column({ type: 'float' })
  car_value: number;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'user_id' })
  user: User;
}
