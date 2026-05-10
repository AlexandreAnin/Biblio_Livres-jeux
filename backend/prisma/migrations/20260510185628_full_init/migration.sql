/*
  Warnings:

  - You are about to drop the `User` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "User";

-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "books" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "author" TEXT NOT NULL,
    "series" TEXT,
    "seriesIndex" INTEGER,
    "coverImage" TEXT,
    "description" TEXT,
    "isPublished" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "books_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "passages" (
    "id" TEXT NOT NULL,
    "bookId" TEXT NOT NULL,
    "number" INTEGER NOT NULL,
    "title" TEXT,
    "content" TEXT NOT NULL,
    "type" TEXT NOT NULL DEFAULT 'normal',
    "enemyName" TEXT,
    "enemySkill" INTEGER,
    "enemyEndurance" INTEGER,
    "isPsychic" BOOLEAN NOT NULL DEFAULT false,
    "canFlee" BOOLEAN NOT NULL DEFAULT true,
    "conditions" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "passages_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "choices" (
    "id" TEXT NOT NULL,
    "passageId" TEXT NOT NULL,
    "text" TEXT NOT NULL,
    "targetPassageNumber" INTEGER NOT NULL,
    "conditions" JSONB,

    CONSTRAINT "choices_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "characters" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "bookId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "habilete" INTEGER NOT NULL DEFAULT 10,
    "habileteMax" INTEGER NOT NULL DEFAULT 10,
    "endurance" INTEGER NOT NULL DEFAULT 20,
    "enduranceMax" INTEGER NOT NULL DEFAULT 20,
    "chance" INTEGER NOT NULL DEFAULT 10,
    "chanceMax" INTEGER NOT NULL DEFAULT 10,
    "gold" INTEGER NOT NULL DEFAULT 0,
    "disciplines" TEXT[],
    "masteredWeapon" TEXT,
    "backpack" JSONB NOT NULL DEFAULT '[]',
    "weapons" JSONB NOT NULL DEFAULT '[]',
    "specialItems" JSONB NOT NULL DEFAULT '[]',
    "pickedItems" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "weaponInHand" TEXT,
    "currentPassageNumber" INTEGER NOT NULL DEFAULT 1,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "characters_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "save_games" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "characterId" TEXT NOT NULL,
    "currentPassage" INTEGER NOT NULL,
    "characterData" JSONB NOT NULL,
    "gameState" JSONB NOT NULL DEFAULT '{}',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "save_games_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "users_username_key" ON "users"("username");

-- CreateIndex
CREATE UNIQUE INDEX "books_slug_key" ON "books"("slug");

-- CreateIndex
CREATE INDEX "passages_bookId_idx" ON "passages"("bookId");

-- CreateIndex
CREATE UNIQUE INDEX "passages_bookId_number_key" ON "passages"("bookId", "number");

-- CreateIndex
CREATE INDEX "characters_userId_idx" ON "characters"("userId");

-- CreateIndex
CREATE INDEX "characters_bookId_idx" ON "characters"("bookId");

-- CreateIndex
CREATE INDEX "save_games_userId_idx" ON "save_games"("userId");

-- AddForeignKey
ALTER TABLE "passages" ADD CONSTRAINT "passages_bookId_fkey" FOREIGN KEY ("bookId") REFERENCES "books"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "choices" ADD CONSTRAINT "choices_passageId_fkey" FOREIGN KEY ("passageId") REFERENCES "passages"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "characters" ADD CONSTRAINT "characters_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "characters" ADD CONSTRAINT "characters_bookId_fkey" FOREIGN KEY ("bookId") REFERENCES "books"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "save_games" ADD CONSTRAINT "save_games_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "save_games" ADD CONSTRAINT "save_games_characterId_fkey" FOREIGN KEY ("characterId") REFERENCES "characters"("id") ON DELETE CASCADE ON UPDATE CASCADE;
