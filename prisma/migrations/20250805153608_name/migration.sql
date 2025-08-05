-- DropForeignKey
ALTER TABLE "file" DROP CONSTRAINT "file_post_id_fkey";

-- AddForeignKey
ALTER TABLE "file" ADD CONSTRAINT "file_post_id_fkey" FOREIGN KEY ("post_id") REFERENCES "post"("id") ON DELETE CASCADE ON UPDATE CASCADE;
