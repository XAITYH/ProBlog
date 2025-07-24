/*
  Warnings:

  - You are about to drop the `Collection` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Like` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Collection" DROP CONSTRAINT "Collection_post_id_fkey";

-- DropForeignKey
ALTER TABLE "Collection" DROP CONSTRAINT "Collection_user_id_fkey";

-- DropForeignKey
ALTER TABLE "Like" DROP CONSTRAINT "Like_post_id_fkey";

-- DropForeignKey
ALTER TABLE "Like" DROP CONSTRAINT "Like_user_id_fkey";

-- DropTable
DROP TABLE "Collection";

-- DropTable
DROP TABLE "Like";

-- CreateTable
CREATE TABLE "like" (
    "user_id" TEXT NOT NULL,
    "post_id" INTEGER NOT NULL,
    "is_public" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "like_pkey" PRIMARY KEY ("user_id","post_id")
);

-- CreateTable
CREATE TABLE "collection" (
    "user_id" TEXT NOT NULL,
    "post_id" INTEGER NOT NULL,
    "is_public" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "collection_pkey" PRIMARY KEY ("user_id","post_id")
);

-- AddForeignKey
ALTER TABLE "like" ADD CONSTRAINT "like_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "like" ADD CONSTRAINT "like_post_id_fkey" FOREIGN KEY ("post_id") REFERENCES "post"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "collection" ADD CONSTRAINT "collection_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "collection" ADD CONSTRAINT "collection_post_id_fkey" FOREIGN KEY ("post_id") REFERENCES "post"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
