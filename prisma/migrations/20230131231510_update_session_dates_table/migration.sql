/*
  Warnings:

  - You are about to drop the `SessionDates` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "SessionDates" DROP CONSTRAINT "SessionDates_session_id_fkey";

-- DropTable
DROP TABLE "SessionDates";

-- CreateTable
CREATE TABLE "session_dates" (
    "id" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "type" "SessionDateType" NOT NULL,
    "position" INTEGER NOT NULL,
    "status" "SessionDateStatus" NOT NULL,
    "session_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "session_dates_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "session_dates" ADD CONSTRAINT "session_dates_session_id_fkey" FOREIGN KEY ("session_id") REFERENCES "sessions"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
