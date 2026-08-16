-- CreateTable
CREATE TABLE "Players" (
    "id" SERIAL NOT NULL,
    "Match_id" INTEGER NOT NULL,
    "Team" TEXT NOT NULL,
    "Name" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Players_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Goals" (
    "id" SERIAL NOT NULL,
    "Match_id" INTEGER NOT NULL,
    "Player_id" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Goals_pkey" PRIMARY KEY ("id")
);
