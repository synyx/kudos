/*
  Warnings:

  - You are about to drop the column `title` on the `Kudo` table. All the data in the column will be lost.
  - You are about to drop the column `titleColor` on the `Kudo` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Kudo" DROP COLUMN "title",
DROP COLUMN "titleColor",
ADD COLUMN     "kudoTitle" VARCHAR(20) NOT NULL DEFAULT 'WELL_DONE';
