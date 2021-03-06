import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import bcrypt from 'bcryptjs';
import { InjectRepository } from '@nestjs/typeorm';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { Response } from 'express';
import { UserService } from '@/user/user.service';
import { UserWithOutPassword } from '@/types/user.types';
import { UserRepository } from '@/user/user.repository';
import { SighInUserDto } from '@/auth/dto/sigh.in.user.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(UserRepository)
    // eslint-disable-next-line no-unused-vars
    private userRepository: UserRepository,
    // eslint-disable-next-line no-unused-vars
    private userService: UserService,
    // eslint-disable-next-line no-unused-vars
    private jwtService: JwtService,
    // eslint-disable-next-line no-unused-vars
    private configService: ConfigService
  ) {}

  // LocalStrategy에서 사용하는 로그인 함수 검증을 할 때 이 안으로 데이터가 들어간다.
  async validateUser(sighInUserDto: SighInUserDto): Promise<UserWithOutPassword> {
    const { username, password, } = sighInUserDto;

    const user = await this.userRepository.findOne({
      where: { username, },
    });

    if (!user) {
      throw new HttpException({
        message: '데이터베이스에서 해당 유저를 찾을 수 없습니다.',
      }, HttpStatus.FORBIDDEN);
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (isMatch) {
      const { password, ...userWithOutPassword } = user;
      return userWithOutPassword;
    } else {
      throw new HttpException({
        message: '비밀번호가 일치하지 않습니다.',
      }, HttpStatus.FORBIDDEN);
    }
  }

  // 로그인을 하면 토큰을 발급해준다.
  async sighIn(user: UserWithOutPassword, res: Response): Promise<void> {
    const token = this.jwtService.sign({ username: user.username, email: user.email, });
    const cookie = `Authentication=${token}; HttpOnly; Path=/; Max-Age=${this.configService.get('JWT_EXP')}`;

    res.setHeader('Set-Cookie', cookie);

    throw new HttpException(user, HttpStatus.OK);
  }

  // 로그아웃을 하면 토큰을 제거한다.
  sighOut(res: Response): void {
    const cookie = `Authentication=; HttpOnly; Path=/; Max-Age=0`;

    res.setHeader('Set-Cookie', cookie);

    throw new HttpException({
      message: '로그아웃 되었습니다.',
    }, HttpStatus.OK);
  }
}
