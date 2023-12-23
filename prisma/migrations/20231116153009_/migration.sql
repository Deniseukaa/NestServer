/*
  Warnings:

  - Added the required column `refreshToken` to the `Dormitory` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Dormitory" ADD COLUMN     "refreshToken" TEXT NOT NULL;
