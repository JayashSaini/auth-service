/*
  Warnings:

  - The values [DELETED] on the enum `Status` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the column `isLocked` on the `auth.User` table. All the data in the column will be lost.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "Status_new" AS ENUM ('ACTIVE', 'BANNED', 'LOCKED', 'PENDING', 'INACTIVE', 'SUSPENDED');
ALTER TABLE "auth.User" ALTER COLUMN "status" DROP DEFAULT;
ALTER TABLE "auth.User" ALTER COLUMN "status" TYPE "Status_new" USING ("status"::text::"Status_new");
ALTER TYPE "Status" RENAME TO "Status_old";
ALTER TYPE "Status_new" RENAME TO "Status";
DROP TYPE "Status_old";
ALTER TABLE "auth.User" ALTER COLUMN "status" SET DEFAULT 'ACTIVE';
COMMIT;

-- AlterTable
ALTER TABLE "auth.User" DROP COLUMN "isLocked";
