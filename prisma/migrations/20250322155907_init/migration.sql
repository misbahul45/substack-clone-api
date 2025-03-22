/*
  Warnings:

  - You are about to drop the column `followingId` on the `followers` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[followerId,userId]` on the table `followers` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `userId` to the `followers` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `followers` DROP FOREIGN KEY `followers_followerId_fkey`;

-- DropForeignKey
ALTER TABLE `followers` DROP FOREIGN KEY `followers_followingId_fkey`;

-- DropIndex
DROP INDEX `followers_followerId_followingId_key` ON `followers`;

-- DropIndex
DROP INDEX `followers_followingId_idx` ON `followers`;

-- AlterTable
ALTER TABLE `followers` DROP COLUMN `followingId`,
    ADD COLUMN `userId` VARCHAR(191) NOT NULL;

-- CreateIndex
CREATE INDEX `followers_userId_idx` ON `followers`(`userId`);

-- CreateIndex
CREATE UNIQUE INDEX `followers_followerId_userId_key` ON `followers`(`followerId`, `userId`);

-- AddForeignKey
ALTER TABLE `followers` ADD CONSTRAINT `followers_followerId_fkey` FOREIGN KEY (`followerId`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `followers` ADD CONSTRAINT `followers_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
