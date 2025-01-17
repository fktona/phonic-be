-- CreateTable
CREATE TABLE "Assistant" (
    "id" TEXT NOT NULL,
    "style" TEXT NOT NULL,
    "firstMessage" TEXT NOT NULL,
    "instructions" TEXT NOT NULL,
    "voice" TEXT NOT NULL,

    CONSTRAINT "Assistant_pkey" PRIMARY KEY ("id")
);
