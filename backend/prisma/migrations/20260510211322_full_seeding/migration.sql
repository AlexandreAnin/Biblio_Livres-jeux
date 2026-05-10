/*
  Warnings:

  - You are about to drop the column `chance` on the `characters` table. All the data in the column will be lost.
  - You are about to drop the column `chanceMax` on the `characters` table. All the data in the column will be lost.
  - You are about to drop the column `habilete` on the `characters` table. All the data in the column will be lost.
  - You are about to drop the column `habileteMax` on the `characters` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "characters" DROP COLUMN "chance",
DROP COLUMN "chanceMax",
DROP COLUMN "habilete",
DROP COLUMN "habileteMax",
ADD COLUMN     "skill" INTEGER NOT NULL DEFAULT 10,
ADD COLUMN     "skillMax" INTEGER NOT NULL DEFAULT 10;
