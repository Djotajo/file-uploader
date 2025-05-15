/*
  Warnings:

  - A unique constraint covering the columns `[title,parentId]` on the table `File` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `parentId` to the `File` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "File_title_key";

-- AlterTable
ALTER TABLE "File" ADD COLUMN     "parentId" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "File_title_parentId_key" ON "File"("title", "parentId");

-- AddForeignKey
ALTER TABLE "File" ADD CONSTRAINT "File_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "Folder"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
