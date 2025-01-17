/*
  Warnings:

  - Added the required column `model` to the `Agent` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Agent" ADD COLUMN     "model" TEXT NOT NULL;
