import {
  Injectable,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { HashingService } from 'src/auth/hashing/hashing.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly hashingService: HashingService,
  ) {}

  async create(createUserDto: CreateUserDto) {
    const existingUser = await this.userRepository.findOneBy({
      email: createUserDto.email,
    });

    if (existingUser) throw new ConflictException('Email already exists');

    const password = await this.hashingService.hash(createUserDto.password);
    await this.userRepository.save({
      ...createUserDto,
      password,
    });
    return { message: 'User created successfully' };
  }

  async findAll() {
    return await this.userRepository.find();
  }

  async findOne(id: number) {
    const user = await this.userRepository.findOneBy({ id });
    if (!user) throw new NotFoundException('User not found');
    return user;
  }

  async findByEmail(email: string, withPassword = false) {
    const query = this.userRepository
      .createQueryBuilder('user')
      .where('user.email = :email', { email });

    if (withPassword) {
      query.addSelect('user.password');
    }

    const user = await query.getOne();
    if (!user) throw new NotFoundException('User not found');

    return user;
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    const user = await this.findOne(id);

    const dataToUpdate = {
      name: updateUserDto?.name,
    };

    if (updateUserDto?.password) {
      dataToUpdate['password'] = await this.hashingService.hash(
        updateUserDto.password,
      );
    }

    const updatedUser = await this.userRepository.preload({
      ...user,
      ...dataToUpdate,
    });

    if (!updatedUser) throw new NotFoundException('User not found');

    await this.userRepository.save(updatedUser);
    return await this.findOne(id);
  }

  async remove(id: number) {
    const user = await this.findOne(id);
    await this.userRepository.softRemove(user);
    return user;
  }
}
