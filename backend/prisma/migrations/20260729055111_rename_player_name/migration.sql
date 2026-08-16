/*
  Warnings:

  - You are about to drop the column `Name` on the `Players` table. All the data in the column will be lost.
  - Added the required column `Player_name` to the `Players` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Players" DROP COLUMN "Name",
ADD COLUMN     "Player_name" TEXT NOT NULL;
