import {
    Entity,
    Column,
    PrimaryGeneratedColumn,
    ManyToOne,
    JoinColumn,
  } from 'typeorm';
  import User from '../users/user.entity';
  
  @Entity('vehicle_readings_obd')
  export class VehicleReadingOBD {
    @PrimaryGeneratedColumn()
    id: number;
  
    @Column()
    car_name: string;
  
    @Column({ type: 'float', nullable: true })
    engine_temperature: number | null;
  
    @Column({ type: 'float', nullable: true })
    speed: number | null;
  
    @Column({ type: 'float', nullable: true })
    engine_rpm: number | null;
  
    @Column({ type: 'float', nullable: true })
    maf_air_flow: number | null;
  
    @Column({ type: 'float', nullable: true })
    throttle_position: number | null;
  
    @Column({ type: 'timestamp', nullable: true })
    reading_timestamp: Date | null;
  
    @Column({ type: 'float' })
    car_value: number;
  
    @ManyToOne(() => User)
    @JoinColumn({ name: 'user_id' })
    user: User;
  } 