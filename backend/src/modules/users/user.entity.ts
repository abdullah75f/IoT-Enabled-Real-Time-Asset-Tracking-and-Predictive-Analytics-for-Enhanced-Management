import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { GenderEnum } from '../enum/gender-enum';
import { Matches } from 'class-validator';

@Entity('user')
export default class User {
  @PrimaryGeneratedColumn('uuid')
  userId: number;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column({ nullable: true })
  email: string;

  @Matches(/^\d{10}$/, { message: 'phoneNumber must be exactly 10 digits' })
  @Column({ nullable: true })
  phoneNumber: string;

  @Column({
    type: 'enum',
    enum: GenderEnum,
  })
  gender: GenderEnum;

  @Column()
  address: string;

  @Column()
  age: string;

  @Column()
  passwordHash: string;

  @Column({ nullable: true })
  profilePicture: string;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  lastUpdatedAt: Date;
}
