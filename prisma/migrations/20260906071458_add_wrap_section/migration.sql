-- AlterTable
ALTER TABLE "Lesson" ADD COLUMN     "keyTakeaways" TEXT[];

-- CreateTable
CREATE TABLE "WrapUpQuestion" (
    "id" TEXT NOT NULL,
    "lessonId" TEXT NOT NULL,
    "prompt" TEXT NOT NULL,
    "answer" TEXT NOT NULL,
    "order" INTEGER NOT NULL,

    CONSTRAINT "WrapUpQuestion_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "WrapUpKeyTerm" (
    "id" TEXT NOT NULL,
    "lessonId" TEXT NOT NULL,
    "term" TEXT NOT NULL,
    "definition" TEXT NOT NULL,
    "order" INTEGER NOT NULL,

    CONSTRAINT "WrapUpKeyTerm_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "WrapUpQuestion_lessonId_idx" ON "WrapUpQuestion"("lessonId");

-- CreateIndex
CREATE UNIQUE INDEX "WrapUpQuestion_lessonId_order_key" ON "WrapUpQuestion"("lessonId", "order");

-- CreateIndex
CREATE INDEX "WrapUpKeyTerm_lessonId_idx" ON "WrapUpKeyTerm"("lessonId");

-- CreateIndex
CREATE UNIQUE INDEX "WrapUpKeyTerm_lessonId_order_key" ON "WrapUpKeyTerm"("lessonId", "order");

-- AddForeignKey
ALTER TABLE "WrapUpQuestion" ADD CONSTRAINT "WrapUpQuestion_lessonId_fkey" FOREIGN KEY ("lessonId") REFERENCES "Lesson"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WrapUpKeyTerm" ADD CONSTRAINT "WrapUpKeyTerm_lessonId_fkey" FOREIGN KEY ("lessonId") REFERENCES "Lesson"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
