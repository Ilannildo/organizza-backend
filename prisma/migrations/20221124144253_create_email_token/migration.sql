-- CreateTable
CREATE TABLE "email_token" (
    "id" TEXT NOT NULL,
    "expiresIn" INTEGER NOT NULL,
    "user_id" TEXT NOT NULL,

    CONSTRAINT "email_token_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "email_token_user_id_key" ON "email_token"("user_id");

-- AddForeignKey
ALTER TABLE "email_token" ADD CONSTRAINT "email_token_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("uid") ON DELETE RESTRICT ON UPDATE CASCADE;
