import { Injectable } from "@nestjs/common";
import { PrismaService } from "../database/prisma.service";
import { Prisma, Room } from "@prisma/client";

@Injectable()
export class RoomService {
  constructor(private prismaService: PrismaService) {}

  public async createRoom(data: Prisma.RoomCreateInput): Promise<Room> {
    return this.prismaService.room.create({ data });
  }

  public async getRoom(where: Prisma.RoomWhereUniqueInput): Promise<Room | null> {
    return this.prismaService.room.findUnique({
      where,
      include: {
        users: {
          select: {
            name: true,
            surname: true,
            email: true,
          },
        },
        dormitory: {
          select: {
            name: true,
          },
        },
      },
    });
  }

  public async getRoomViaUserId(id: number): Promise<Room | null> {
    return this.prismaService.room.findFirst({
      where: {
        users: {
          some: {
            id, // or equals: email if you want an exact match
          },
        },
      },
      include: {
        users: {
          select: {
            name: true,
            surname: true,
            email: true,
          },
        },
        dormitory: {
          select: {
            name: true,
          },
        },
      },
    });
  }

  public async getRooms(params: {
    skip?: number;
    take?: number;
    cursor?: Prisma.RoomWhereUniqueInput;
    where?: Prisma.RoomWhereInput;
    orderBy?: Prisma.RoomOrderByWithRelationInput;
  }): Promise<Room[]> {
    const { skip, take, cursor, where, orderBy } = params;
    return this.prismaService.room.findMany({
      skip,
      take,
      cursor,
      where,
      orderBy,
    });
  }

  async updateRoom(params: { where: Prisma.RoomWhereUniqueInput; data: Prisma.RoomUpdateInput }): Promise<Room> {
    const { data, where } = params;
    return this.prismaService.room.update({
      data,
      where,
    });
  }

  async deleteRoom(where: Prisma.RoomWhereUniqueInput): Promise<Room> {
    return this.prismaService.room.delete({
      where,
    });
  }
}
