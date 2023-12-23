import { Injectable } from "@nestjs/common";
import { PrismaService } from "../database/prisma.service";
import { Prisma, User } from "@prisma/client";

@Injectable()
export class UserService {
  constructor(private prismaService: PrismaService) {}

  public async createUser(data: Prisma.UserCreateInput): Promise<User> {
    return this.prismaService.user.create({ data });
  }

  public async getUser(where: Prisma.UserWhereUniqueInput): Promise<User | null> {
    return this.prismaService.user.findUnique({
      where,
    });
  }

  public async getUserById(id: number): Promise<Omit<User, "password" | "refreshToken"> | null> {
    return this.prismaService.user.findUnique({
      where: {
        id,
      },
      select: {
        id: true,
        name: true,
        email: true,
        confirmed: true,
        role: true,
        room_id: true,
        surname: true,
        address: true,
        password: true,
        stripeId: true,
        subscriptionId: true,
        documents: true,
      },
    });
  }

  public async getUsers(params: {
    skip?: number;
    take?: number;
    cursor?: Prisma.UserWhereUniqueInput;
    where?: Prisma.UserWhereInput;
    orderBy?: Prisma.UserOrderByWithRelationInput;
  }): Promise<User[]> {
    const { skip, take, cursor, where, orderBy } = params;
    return this.prismaService.user.findMany({
      skip,
      take,
      cursor,
      where,
      orderBy,
    });
  }

  async updateUser(params: { where: Prisma.UserWhereUniqueInput; data: Prisma.UserUpdateInput }): Promise<User> {
    const { data, where } = params;
    return this.prismaService.user.update({
      data,
      where,
    });
  }

  async deleteUser(where: Prisma.UserWhereUniqueInput): Promise<User> {
    return this.prismaService.user.delete({
      where,
    });
  }
}
