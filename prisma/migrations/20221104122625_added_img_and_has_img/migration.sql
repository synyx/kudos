/*
  Warnings:

  - Added the required column `hasImg` to the `Kudo` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Kudo" ADD COLUMN     "hasImg" BOOLEAN NOT NULL,
ADD COLUMN     "img" VARCHAR(10000) NOT NULL DEFAULT '';
