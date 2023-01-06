-- CreateEnum
CREATE TYPE "CartType" AS ENUM ('event', 'session');

-- CreateEnum
CREATE TYPE "SubscriptionStatus" AS ENUM ('pending', 'processing', 'completed', 'refused');

-- CreateEnum
CREATE TYPE "ServiceOrderStatus" AS ENUM ('open', 'processing', 'settled', 'closed', 'canceled');

-- CreateEnum
CREATE TYPE "PaymentMethodType" AS ENUM ('credit', 'debit', 'check', 'bank_slip', 'cash', 'deposit', 'wallet', 'transfer');

-- CreateEnum
CREATE TYPE "TransactionStatus" AS ENUM ('started', 'processing', 'pending', 'approved', 'refused', 'refunded', 'chargeback', 'error');

-- CreateEnum
CREATE TYPE "TransactionOperation" AS ENUM ('withdraw', 'order');

-- CreateEnum
CREATE TYPE "TransactionType" AS ENUM ('input', 'output');

-- CreateTable
CREATE TABLE "session_tickets" (
    "id" TEXT NOT NULL,
    "category_title" TEXT NOT NULL,
    "include_fee" BOOLEAN NOT NULL,
    "session_id" TEXT NOT NULL,
    "ticket_price_type_id" TEXT NOT NULL,
    "participant_limit" INTEGER NOT NULL,
    "description" TEXT,
    "value" DOUBLE PRECISION NOT NULL,
    "sold" INTEGER,
    "start_date" TIMESTAMP(3) NOT NULL,
    "start_time" TIMESTAMP(3) NOT NULL,
    "due_date" TIMESTAMP(3) NOT NULL,
    "due_time" TIMESTAMP(3) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "session_tickets_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ticket_service_order" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "amount_total" DOUBLE PRECISION NOT NULL,
    "status" "ServiceOrderStatus" NOT NULL,
    "reason_canceled" TEXT,
    "paid_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ticket_service_order_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TicketServiceOrder" (
    "id" TEXT NOT NULL,
    "service_order_id" TEXT NOT NULL,
    "ticket_id" TEXT NOT NULL,

    CONSTRAINT "TicketServiceOrder_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SessionTicketServiceOrder" (
    "id" TEXT NOT NULL,
    "service_order_id" TEXT NOT NULL,
    "session_ticket_id" TEXT NOT NULL,

    CONSTRAINT "SessionTicketServiceOrder_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "payment_method" (
    "id" TEXT NOT NULL,
    "payment_form" "PaymentMethodType" NOT NULL,
    "name" TEXT NOT NULL,
    "fee" DOUBLE PRECISION NOT NULL,
    "installments" INTEGER NOT NULL,
    "status" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "payment_method_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "subscriptions" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "event_id" TEXT NOT NULL,
    "code_ref" TEXT NOT NULL,
    "ticket_service_order_id" TEXT NOT NULL,
    "status" "SubscriptionStatus" NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "subscriptions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "session_subscriptions" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "session_id" TEXT NOT NULL,
    "code_ref" TEXT NOT NULL,
    "session_ticket_service_order_id" TEXT NOT NULL,
    "status" "SubscriptionStatus" NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "session_subscriptions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "transactions" (
    "id" TEXT NOT NULL,
    "payment_method_id" TEXT NOT NULL,
    "service_order_id" TEXT NOT NULL,
    "transaction_id" TEXT NOT NULL,
    "processed_response" TEXT,
    "customer_email" TEXT NOT NULL,
    "customer_name" TEXT NOT NULL,
    "customer_phone" TEXT NOT NULL,
    "customer_document" TEXT NOT NULL,
    "billing_address" TEXT,
    "billing_number" TEXT,
    "billing_neighborhood" TEXT,
    "billing_city" TEXT,
    "billing_state" TEXT,
    "billing_zipcode" TEXT,
    "operation" "TransactionOperation" NOT NULL,
    "status" "TransactionStatus" NOT NULL,
    "type" "TransactionType" NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "transactions_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "TicketServiceOrder_service_order_id_key" ON "TicketServiceOrder"("service_order_id");

-- CreateIndex
CREATE UNIQUE INDEX "SessionTicketServiceOrder_service_order_id_key" ON "SessionTicketServiceOrder"("service_order_id");

-- CreateIndex
CREATE UNIQUE INDEX "subscriptions_ticket_service_order_id_key" ON "subscriptions"("ticket_service_order_id");

-- CreateIndex
CREATE UNIQUE INDEX "session_subscriptions_session_ticket_service_order_id_key" ON "session_subscriptions"("session_ticket_service_order_id");

-- AddForeignKey
ALTER TABLE "session_tickets" ADD CONSTRAINT "session_tickets_session_id_fkey" FOREIGN KEY ("session_id") REFERENCES "sessions"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "session_tickets" ADD CONSTRAINT "session_tickets_ticket_price_type_id_fkey" FOREIGN KEY ("ticket_price_type_id") REFERENCES "ticket_price_types"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TicketServiceOrder" ADD CONSTRAINT "TicketServiceOrder_service_order_id_fkey" FOREIGN KEY ("service_order_id") REFERENCES "ticket_service_order"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TicketServiceOrder" ADD CONSTRAINT "TicketServiceOrder_ticket_id_fkey" FOREIGN KEY ("ticket_id") REFERENCES "tickets"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SessionTicketServiceOrder" ADD CONSTRAINT "SessionTicketServiceOrder_service_order_id_fkey" FOREIGN KEY ("service_order_id") REFERENCES "ticket_service_order"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SessionTicketServiceOrder" ADD CONSTRAINT "SessionTicketServiceOrder_session_ticket_id_fkey" FOREIGN KEY ("session_ticket_id") REFERENCES "session_tickets"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "subscriptions" ADD CONSTRAINT "subscriptions_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("uid") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "subscriptions" ADD CONSTRAINT "subscriptions_event_id_fkey" FOREIGN KEY ("event_id") REFERENCES "events"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "subscriptions" ADD CONSTRAINT "subscriptions_ticket_service_order_id_fkey" FOREIGN KEY ("ticket_service_order_id") REFERENCES "TicketServiceOrder"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "session_subscriptions" ADD CONSTRAINT "session_subscriptions_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("uid") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "session_subscriptions" ADD CONSTRAINT "session_subscriptions_session_id_fkey" FOREIGN KEY ("session_id") REFERENCES "sessions"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "session_subscriptions" ADD CONSTRAINT "session_subscriptions_session_ticket_service_order_id_fkey" FOREIGN KEY ("session_ticket_service_order_id") REFERENCES "SessionTicketServiceOrder"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "transactions" ADD CONSTRAINT "transactions_payment_method_id_fkey" FOREIGN KEY ("payment_method_id") REFERENCES "payment_method"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "transactions" ADD CONSTRAINT "transactions_service_order_id_fkey" FOREIGN KEY ("service_order_id") REFERENCES "ticket_service_order"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
