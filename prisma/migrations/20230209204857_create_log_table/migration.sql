-- CreateTable
CREATE TABLE "logs" (
    "id" TEXT NOT NULL,
    "request_method" TEXT NOT NULL,
    "request_url" TEXT NOT NULL,
    "request_headers" TEXT NOT NULL,
    "request_body" TEXT NOT NULL,
    "response_status" INTEGER NOT NULL,
    "response_headers" TEXT NOT NULL,
    "response_body" TEXT,
    "user_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "logs_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "logs" ADD CONSTRAINT "logs_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("uid") ON DELETE RESTRICT ON UPDATE CASCADE;
