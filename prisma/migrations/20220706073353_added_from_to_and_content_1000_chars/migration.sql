/*
  Warnings:

  - You are about to alter the column `content` on the `Kudo` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(1000)`.

*/
-- AlterTable
ALTER TABLE "Kudo" ADD COLUMN     "from" VARCHAR(255) NOT NULL DEFAULT '-',
ADD COLUMN     "to" VARCHAR(255) NOT NULL DEFAULT '-',
ALTER COLUMN "content" SET DATA TYPE VARCHAR(1000);
