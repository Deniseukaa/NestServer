/*
  Warnings:

  - You are about to drop the column `surname` on the `User` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "User" DROP COLUMN "surname",
ALTER COLUMN "refreshToken" DROP NOT NULL;
