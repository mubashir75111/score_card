/*
  Warnings:

  - Added the required column `Shot_type` to the `Goals` table without a default value. This is not possible if the table is not empty.
  - Added the required column `Team_A_goal` to the `Goals` table without a default value. This is not possible if the table is not empty.
  - Added the required column `Team_B_goal` to the `Goals` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Goals" ADD COLUMN     "Shot_type" TEXT NOT NULL,
ADD COLUMN     "Team_A_goal" INTEGER NOT NULL,
ADD COLUMN     "Team_B_goal" INTEGER NOT NULL;
