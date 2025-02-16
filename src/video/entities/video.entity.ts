import { Author } from 'src/author/entities/author.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryColumn,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { VideoStatus } from '../enums/video-status.enum';

@Entity()
export class Video {
  @PrimaryGeneratedColumn()
  id: number;

  @PrimaryColumn({
    type: 'varchar',
    unique: true,
    length: 11,
    comment: 'The video id on youtube',
  })
  youtubeId: string;

  @Column({ type: 'varchar', length: 120 })
  title: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ type: 'varchar', length: 80 })
  url: string;

  @Column({ type: 'integer' })
  durationInSeconds: number;

  @Column({ type: 'varchar', length: 20 })
  category: string;

  @Column({ type: 'timestamp' })
  uploadDate: Date;

  @Column({ type: 'varchar', length: 150 })
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

  @ManyToOne(() => Author, (author) => author.videos, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'author_id' })
  author: Author;
}
