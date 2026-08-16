-- CreateTable
CREATE TABLE "Match" (
    "id" SERIAL NOT NULL,
    "match_name" TEXT NOT NULL,
    "over" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Match_pkey" PRIMARY KEY ("id")
);
