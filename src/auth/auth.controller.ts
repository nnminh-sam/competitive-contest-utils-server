import { Body, Controller, Post, Query } from '@nestjs/common';
import { AuthService } from 'src/auth/auth.service';
import { ChangePasswordDto } from 'src/auth/dto/change-password.dto';
import { SignInDto } from 'src/auth/dto/sign-in.dto';
import { SignUpDto } from 'src/auth/dto/sign-up.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('sign-in')
  async signIn(@Body() signInDto: SignInDto) {
    return await this.authService.signIn(signInDto);
  }

  @Post('sign-up')
  async signUp(@Body() signUpDto: SignUpDto) {
    return await this.authService.signUp(signUpDto);
  }

  @Post('forgot-password')
  async forgotPassword(@Body() changePasswordDto: ChangePasswordDto) {
    return await this.authService.forgotPassword(changePasswordDto);
  }

  @Post('reset-password')
  async resetPassword(
    @Query('token') token: string,
    @Query('new_password') new_password: string,
  ) {
    return await this.authService.resetPassword(token, new_password);
  }
}
