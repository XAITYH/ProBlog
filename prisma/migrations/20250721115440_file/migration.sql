/*
  Warnings:

  - You are about to drop the `File` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "File" DROP CONSTRAINT "File_postId_fkey";

-- DropTable
DROP TABLE "File";

-- CreateTable
CREATE TABLE "file" (
    "id" SERIAL NOT NULL,
    "url" TEXT NOT NULL,
    "postId" INTEGER NOT NULL,

    CONSTRAINT "file_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "file" ADD CONSTRAINT "file_postId_fkey" FOREIGN KEY ("postId") REFERENCES "post"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
