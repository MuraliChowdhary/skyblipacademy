/*
  Warnings:

  - You are about to drop the column `contentBody` on the `Lesson` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[moduleId,parentId,order]` on the table `Lesson` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateEnum
CREATE TYPE "LessonKind" AS ENUM ('STANDALONE', 'OVERVIEW', 'TOPIC');

-- DropIndex
DROP INDEX "Lesson_moduleId_order_key";

-- AlterTable
ALTER TABLE "Lesson" DROP COLUMN "contentBody",
ADD COLUMN     "estimatedMinutes" INTEGER,
ADD COLUMN     "kind" "LessonKind" NOT NULL DEFAULT 'STANDALONE',
ADD COLUMN     "learningGoals" TEXT[],
ADD COLUMN     "parentId" TEXT;

-- CreateIndex
CREATE INDEX "Lesson_parentId_idx" ON "Lesson"("parentId");

-- CreateIndex
CREATE UNIQUE INDEX "Lesson_moduleId_parentId_order_key" ON "Lesson"("moduleId", "parentId", "order");

-- AddForeignKey
ALTER TABLE "Lesson" ADD CONSTRAINT "Lesson_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "Lesson"("id") ON DELETE SET NULL ON UPDATE CASCADE;
