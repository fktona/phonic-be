/*
  Warnings:

  - You are about to drop the column `agentId` on the `Battle` table. All the data in the column will be lost.
  - You are about to drop the column `agents` on the `Battle` table. All the data in the column will be lost.
  - Added the required column `firstAgentId` to the `Battle` table without a default value. This is not possible if the table is not empty.
  - Added the required column `secondAgentId` to the `Battle` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Battle" DROP CONSTRAINT "Battle_agentId_fkey";

-- AlterTable
ALTER TABLE "Battle" DROP COLUMN "agentId",
DROP COLUMN "agents",
ADD COLUMN     "firstAgentId" TEXT NOT NULL,
ADD COLUMN     "secondAgentId" TEXT NOT NULL,
ALTER COLUMN "description" SET NOT NULL,
ALTER COLUMN "description" SET DATA TYPE TEXT;

-- AddForeignKey
ALTER TABLE "Battle" ADD CONSTRAINT "Battle_firstAgentId_fkey" FOREIGN KEY ("firstAgentId") REFERENCES "Agent"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Battle" ADD CONSTRAINT "Battle_secondAgentId_fkey" FOREIGN KEY ("secondAgentId") REFERENCES "Agent"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
