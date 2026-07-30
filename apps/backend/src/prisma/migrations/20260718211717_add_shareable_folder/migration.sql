-- CreateTable
CREATE TABLE "ShareableFolder" (
    "id" SERIAL NOT NULL,
    "token" TEXT NOT NULL,
    "folderId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "expiresAt" TIMESTAMP(3) NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "ShareableFolder_token_key" ON "ShareableFolder"("token");

-- AddForeignKey
ALTER TABLE "ShareableFolder" ADD CONSTRAINT "ShareableFolder_folderId_fkey" FOREIGN KEY ("folderId") REFERENCES "Folder"("id") ON DELETE CASCADE ON UPDATE CASCADE;
