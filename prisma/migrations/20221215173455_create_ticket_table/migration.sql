-- CreateTable
CREATE TABLE "tickets" (
    "id" TEXT NOT NULL,
    "category_title" TEXT NOT NULL,
    "include_fee" BOOLEAN NOT NULL,
    "event_id" TEXT NOT NULL,
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

    CONSTRAINT "tickets_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ticket_price_types" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "quote_id" TEXT NOT NULL,
    "is_free" BOOLEAN NOT NULL,
    "ticket_price_type_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ticket_price_types_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "quotes" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "percentage" DOUBLE PRECISION NOT NULL,
    "min_value" DOUBLE PRECISION NOT NULL,
    "min_base_value" DOUBLE PRECISION NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "quotes_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "tickets" ADD CONSTRAINT "tickets_event_id_fkey" FOREIGN KEY ("event_id") REFERENCES "events"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ticket_price_types" ADD CONSTRAINT "ticket_price_types_quote_id_fkey" FOREIGN KEY ("quote_id") REFERENCES "quotes"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
