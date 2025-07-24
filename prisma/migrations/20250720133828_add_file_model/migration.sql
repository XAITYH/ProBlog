/*
  Warnings:

  - You are about to drop the column `files` on the `post` table. All the data in the column will be lost.
  - You are about to drop the `collection` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `like` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "collection" DROP CONSTRAINT "collection_post_id_fkey";

-- DropForeignKey
ALTER TABLE "collection" DROP CONSTRAINT "collection_user_id_fkey";

-- DropForeignKey
ALTER TABLE "like" DROP CONSTRAINT "like_post_id_fkey";

-- DropForeignKey
ALTER TABLE "like" DROP CONSTRAINT "like_user_id_fkey";

-- AlterTable
ALTER TABLE "post" DROP COLUMN "files";

-- AlterTable
ALTER TABLE "user" ALTER COLUMN "password" DROP NOT NULL;

-- DropTable
DROP TABLE "collection";

-- DropTable
DROP TABLE "like";

-- CreateTable
CREATE TABLE "File" (
    "id" SERIAL NOT NULL,
    "url" TEXT NOT NULL,
    "postId" INTEGER NOT NULL,

    CONSTRAINT "File_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_LikedPosts" (
    "A" INTEGER NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_LikedPosts_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateTable
CREATE TABLE "_Collections" (
    "A" INTEGER NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_Collections_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE INDEX "_LikedPosts_B_index" ON "_LikedPosts"("B");

-- CreateIndex
CREATE INDEX "_Collections_B_index" ON "_Collections"("B");

-- AddForeignKey
ALTER TABLE "File" ADD CONSTRAINT "File_postId_fkey" FOREIGN KEY ("postId") REFERENCES "post"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_LikedPosts" ADD CONSTRAINT "_LikedPosts_A_fkey" FOREIGN KEY ("A") REFERENCES "post"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_LikedPosts" ADD CONSTRAINT "_LikedPosts_B_fkey" FOREIGN KEY ("B") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_Collections" ADD CONSTRAINT "_Collections_A_fkey" FOREIGN KEY ("A") REFERENCES "post"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_Collections" ADD CONSTRAINT "_Collections_B_fkey" FOREIGN KEY ("B") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;
