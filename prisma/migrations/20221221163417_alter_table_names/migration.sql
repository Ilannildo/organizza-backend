/*
  Warnings:

  - You are about to drop the `SessionTicketServiceOrder` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `TicketServiceOrder` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `email_token` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `payment_method` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `ticket_service_order` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "SessionTicketServiceOrder" DROP CONSTRAINT "SessionTicketServiceOrder_service_order_id_fkey";

-- DropForeignKey
ALTER TABLE "SessionTicketServiceOrder" DROP CONSTRAINT "SessionTicketServiceOrder_session_ticket_id_fkey";

-- DropForeignKey
ALTER TABLE "TicketServiceOrder" DROP CONSTRAINT "TicketServiceOrder_service_order_id_fkey";

-- DropForeignKey
ALTER TABLE "TicketServiceOrder" DROP CONSTRAINT "TicketServiceOrder_ticket_id_fkey";

-- DropForeignKey
ALTER TABLE "email_token" DROP CONSTRAINT "email_token_user_id_fkey";

-- DropForeignKey
ALTER TABLE "session_subscriptions" DROP CONSTRAINT "session_subscriptions_session_ticket_service_order_id_fkey";

-- DropForeignKey
ALTER TABLE "subscriptions" DROP CONSTRAINT "subscriptions_ticket_service_order_id_fkey";

-- DropForeignKey
ALTER TABLE "transactions" DROP CONSTRAINT "transactions_payment_method_id_fkey";

-- DropForeignKey
ALTER TABLE "transactions" DROP CONSTRAINT "transactions_service_order_id_fkey";

-- DropTable
DROP TABLE "SessionTicketServiceOrder";

-- DropTable
DROP TABLE "TicketServiceOrder";

-- DropTable
DROP TABLE "email_token";

-- DropTable
DROP TABLE "payment_method";

-- DropTable
DROP TABLE "ticket_service_order";

-- CreateTable
CREATE TABLE "email_tokens" (
    "id" TEXT NOT NULL,
    "expires_in" INTEGER NOT NULL,
    "user_id" TEXT NOT NULL,
    "email_sent" BOOLEAN NOT NULL DEFAULT false,
    "email_sent_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "email_tokens_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "service_orders" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "amount_total" DOUBLE PRECISION NOT NULL,
    "status" "ServiceOrderStatus" NOT NULL,
    "reason_canceled" TEXT,
    "paid_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "service_orders_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ticket_service_orders" (
    "id" TEXT NOT NULL,
    "service_order_id" TEXT NOT NULL,
    "ticket_id" TEXT NOT NULL,

    CONSTRAINT "ticket_service_orders_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "session_ticket_service_orders" (
    "id" TEXT NOT NULL,
    "service_order_id" TEXT NOT NULL,
    "session_ticket_id" TEXT NOT NULL,

    CONSTRAINT "session_ticket_service_orders_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "payment_methods" (
    "id" TEXT NOT NULL,
    "payment_form" "PaymentMethodType" NOT NULL,
    "name" TEXT NOT NULL,
    "fee" DOUBLE PRECISION NOT NULL,
    "installments" INTEGER NOT NULL,
    "status" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "payment_methods_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "email_tokens_user_id_key" ON "email_tokens"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "ticket_service_orders_service_order_id_key" ON "ticket_service_orders"("service_order_id");

-- CreateIndex
CREATE UNIQUE INDEX "session_ticket_service_orders_service_order_id_key" ON "session_ticket_service_orders"("service_order_id");

-- AddForeignKey
ALTER TABLE "email_tokens" ADD CONSTRAINT "email_tokens_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("uid") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ticket_service_orders" ADD CONSTRAINT "ticket_service_orders_service_order_id_fkey" FOREIGN KEY ("service_order_id") REFERENCES "service_orders"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ticket_service_orders" ADD CONSTRAINT "ticket_service_orders_ticket_id_fkey" FOREIGN KEY ("ticket_id") REFERENCES "tickets"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "session_ticket_service_orders" ADD CONSTRAINT "session_ticket_service_orders_service_order_id_fkey" FOREIGN KEY ("service_order_id") REFERENCES "service_orders"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "session_ticket_service_orders" ADD CONSTRAINT "session_ticket_service_orders_session_ticket_id_fkey" FOREIGN KEY ("session_ticket_id") REFERENCES "session_tickets"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "subscriptions" ADD CONSTRAINT "subscriptions_ticket_service_order_id_fkey" FOREIGN KEY ("ticket_service_order_id") REFERENCES "ticket_service_orders"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "session_subscriptions" ADD CONSTRAINT "session_subscriptions_session_ticket_service_order_id_fkey" FOREIGN KEY ("session_ticket_service_order_id") REFERENCES "session_ticket_service_orders"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "transactions" ADD CONSTRAINT "transactions_payment_method_id_fkey" FOREIGN KEY ("payment_method_id") REFERENCES "payment_methods"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "transactions" ADD CONSTRAINT "transactions_service_order_id_fkey" FOREIGN KEY ("service_order_id") REFERENCES "service_orders"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
