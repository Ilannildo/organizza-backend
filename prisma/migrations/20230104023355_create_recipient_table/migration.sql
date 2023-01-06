-- CreateEnum
CREATE TYPE "RecipientDocumentType" AS ENUM ('cpf', 'cnpj');

-- CreateEnum
CREATE TYPE "RecipientStatus" AS ENUM ('pending', 'refused', 'completed', 'canceled');

-- CreateTable
CREATE TABLE "recipients" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "external_recipient_id" TEXT NOT NULL,
    "document" TEXT NOT NULL,
    "document_type" "RecipientDocumentType" NOT NULL,
    "status" "RecipientStatus" NOT NULL,
    "account_registered_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "recipients_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "recipients_user_id_key" ON "recipients"("user_id");

-- AddForeignKey
ALTER TABLE "recipients" ADD CONSTRAINT "recipients_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("uid") ON DELETE RESTRICT ON UPDATE CASCADE;
