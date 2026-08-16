/*
  Warnings:

  - You are about to drop the column `match_name` on the `Match` table. All the data in the column will be lost.
  - You are about to drop the column `over` on the `Match` table. All the data in the column will be lost.
  - Added the required column `Team_A` to the `Match` table without a default value. This is not possible if the table is not empty.
  - Added the required column `Team_B` to the `Match` table without a default value. This is not possible if the table is not empty.
  - Added the required column `Time` to the `Match` table without a default value. This is not possible if the table is not empty.
  - Added the required column `Venue` to the `Match` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Match" DROP COLUMN "match_name",
DROP COLUMN "over",
ADD COLUMN     "Team_A" TEXT NOT NULL,
ADD COLUMN     "Team_B" TEXT NOT NULL,
ADD COLUMN     "Time" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "Venue" TEXT NOT NULL;
