/*
  Warnings:

  - You are about to drop the column `isVisible` on the `Collection` table. All the data in the column will be lost.
  - You are about to drop the column `postId` on the `Collection` table. All the data in the column will be lost.
  - You are about to drop the column `isVisible` on the `LikedPost` table. All the data in the column will be lost.
  - You are about to drop the column `postId` on the `LikedPost` table. All the data in the column will be lost.
  - You are about to drop the column `postId` on the `file` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[user_id,post_id]` on the table `Collection` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[user_id,post_id]` on the table `LikedPost` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `post_id` to the `Collection` table without a default value. This is not possible if the table is not empty.
  - Added the required column `post_id` to the `LikedPost` table without a default value. This is not possible if the table is not empty.
  - Added the required column `post_id` to the `file` table without a default value. This is not possible if the table is not empty.
  - Made the column `email` on table `user` required. This step will fail if there are existing NULL values in that column.
  - Made the column `name` on table `user` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "Collection" DROP CONSTRAINT "Collection_postId_fkey";

-- DropForeignKey
ALTER TABLE "LikedPost" DROP CONSTRAINT "LikedPost_postId_fkey";

-- DropForeignKey
ALTER TABLE "file" DROP CONSTRAINT "file_postId_fkey";

-- DropIndex
DROP INDEX "Collection_user_id_postId_key";

-- DropIndex
DROP INDEX "LikedPost_user_id_postId_key";

-- AlterTable
ALTER TABLE "Collection" DROP COLUMN "isVisible",
DROP COLUMN "postId",
ADD COLUMN     "is_visible" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "post_id" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "LikedPost" DROP COLUMN "isVisible",
DROP COLUMN "postId",
ADD COLUMN     "is_visible" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "post_id" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "file" DROP COLUMN "postId",
ADD COLUMN     "post_id" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "user" ALTER COLUMN "email" SET NOT NULL,
ALTER COLUMN "name" SET NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Collection_user_id_post_id_key" ON "Collection"("user_id", "post_id");

-- CreateIndex
CREATE UNIQUE INDEX "LikedPost_user_id_post_id_key" ON "LikedPost"("user_id", "post_id");

-- AddForeignKey
ALTER TABLE "file" ADD CONSTRAINT "file_post_id_fkey" FOREIGN KEY ("post_id") REFERENCES "post"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LikedPost" ADD CONSTRAINT "LikedPost_post_id_fkey" FOREIGN KEY ("post_id") REFERENCES "post"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Collection" ADD CONSTRAINT "Collection_post_id_fkey" FOREIGN KEY ("post_id") REFERENCES "post"("id") ON DELETE CASCADE ON UPDATE CASCADE;
