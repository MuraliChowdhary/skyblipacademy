/*
  Warnings:

  - You are about to drop the `Certificate` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Coupon` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `CourseTag` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Tag` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Wishlist` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Certificate" DROP CONSTRAINT "Certificate_courseId_fkey";

-- DropForeignKey
ALTER TABLE "Certificate" DROP CONSTRAINT "Certificate_studentId_fkey";

-- DropForeignKey
ALTER TABLE "CourseTag" DROP CONSTRAINT "CourseTag_courseId_fkey";

-- DropForeignKey
ALTER TABLE "CourseTag" DROP CONSTRAINT "CourseTag_tagId_fkey";

-- DropForeignKey
ALTER TABLE "Wishlist" DROP CONSTRAINT "Wishlist_courseId_fkey";

-- DropForeignKey
ALTER TABLE "Wishlist" DROP CONSTRAINT "Wishlist_studentId_fkey";

-- DropTable
DROP TABLE "Certificate";

-- DropTable
DROP TABLE "Coupon";

-- DropTable
DROP TABLE "CourseTag";

-- DropTable
DROP TABLE "Tag";

-- DropTable
DROP TABLE "Wishlist";

-- DropEnum
DROP TYPE "DiscountType";
