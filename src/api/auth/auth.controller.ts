import { Body, Controller, Post } from '@nestjs/common';
import { SignUpDto, SignInDto } from './dtos';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  /**
   * Sign Up Flow
   * @returns
   * @param signUpDto
   */
  @Post('/sign-up')
  signUp(@Body() signUpDto: SignUpDto) {
    return this.authService.signUp(signUpDto);
  }

  /**
   * Sign In Flow
   * @returns
   * @param signInDto
   */
  @Post('/sign-in')
  signIn(@Body() signInDto: SignInDto) {
    return this.authService.signIn(signInDto);
  }
}
