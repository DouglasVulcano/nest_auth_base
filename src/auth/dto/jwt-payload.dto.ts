export class JwtPayloadDto {
  sub: number;
  email: string;
  iat: number;
  exp: number;
  aud: string;
  iss: string;
}
