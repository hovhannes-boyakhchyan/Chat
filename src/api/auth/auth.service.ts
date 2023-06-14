import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersRepository } from '../../common/repositories';
import { BcryptService } from '../../common/services/bcrypt/bcrypt.service';
import { User } from '../../common/schemas';
import { SignInDto, SignUpDto } from './dtos';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersRepository: UsersRepository,
    private readonly bcryptService: BcryptService,
    private jwtService: JwtService,
  ) {}

  async signUp(signUpDto: SignUpDto): Promise<User> {
    const passwordHash = await this.bcryptService.hashing(signUpDto.password);
    const userData: SignUpDto = {
      name: signUpDto.name,
      userName: signUpDto.userName,
      email: signUpDto.email,
      password: passwordHash,
    };
    return this.usersRepository.createUser(userData);
  }

  async signIn(signInDto: SignInDto) {
    const user = await this.usersRepository.getUserByParams({
      $or: [{ email: signInDto.userName }, { userName: signInDto.userName }],
    });

    if (!user)
      throw new UnauthorizedException('The username or password is wrong.');

    const isPassRight = await this.bcryptService.compare(
      signInDto.password,
      user.password,
    );
    if (!isPassRight)
      throw new UnauthorizedException('The username or password is wrong.');

    return {
      _id: user._id,
      name: user.name,
      userName: user.userName,
      email: user.email,
      access_token: await this.jwtService.signAsync({
        _id: user._id,
      }),
    };
  }

  async validateToken(token): Promise<User> {
    try {
      const verifyToken = await this.jwtService.verifyAsync(token);

      if (verifyToken._id) {
        return this.usersRepository.getUserByParams({
          _id: verifyToken._id,
        });
      }
    } catch (e) {
      return null;
    }
  }
}
