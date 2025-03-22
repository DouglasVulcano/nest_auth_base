import {
  Controller,
  Post,
  Body,
  Patch,
  Delete,
  UseGuards,
  Get,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { AuthTokenGuard } from 'src/auth/guards/auth-token.guard';
import { TokenPayloadParam } from 'src/auth/params/token-payload.param';
import { JwtPayloadDto } from 'src/auth/dto/jwt-payload.dto';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('me')
  @UseGuards(AuthTokenGuard)
  me(@TokenPayloadParam() TokenPayloadParam: JwtPayloadDto) {
    return this.userService.findOne(TokenPayloadParam.sub);
  }

  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }

  @Patch()
  @UseGuards(AuthTokenGuard)
  update(
    @Body() updateUserDto: UpdateUserDto,
    @TokenPayloadParam() TokenPayloadParam: JwtPayloadDto,
  ) {
    return this.userService.update(TokenPayloadParam.sub, updateUserDto);
  }

  @Delete()
  @UseGuards(AuthTokenGuard)
  remove(@TokenPayloadParam() TokenPayloadParam: JwtPayloadDto) {
    return this.userService.remove(TokenPayloadParam.sub);
  }
}
