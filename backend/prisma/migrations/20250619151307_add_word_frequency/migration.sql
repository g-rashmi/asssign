-- CreateTable
CREATE TABLE "mostfreq" (
    "count" INTEGER NOT NULL,
    "word" TEXT,

    CONSTRAINT "mostfreq_pkey" PRIMARY KEY ("count")
);

-- CreateIndex
CREATE UNIQUE INDEX "mostfreq_word_key" ON "mostfreq"("word"); 
