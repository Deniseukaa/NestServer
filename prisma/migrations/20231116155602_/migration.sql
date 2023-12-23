/*
  Warnings:

  - You are about to drop the column `refreshToken` on the `Dormitory` table. All the data in the column will be lost.
  - Added the required column `refreshToken` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Dormitory" DROP COLUMN "refreshToken";

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "refreshToken" TEXT NOT NULL;
