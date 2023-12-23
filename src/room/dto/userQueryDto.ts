import { IsEmail } from "class-validator";

export class UserQueryDto {
  @IsEmail()
  email: string;
}
