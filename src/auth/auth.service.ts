import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { LoginDto } from './dto/login.dto';
import { UserService } from 'src/user/user.service';
import { HashingService } from './hashing/hashing.service';
import jwtConfig from './config/jwt.config';
import { ConfigType } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly hashingService: HashingService,
    @Inject(jwtConfig.KEY)
    private readonly jwtConfiguration: ConfigType<typeof jwtConfig>,
    private readonly jwtService: JwtService,
  ) {}

  async login(loginDto: LoginDto) {
    const user = await this.userService.findByEmail(loginDto.email, true);

    if (user) {
      const isPasswordValid = await this.hashingService.compare(
        loginDto.password,
        user.password,
      );
      if (isPasswordValid) {
        const accessToken = this.jwtService.sign(
          {
            sub: user.id,
            email: user.email,
          },
          {
            audience: this.jwtConfiguration.audience,
            issuer: this.jwtConfiguration.issuer,
            secret: this.jwtConfiguration.secret,
            expiresIn: this.jwtConfiguration.expiresIn,
          },
        );
        return { accessToken };
      }
    }
    throw new UnauthorizedException('Invalid credentials');
  }
}
