import { Injectable } from "@nestjs/common";
import { PrismaService } from "../database/prisma.service";
import { Prisma, Dormitory } from "@prisma/client";

@Injectable()
export class DormitoryService {
  constructor(private prismaService: PrismaService) {}

  public async createDormitory(data: Prisma.DormitoryCreateInput): Promise<Dormitory> {
    return this.prismaService.dormitory.create({ data });
  }

  public async getDormitory(where: Prisma.DormitoryWhereUniqueInput): Promise<Dormitory | null> {
    return this.prismaService.dormitory.findUnique({ where });
  }

  public async getDormitories(params: {
    skip?: number;
    take?: number;
    cursor?: Prisma.DormitoryWhereUniqueInput;
    where?: Prisma.DormitoryWhereInput;
    orderBy?: Prisma.DormitoryOrderByWithRelationInput;
  }): Promise<Dormitory[]> {
    const { skip, take, cursor, where, orderBy } = params;
    return this.prismaService.dormitory.findMany({
      skip,
      take,
      cursor,
      where,
      orderBy,
    });
  }

  async updateDormitory(params: { where: Prisma.DormitoryWhereUniqueInput; data: Prisma.DormitoryUpdateInput }): Promise<Dormitory> {
    const { data, where } = params;
    return this.prismaService.dormitory.update({
      data,
      where,
    });
  }

  async deleteDormitory(where: Prisma.DormitoryWhereUniqueInput): Promise<Dormitory> {
    return this.prismaService.dormitory.delete({
      where,
    });
  }

  async getRoomsInDormitory(id: number): Promise<Dormitory | null> {
    return this.prismaService.dormitory.findUnique({
      where: {
        id: id,
      },
      include: {
        rooms: true,
      },
    });
  }
}
