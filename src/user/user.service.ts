import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './entities/user.entity';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserStatus } from './enums/status.users';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  create(createUserDto: CreateUserDto) {
    return this.userRepository.save(createUserDto);
  }

  findByEmail(email: string) {
    return this.userRepository.findOneBy({ email });
  }

  findById(userId: number) {
    return this.userRepository.findOneBy({ id: userId });
  }

  updateToAuth(data: CreateUserDto) {
    return this.userRepository.update(
      { email: data.email },
      {
        accessCode: data.accessCode,
        accessCodeExpiration: data.accessCodeExpiration,
        status: UserStatus.Checking,
      },
    );
  }

  update(id: number, body: UpdateUserDto) {
    return this.userRepository.update(
      {
        id,
      },
      body,
    );
  }

  updateValidateUser(email: string) {
    return this.userRepository.update(
      { email },
      {
        accessCode: null,
        accessCodeExpiration: null,
        emailVerifiedAt: new Date(),
        status: UserStatus.Active,
      },
    );
  }
}
