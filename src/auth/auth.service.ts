import { ConflictException, HttpException, HttpStatus, Injectable, Logger, UnauthorizedException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { JwtPayload } from "./interfaces/jwt-payload.interface";
import * as bcrypt from "bcryptjs";
import { UserService } from "src/user/user.service";
import { Prisma, User } from "@prisma/client";
import { UserRequest } from "src/auth/interfaces/user.req.interface";
import { Response } from "express";
import { MailService } from "src/mail/mail.service";
import { UserLoginResponse } from "src/auth/interfaces/user-login-response.interface";
import { PaymentService } from "src/payment/payment.service";

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
    private readonly mailService: MailService,
    private readonly paymentService: PaymentService,
  ) {}

  async register(signUp: Prisma.UserCreateInput, fileName: string): Promise<User> {
    console.log(signUp);
    const existingUser = await this.userService.getUser({
      email: signUp.email,
    });
    if (existingUser) throw new ConflictException("The user with the specified email already exists");
    const data = { ...signUp, password: await this.hashPassword(signUp.password), documents: fileName };
    const user = await this.userService.createUser(data);
    delete user.password;
    await this.mailService.sendMail({
      to: signUp.email,
      subject: "Вітаємо зі завершенням реєстрації",
      template: "welcome",
      context: {
        name: data.name,
      },
    });
    this.paymentService.createUserCredentials(user.email);
    return user;
  }

  async login(user: User): Promise<UserLoginResponse> {
    const refreshToken = await this.signRefreshToken(user.email);
    const accessToken = await this.signAccessToken(user.email);
    const responseData: UserLoginResponse = {
      accessToken,
      refreshToken,
      userData: {
        email: user.email,
        name: user.name,
        surname: user.surname,
        id: user.id,
      },
    };
    await this.userService.updateUser({
      where: {
        id: user.id,
      },
      data: {
        refreshToken: refreshToken,
      },
    });
    return responseData;
  }

  async validateUser(email: string, password: string): Promise<User> {
    const user = await this.userService.getUser({
      email,
    });
    if (!user) {
      this.logger.debug(`User with email: ${email} - not found!`);
      throw new UnauthorizedException(`User with email: ${email} - not found!`);
    }

    if (!(await bcrypt.compare(password, user.password))) {
      this.logger.debug(`Invalid credentials for user with email: ${email}`);
      throw new UnauthorizedException(`Invalid credentials for user with email: ${email}`);
    }
    return user;
  }

  async verifyPayload(payload: JwtPayload): Promise<UserRequest> {
    const user = await this.userService.getUser({
      email: payload.sub,
    });

    if (!user) {
      throw new UnauthorizedException(`There isn't any user with email: ${payload.sub}`);
    }

    return {
      email: user.email,
      role: user.role,
      stripeId: user.stripeId,
    };
  }

  async signAccessToken(email: string): Promise<string> {
    const payload = {
      sub: email,
    };
    return this.jwtService.signAsync(payload, { expiresIn: "10m" });
  }

  async signRefreshToken(email: string): Promise<string> {
    const payload = {
      sub: email,
    };
    return this.jwtService.signAsync(payload, { expiresIn: "1d" });
  }

  public async hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, 10);
  }

  public async updateRefreshToken(refreshToken: string): Promise<string> {
    console.log(1);
    try {
      if (!refreshToken) throw new HttpException("RefreshToken expired", 403);
      const verified = await this.jwtService.verifyAsync(refreshToken, {
        secret: process.env.APP_SECRET,
      });
      if (!verified) throw new HttpException("RefreshToken expired", 403);
      const payload = this.jwtService.decode(refreshToken) as JwtPayload;
      console.log(payload);
      const foundUser = await this.userService.getUser({ email: payload.sub });
      if (!foundUser) throw new HttpException("RefreshToken expired", 403);
      else return this.signAccessToken(payload.sub);
    } catch (error) {
      throw new HttpException("RefreshToken expired", 403);
    }
  }

  public async logout(email: string, response: Response): Promise<void> {
    const foundUser = await this.userService.getUser({ email: email });
    if (!foundUser) {
      response.clearCookie("refreshToken", { httpOnly: true, sameSite: "none", secure: true });
      throw new HttpException("No content", HttpStatus.NO_CONTENT);
    }
    await this.userService.updateUser({
      where: {
        email: email,
      },
      data: {
        refreshToken: null,
      },
    });
    response.clearCookie("refreshToken", { httpOnly: true, sameSite: "none", secure: true });
    response.send({ message: "Ok" }).sendStatus(204);
  }

  public async refreshAccessToken(token: string): Promise<{ accessToken: string }> {
    if (!token) throw new HttpException("No content", HttpStatus.NO_CONTENT);
    else return { accessToken: await this.updateRefreshToken(token) };
  }
}
