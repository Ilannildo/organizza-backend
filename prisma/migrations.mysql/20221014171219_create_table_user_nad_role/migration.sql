-- CreateTable
CREATE TABLE `users` (
    `uid` VARCHAR(191) NOT NULL,
    `name` VARCHAR(150) NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `gender` VARCHAR(15) NOT NULL,
    `phone` VARCHAR(32) NOT NULL,
    `password` VARCHAR(191) NOT NULL,
    `photo_url` VARCHAR(191) NOT NULL,
    `name_badge` VARCHAR(150) NOT NULL,
    `status` BOOLEAN NOT NULL DEFAULT false,
    `role_id` VARCHAR(191) NOT NULL,
    `email_verificated_at` DATETIME(3) NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,
    `deleted_at` DATETIME(3) NULL,

    UNIQUE INDEX `email`(`email`),
    PRIMARY KEY (`uid`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Role` (
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
ALTER TABLE `users` ADD CONSTRAINT `users_role_id_fkey` FOREIGN KEY (`role_id`) REFERENCES `Role`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
