// src/auth/params/token-payload.param.ts
import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { TOKEN_PAYLOAD } from '../guards/auth-token.guard';
import { Request } from 'express';
import { JwtPayloadDto } from '../dto/jwt-payload.dto';

export const TokenPayloadParam = createParamDecorator(
  (data: unknown, ctx: ExecutionContext): JwtPayloadDto => {
    const context = ctx.switchToHttp();
    const request: Request = context.getRequest();

    return request[TOKEN_PAYLOAD] as JwtPayloadDto;
  },
);
