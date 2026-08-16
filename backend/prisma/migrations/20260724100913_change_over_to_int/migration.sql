/*
  Warnings:

  - Changed the type of `over` on the `Match` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "Match" DROP COLUMN "over",
ADD COLUMN     "over" INTEGER NOT NULL;
