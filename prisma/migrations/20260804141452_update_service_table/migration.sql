/*
  Warnings:

  - You are about to drop the column `isAvailable` on the `services` table. All the data in the column will be lost.
  - You are about to alter the column `title` on the `services` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(150)`.

*/
-- AlterTable
ALTER TABLE "services" DROP COLUMN "isAvailable",
ADD COLUMN     "isActive" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "location" VARCHAR(150),
ALTER COLUMN "title" SET DATA TYPE VARCHAR(150),
ALTER COLUMN "description" DROP NOT NULL;
