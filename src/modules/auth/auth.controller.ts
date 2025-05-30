import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  Query,
  Version,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';

import { Contestant } from 'src/models/contestant.model';
import { ApiResponseWrapper } from 'src/common/decorators/api-response-wrapper.decorator';
import { AuthService } from 'src/modules/auth/auth.service';
import { AuthResponseDto } from 'src/modules/auth/dto/auth-response.dto';
import { SignInDto } from 'src/modules/auth/dto/sign-in.dto';
import { SignUpDto } from 'src/modules/auth/dto/sign-up.dto';
import { ChangePasswordResponseDto } from 'src/modules/auth/dto/change-password-response.dto';
import { ChangePasswordDto } from 'src/modules/auth/dto/change-password.dto';
import { ResetPasswordDto } from 'src/modules/auth/dto/reset-password.dto';

@ApiTags('Authentication')
@Controller({
  path: 'auth',
  version: '1',
})
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiOperation({ summary: 'Sign in' })
  @ApiResponseWrapper(AuthResponseDto)
  @ApiOkResponse({ description: 'Success sign in operation' })
  @ApiBadRequestResponse({ description: 'Wrong email or password' })
  @Post('sign-in')
  async signIn(@Body() signInDto: SignInDto) {
    return await this.authService.signIn(signInDto);
  }

  @ApiOperation({ summary: 'Sign up' })
  @ApiResponseWrapper(AuthResponseDto)
  @ApiOkResponse({ description: 'Success sign up operation' })
  @ApiBadRequestResponse({
    description: 'Email, username or student ID is taken',
  })
  @Post('sign-up')
  async signUp(@Body() signUpDto: SignUpDto) {
    return await this.authService.signUp(signUpDto);
  }

  @ApiOperation({ summary: 'Request to reset password' })
  @ApiResponseWrapper(ChangePasswordResponseDto)
  @ApiOkResponse({ description: 'Return a token for calling reset password' })
  @ApiNotFoundResponse({
    description: 'Cannot find contestant from the given email',
  })
  @HttpCode(200)
  @Post('forgot-password')
  async forgotPassword(@Body() changePasswordDto: ChangePasswordDto) {
    return await this.authService.forgotPassword(changePasswordDto);
  }

  @ApiOperation({
    summary: 'Reset password with given token from forgot password API',
  })
  @ApiResponseWrapper(Contestant)
  @ApiOkResponse({ description: 'Return contestant object' })
  @ApiBadRequestResponse({ description: 'Token expired or incorrect token' })
  @HttpCode(200)
  @Post('reset-password')
  async resetPassword(@Body() resetPasswordDto: ResetPasswordDto) {
    return await this.authService.resetPassword(
      resetPasswordDto.token,
      resetPasswordDto.newPassword,
    );
  }
}
