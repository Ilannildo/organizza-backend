/*
  Warnings:

  - You are about to drop the `Role` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `users` DROP FOREIGN KEY `users_role_id_fkey`;

-- DropTable
DROP TABLE `Role`;

-- CreateTable
CREATE TABLE `roles` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(150) NOT NULL,
    `register_user` BOOLEAN NOT NULL DEFAULT false,
    `delete_user` BOOLEAN NOT NULL DEFAULT false,
    `edit_user` BOOLEAN NOT NULL DEFAULT false,
    `view_user` BOOLEAN NOT NULL DEFAULT false,
    `register_event` BOOLEAN NOT NULL DEFAULT false,
    `delete_event` BOOLEAN NOT NULL DEFAULT false,
    `edit_event` BOOLEAN NOT NULL DEFAULT false,
    `view_event` BOOLEAN NOT NULL DEFAULT false,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `users` ADD CONSTRAINT `users_role_id_fkey` FOREIGN KEY (`role_id`) REFERENCES `roles`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
