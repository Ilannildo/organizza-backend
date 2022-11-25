-- AlterTable
ALTER TABLE "email_token" ADD COLUMN     "email_sent" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "email_sent_at" TIMESTAMP(3);
