import { Module } from "@nestjs/common";
import { AuthService } from "src/auth/auth.service";
import { JwtStrategy } from "src/auth/strategies/jwt.strategy";
import { LocalStrategy } from "src/auth/strategies/local.strategy";
import { PrismaModule } from "src/database/prisma.module";
import { AuthController } from "./auth.controller";
import { UserModule } from "src/user/user.module";
import { JwtModule } from "@nestjs/jwt";
import { MulterModule } from "@nestjs/platform-express";
import { diskStorage } from "multer";
import { v4 as uuidv4 } from "uuid";
import { MailModule } from "src/mail/mail.module";
import { PaymentModule } from "src/payment/payment.module";

@Module({
  imports: [
    PrismaModule,
    UserModule,
    MailModule,
    PaymentModule,
    JwtModule.register({
      secret: process.env.APP_SECRET,
    }),
    MulterModule.registerAsync({
      useFactory: () => ({
        storage: diskStorage({
          destination: "./studentDocuments",
          filename: (req, file, cb) => {
            const fileName = `${uuidv4()}-docs`;
            cb(null, fileName);
          },
        }),
      }),
    }),
  ],
  providers: [AuthService, LocalStrategy, JwtStrategy],
  controllers: [AuthController],
})
export class AuthModule {}
