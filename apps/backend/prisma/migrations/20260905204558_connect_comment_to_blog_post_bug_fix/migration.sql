/*
  Warnings:

  - Added the required column `blogId` to the `Comment` table without a default value. This is not possible if the table is not empty.
  - Added the required column `content` to the `Comment` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "BlogPost" ALTER COLUMN "published" SET DEFAULT false;

-- AlterTable
ALTER TABLE "Comment" ADD COLUMN     "blogId" UUID NOT NULL,
ADD COLUMN     "content" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "Comment" ADD CONSTRAINT "Comment_blogId_fkey" FOREIGN KEY ("blogId") REFERENCES "BlogPost"("id") ON DELETE CASCADE ON UPDATE CASCADE;
