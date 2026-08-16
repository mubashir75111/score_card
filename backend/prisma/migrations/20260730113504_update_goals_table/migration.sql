/*
  Warnings:

  - You are about to drop the column `Team_A_goal` on the `Goals` table. All the data in the column will be lost.
  - You are about to drop the column `Team_B_goal` on the `Goals` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Goals" DROP COLUMN "Team_A_goal",
DROP COLUMN "Team_B_goal",
ADD COLUMN     "Is_goal" BOOLEAN NOT NULL DEFAULT false,
ALTER COLUMN "Shot_type" DROP DEFAULT;
