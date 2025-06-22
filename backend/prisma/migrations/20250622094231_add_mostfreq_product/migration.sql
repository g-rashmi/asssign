/*
  Warnings:

  - You are about to drop the `mostfreq` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "mostfreq";

-- CreateTable
CREATE TABLE "Mostfreq" (
    "id" SERIAL NOT NULL,
    "word" TEXT NOT NULL,
    "count" INTEGER NOT NULL DEFAULT 1,
    "productId" INTEGER NOT NULL,

    CONSTRAINT "Mostfreq_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Mostfreq_word_productId_key" ON "Mostfreq"("word", "productId");

-- AddForeignKey
ALTER TABLE "Mostfreq" ADD CONSTRAINT "Mostfreq_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
