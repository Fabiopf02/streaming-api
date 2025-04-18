import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { UserStatus } from '../enums/status.users';
import { Favorite } from 'src/favorites/entities/favorites.entity';

@Entity({ name: 'users' })
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 45, nullable: true })
  name: string;

  @Column({ type: 'varchar', length: 45, unique: true })
  email: string;

  @Column({ type: 'enum', enum: UserStatus, default: UserStatus.Checking })
  status: UserStatus;

  @Column({ type: 'timestamptz', default: null, nullable: true })
  emailVerifiedAt: Date;

  @Column({ type: 'varchar', length: 8, nullable: true })
  accessCode: string | null;

  @Column({ type: 'timestamp', nullable: true })
  accessCodeExpiration: Date | null;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @OneToMany(() => Favorite, (favorite) => favorite.user)
  favorites: Favorite[];
}
