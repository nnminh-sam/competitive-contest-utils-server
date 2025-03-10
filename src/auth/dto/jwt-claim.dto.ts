export class JwtClaimDto {
  sub: string;
  email: string;
  jti?: string;
  exp?: number;
}
