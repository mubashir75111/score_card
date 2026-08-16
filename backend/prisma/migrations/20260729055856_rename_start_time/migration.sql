/*
  Warnings:

  - You are about to drop the column `Time` on the `Match` table. All the data in the column will be lost.
  - Added the required column `Start_Time` to the `Match` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Match" DROP COLUMN "Time",
ADD COLUMN     "Start_Time" TIMESTAMP(3) NOT NULL;
