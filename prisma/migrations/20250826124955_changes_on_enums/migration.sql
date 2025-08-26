/*
  Warnings:

  - The values [ONLINE,IN_PERSON,PHONE] on the enum `ReservationOrigin` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "public"."ReservationOrigin_new" AS ENUM ('SYSTEM', 'WHATSAPP');
ALTER TABLE "public"."Reservation" ALTER COLUMN "origin" TYPE "public"."ReservationOrigin_new" USING ("origin"::text::"public"."ReservationOrigin_new");
ALTER TYPE "public"."ReservationOrigin" RENAME TO "ReservationOrigin_old";
ALTER TYPE "public"."ReservationOrigin_new" RENAME TO "ReservationOrigin";
DROP TYPE "public"."ReservationOrigin_old";
COMMIT;

-- AlterEnum
ALTER TYPE "public"."ReservationStatus" ADD VALUE 'COMPLETED';
