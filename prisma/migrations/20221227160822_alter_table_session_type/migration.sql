/*
  Warnings:

  - Added the required column `expires_in` to the `service_orders` table without a default value. This is not possible if the table is not empty.
  - Added the required column `payment_method_id` to the `service_orders` table without a default value. This is not possible if the table is not empty.
  - Added the required column `type` to the `service_orders` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "ServiceOrderType" AS ENUM ('event', 'session');

-- AlterTable
ALTER TABLE "roles" ADD COLUMN     "delete_session" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "delete_ticket" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "edit_session" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "edit_ticket" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "register_session" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "register_ticket" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "view_session" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "view_ticket" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "service_orders" ADD COLUMN     "expires_in" INTEGER NOT NULL,
ADD COLUMN     "payment_method_id" TEXT NOT NULL,
ADD COLUMN     "type" "ServiceOrderType" NOT NULL,
ALTER COLUMN "status" SET DEFAULT 'open';

-- AlterTable
ALTER TABLE "session_types" ADD COLUMN     "is_active" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "is_menu" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "transactions" ALTER COLUMN "transaction_id" DROP NOT NULL;

-- DropEnum
DROP TYPE "CartType";

-- AddForeignKey
ALTER TABLE "service_orders" ADD CONSTRAINT "service_orders_payment_method_id_fkey" FOREIGN KEY ("payment_method_id") REFERENCES "payment_methods"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "service_orders" ADD CONSTRAINT "service_orders_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("uid") ON DELETE RESTRICT ON UPDATE CASCADE;
