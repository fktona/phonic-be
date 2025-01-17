/*
  Warnings:

  - You are about to drop the `Assistant` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "Assistant";

-- CreateTable
CREATE TABLE "Agents" (
    "id" TEXT NOT NULL,
    "style" TEXT NOT NULL,
    "firstMessage" TEXT NOT NULL,
    "instructions" TEXT NOT NULL,
    "voice" TEXT NOT NULL,

    CONSTRAINT "Agents_pkey" PRIMARY KEY ("id")
);
