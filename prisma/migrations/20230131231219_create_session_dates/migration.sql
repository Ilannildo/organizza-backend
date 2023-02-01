-- CreateEnum
CREATE TYPE "SessionDateType" AS ENUM ('start', 'end');

-- CreateTable
CREATE TABLE "SessionDates" (
    "id" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "type" "SessionDateType" NOT NULL,
    "session_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "SessionDates_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "SessionDates" ADD CONSTRAINT "SessionDates_session_id_fkey" FOREIGN KEY ("session_id") REFERENCES "sessions"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
