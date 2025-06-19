/*
  Warnings:

  - The primary key for the `mostfreq` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- AlterTable
ALTER TABLE "mostfreq" DROP CONSTRAINT "mostfreq_pkey",
ADD COLUMN     "id" SERIAL NOT NULL,
ADD CONSTRAINT "mostfreq_pkey" PRIMARY KEY ("id");
