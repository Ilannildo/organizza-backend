-- AlterTable
ALTER TABLE "roles" ADD COLUMN     "delete_service_order" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "edit_service_order" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "register_service_order" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "view_service_order" BOOLEAN NOT NULL DEFAULT false;
