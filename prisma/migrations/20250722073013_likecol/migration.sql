/*
  Warnings:

  - You are about to drop the column `collections` on the `post` table. All the data in the column will be lost.
  - You are about to drop the column `likes` on the `post` table. All the data in the column will be lost.
  - You are about to drop the `_Collections` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_LikedPosts` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `account` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `session` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `verification_token` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "_Collections" DROP CONSTRAINT "_Collections_A_fkey";

-- DropForeignKey
ALTER TABLE "_Collections" DROP CONSTRAINT "_Collections_B_fkey";

-- DropForeignKey
ALTER TABLE "_LikedPosts" DROP CONSTRAINT "_LikedPosts_A_fkey";

-- DropForeignKey
ALTER TABLE "_LikedPosts" DROP CONSTRAINT "_LikedPosts_B_fkey";

-- DropForeignKey
ALTER TABLE "account" DROP CONSTRAINT "account_userId_fkey";

-- DropForeignKey
ALTER TABLE "post" DROP CONSTRAINT "post_author_id_fkey";

-- DropForeignKey
ALTER TABLE "session" DROP CONSTRAINT "session_userId_fkey";

-- AlterTable
ALTER TABLE "post" DROP COLUMN "collections",
DROP COLUMN "likes",
ADD COLUMN     "extra" TEXT;

-- DropTable
DROP TABLE "_Collections";

-- DropTable
DROP TABLE "_LikedPosts";

-- DropTable
DROP TABLE "account";

-- DropTable
DROP TABLE "session";

-- DropTable
DROP TABLE "verification_token";

-- CreateTable
CREATE TABLE "Account" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "provider" TEXT NOT NULL,
    "providerAccountId" TEXT NOT NULL,
    "refresh_token" TEXT,
    "access_token" TEXT,
    "expires_at" INTEGER,
    "token_type" TEXT,
    "scope" TEXT,
    "id_token" TEXT,
    "session_state" TEXT,

    CONSTRAINT "Account_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Session" (
    "id" TEXT NOT NULL,
    "sessionToken" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "expires" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Session_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "VerificationToken" (
    "identifier" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "expires" TIMESTAMP(3) NOT NULL
);

-- CreateTable
CREATE TABLE "LikedPost" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "postId" INTEGER NOT NULL,
    "isVisible" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "LikedPost_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Collection" (
    "id" TEXT NOT NULL,
    "name" TEXT,
    "user_id" TEXT NOT NULL,
    "postId" INTEGER NOT NULL,
    "isVisible" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "Collection_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Account_provider_providerAccountId_key" ON "Account"("provider", "providerAccountId");

-- CreateIndex
CREATE UNIQUE INDEX "Session_sessionToken_key" ON "Session"("sessionToken");

-- CreateIndex
CREATE UNIQUE INDEX "VerificationToken_token_key" ON "VerificationToken"("token");

-- CreateIndex
CREATE UNIQUE INDEX "VerificationToken_identifier_token_key" ON "VerificationToken"("identifier", "token");

-- CreateIndex
CREATE UNIQUE INDEX "LikedPost_user_id_postId_key" ON "LikedPost"("user_id", "postId");

-- CreateIndex
CREATE UNIQUE INDEX "Collection_user_id_postId_key" ON "Collection"("user_id", "postId");

-- AddForeignKey
ALTER TABLE "Account" ADD CONSTRAINT "Account_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Session" ADD CONSTRAINT "Session_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "post" ADD CONSTRAINT "post_author_id_fkey" FOREIGN KEY ("author_id") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LikedPost" ADD CONSTRAINT "LikedPost_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LikedPost" ADD CONSTRAINT "LikedPost_postId_fkey" FOREIGN KEY ("postId") REFERENCES "post"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Collection" ADD CONSTRAINT "Collection_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Collection" ADD CONSTRAINT "Collection_postId_fkey" FOREIGN KEY ("postId") REFERENCES "post"("id") ON DELETE CASCADE ON UPDATE CASCADE;
