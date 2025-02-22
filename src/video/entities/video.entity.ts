import { Author } from 'src/author/entities/author.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { VideoStatus } from '../enums/video-status.enum';
import { Favorite } from 'src/favorites/entities/favorites.entity';

@Entity()
export class Video {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: 'varchar',
    unique: true,
    length: 11,
    comment: 'The video id on youtube',
  })
  youtubeId: string;

  @Column({ type: 'varchar', length: 140 })
  title: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ type: 'varchar', unique: true, length: 100 })
  url: string;

  @Column({ type: 'integer' })
  durationInSeconds: number;

  @Column({ type: 'varchar', length: 20 })
  category: string;

  @Column({ type: 'timestamp' })
  uploadDate: Date;

  @Column({ type: 'varchar', length: 180 })
  thumbnail: string;

  @Column({
    type: 'enum',
    enum: VideoStatus,
    default: VideoStatus.SCHEDULED,
  })
  status: VideoStatus;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @Column({ type: 'integer', nullable: false })
  requestedBy: number;

  @ManyToOne(() => Author, (author) => author.videos, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'author_id' })
  author: Author;

  @OneToMany(() => Favorite, (favorite) => favorite.video)
  favorites: Favorite[];
}
