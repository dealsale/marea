-- DropForeignKey
ALTER TABLE "Booking" DROP CONSTRAINT "Booking_tourId_fkey";

-- AlterTable
ALTER TABLE "Booking" DROP COLUMN "tourId",
ADD COLUMN     "activityId" TEXT,
ADD COLUMN     "endDate" TEXT,
ADD COLUMN     "extras" TEXT NOT NULL DEFAULT '',
ADD COLUMN     "nights" INTEGER NOT NULL DEFAULT 1,
ADD COLUMN     "packageId" TEXT,
ADD COLUMN     "total" INTEGER NOT NULL DEFAULT 0,
ALTER COLUMN "timeSlot" SET DEFAULT '';

-- DropTable
DROP TABLE "Tour";

-- CreateTable
CREATE TABLE "Line" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "nameEs" TEXT NOT NULL,
    "nameEn" TEXT NOT NULL,
    "taglineEs" TEXT NOT NULL DEFAULT '',
    "taglineEn" TEXT NOT NULL DEFAULT '',
    "emoji" TEXT NOT NULL DEFAULT '🌊',
    "color" TEXT NOT NULL DEFAULT '#7c3aed',
    "image" TEXT NOT NULL DEFAULT '',
    "order" INTEGER NOT NULL DEFAULT 0,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Line_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Package" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "lineId" TEXT NOT NULL,
    "type" TEXT NOT NULL DEFAULT 'tour',
    "titleEs" TEXT NOT NULL,
    "titleEn" TEXT NOT NULL,
    "summaryEs" TEXT NOT NULL DEFAULT '',
    "summaryEn" TEXT NOT NULL DEFAULT '',
    "descriptionEs" TEXT NOT NULL DEFAULT '',
    "descriptionEn" TEXT NOT NULL DEFAULT '',
    "price" INTEGER NOT NULL DEFAULT 0,
    "currency" TEXT NOT NULL DEFAULT 'COP',
    "durationMin" INTEGER NOT NULL DEFAULT 180,
    "meetingPoint" TEXT NOT NULL DEFAULT '',
    "image" TEXT NOT NULL DEFAULT '',
    "availableDays" TEXT NOT NULL DEFAULT '0,1,2,3,4,5,6',
    "blockedDates" TEXT NOT NULL DEFAULT '',
    "maxPeople" INTEGER NOT NULL DEFAULT 15,
    "featured" BOOLEAN NOT NULL DEFAULT false,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "order" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Package_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Activity" (
    "id" TEXT NOT NULL,
    "packageId" TEXT NOT NULL,
    "nameEs" TEXT NOT NULL,
    "nameEn" TEXT NOT NULL,
    "descEs" TEXT NOT NULL DEFAULT '',
    "descEn" TEXT NOT NULL DEFAULT '',
    "price" INTEGER NOT NULL DEFAULT 0,
    "optional" BOOLEAN NOT NULL DEFAULT false,
    "bookableAlone" BOOLEAN NOT NULL DEFAULT false,
    "durationMin" INTEGER NOT NULL DEFAULT 60,
    "order" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "Activity_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Line_slug_key" ON "Line"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "Package_slug_key" ON "Package"("slug");

-- AddForeignKey
ALTER TABLE "Package" ADD CONSTRAINT "Package_lineId_fkey" FOREIGN KEY ("lineId") REFERENCES "Line"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Activity" ADD CONSTRAINT "Activity_packageId_fkey" FOREIGN KEY ("packageId") REFERENCES "Package"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Booking" ADD CONSTRAINT "Booking_packageId_fkey" FOREIGN KEY ("packageId") REFERENCES "Package"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Booking" ADD CONSTRAINT "Booking_activityId_fkey" FOREIGN KEY ("activityId") REFERENCES "Activity"("id") ON DELETE SET NULL ON UPDATE CASCADE;

