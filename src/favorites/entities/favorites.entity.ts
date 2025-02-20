import { User } from 'src/user/entities/user.entity';
import { Video } from 'src/video/entities/video.entity';
import {
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity({ name: 'favorites' })
export class Favorite {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, (user) => user.favorites)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @ManyToOne(() => Video, (video) => video.favorites)
  @JoinColumn({ name: 'video_id' })
  video: Video;

  @CreateDateColumn()
  favoritedAt: Date;
}
