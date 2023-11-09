import { ConflictException, Injectable, Logger, UnauthorizedException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { JwtPayload } from "./interfaces/jwt-payload.interface";
import * as bcrypt from "bcryptjs";
import { UserService } from "src/user/user.service";
import { Prisma, User } from "@prisma/client";
import { PrismaService } from "../database/prisma.service";
import { UserRequest } from "src/auth/interfaces/user.req.interface";

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
    private readonly prismaService: PrismaService,
  ) {}

  async register(signUp: Prisma.UserCreateInput): Promise<User> {
    const existingUser = this.prismaService.user.findUnique({
      where: {
        email: signUp.email,
      },
    });
    if (existingUser) throw new ConflictException("The user with the specified email already exists");
    const data = { ...signUp, password: await this.hashPassword(signUp.password) };
    const user = await this.userService.createUser(data);
    delete user.password;
    return user;
  }

  async login(user: User): Promise<{ access_token: string }> {
    return {
      access_token: await this.signToken(user),
    };
  }

  async validateUser(email: string, password: string): Promise<User> {
    const user = await this.prismaService.user.findUnique({
      where: {
        email,
      },
    });

    if (!user) {
      this.logger.debug(`User with email: ${email} - not found!`);
      throw new UnauthorizedException();
    }

    if (!(await bcrypt.compare(password, user.password))) {
      this.logger.debug(`Invalid credentials for user with email: ${email}`);
      throw new UnauthorizedException();
    }
    return user;
  }

  async verifyPayload(payload: JwtPayload): Promise<UserRequest> {
    const user = await this.prismaService.user.findUnique({
      where: {
        email: payload.sub,
      },
      select: {
        email: true,
        role: true,
      },
    });

    if (!user) {
      throw new UnauthorizedException(`There isn't any user with email: ${payload.sub}`);
    }
    return user;
  }

  async signToken(user: User): Promise<string> {
    const payload = {
      sub: user.email,
    };
    return this.jwtService.signAsync(payload);
  }

  public async hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, 10);
  }
}
