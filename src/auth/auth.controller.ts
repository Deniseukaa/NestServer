import {
  Body,
  Controller,
  FileTypeValidator,
  Get,
  HttpCode,
  HttpException,
  HttpStatus,
  MaxFileSizeValidator,
  ParseFilePipe,
  Post,
  Req,
  Res,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from "@nestjs/common";
import { User } from "@prisma/client";
import { Request, Response } from "express";
import { AuthService } from "src/auth/auth.service";
import { Cookies } from "src/auth/decorators/cookies.decorator";
import { CurrentUser } from "src/auth/decorators/current-user.decorator";
import { JWTAuthGuard } from "src/auth/guards/jwt-auth.guard";
import { LocalAuthGuard } from "src/auth/guards/local-auth.guard";
import { UserCreateDto } from "src/auth/dto/user.create.dto";
import { FileInterceptor } from "@nestjs/platform-express";
import { BodyInterceptor } from "src/common/interceptors/body.data.interceptor";

@Controller("auth")
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post("login")
  @UseGuards(LocalAuthGuard)
  @HttpCode(HttpStatus.OK)
  async login(@CurrentUser() user: User, @Res() response: Response): Promise<void> {
    const { accessToken, refreshToken, userData } = await this.authService.login(user);
    response.cookie("refreshToken", refreshToken, { httpOnly: true, secure: false, sameSite: "none", maxAge: 24 * 60 * 60 * 1000 });
    response.json({ accessToken, refreshToken, userData });
  }

  @Post("register")
  @HttpCode(HttpStatus.CREATED)
  @UseInterceptors(FileInterceptor("file"), BodyInterceptor)
  async register(
    @Body() signUp: UserCreateDto,
    @UploadedFile(
      new ParseFilePipe({
        validators: [new MaxFileSizeValidator({ maxSize: 10485760 }), new FileTypeValidator({ fileType: "pdf" })],
      }),
    )
    file: Express.Multer.File,
  ): Promise<User> {
    console.log(1);
    const fileName = file.filename;
    return this.authService.register(signUp, fileName);
  }

  @Get("me")
  @UseGuards(JWTAuthGuard)
  @HttpCode(HttpStatus.OK)
  async me(@CurrentUser() user: User): Promise<User> {
    return user;
  }

  @Get("logout")
  @UseGuards(JWTAuthGuard)
  async logout(@CurrentUser() user: User, @Req() request: Request, @Res() response: Response): Promise<void> {
    const cookies = request.cookies;
    if (!cookies) throw new HttpException("No content", HttpStatus.NO_CONTENT);
    this.authService.logout(user.email, response);
  }

  @Get("refresh")
  async refresh(@Cookies("refreshToken") token: string): Promise<{ accessToken: string }> {
    return this.authService.refreshAccessToken(token);
  }
}
