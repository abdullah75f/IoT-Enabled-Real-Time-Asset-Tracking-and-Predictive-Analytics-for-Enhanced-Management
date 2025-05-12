import {
  Column,
  Entity,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { GenderEnum } from '../enum/gender-enum';
import { Matches } from 'class-validator';
import { GeofenceAlert } from '../asset/geofence-alert.entity';

@Entity('user')
export default class User {
  @PrimaryGeneratedColumn('uuid')
  userId: string;

  @Column()
  firstName: string;

  @Column({ nullable: true })
  lastName: string;

  @Column({ unique: true, nullable: true })
  email: string;

  @Column({ nullable: true })
  googleId: string;

  @Matches(/^\d{10}$/, { message: 'phoneNumber must be exactly 10 digits' })
  @Column({ unique: true, nullable: true })
  phoneNumber: string;

  @Column({
    type: 'enum',
    enum: GenderEnum,
    nullable: true,
  })
  gender: GenderEnum;

  @Column({ nullable: true })
  address: string;

  @Column({ nullable: true })
  age: string;

  @Column({ nullable: true })
  passwordHash: string;

  @Column({ nullable: true })
  profilePicture: string;

  @Column({ default: false })
  isEmailVerified: boolean;

  @Column({ nullable: true })
  emailVerificationToken: string; // Token for email verification

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @Column({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
    onUpdate: 'CURRENT_TIMESTAMP',
  })
  lastUpdatedAt: Date;

  @Column({ nullable: true })
  passwordResetToken?: string;

  @Column({ type: 'timestamp', nullable: true })
  passwordResetTokenExpires?: Date;

  @OneToMany(() => GeofenceAlert, (alert) => alert.user)
  geofenceAlerts: GeofenceAlert[];
}
