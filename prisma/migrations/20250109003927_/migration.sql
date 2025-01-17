/*
  Warnings:

  - You are about to drop the column `email` on the `Agent` table. All the data in the column will be lost.
  - Added the required column `firstMessage` to the `Agent` table without a default value. This is not possible if the table is not empty.
  - Added the required column `instructions` to the `Agent` table without a default value. This is not possible if the table is not empty.
  - Added the required column `style` to the `Agent` table without a default value. This is not possible if the table is not empty.
  - Added the required column `voice` to the `Agent` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "Agent_email_key";

-- AlterTable
ALTER TABLE "Agent" DROP COLUMN "email",
ADD COLUMN     "firstMessage" TEXT NOT NULL,
ADD COLUMN     "instructions" TEXT NOT NULL,
ADD COLUMN     "style" TEXT NOT NULL,
ADD COLUMN     "voice" TEXT NOT NULL;
