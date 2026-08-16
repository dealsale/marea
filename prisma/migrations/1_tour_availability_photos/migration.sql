-- Add per-tour availability (weekdays + blocked dates). image already exists.
ALTER TABLE "Tour" ADD COLUMN "availableDays" TEXT NOT NULL DEFAULT '0,1,2,3,4,5,6';
ALTER TABLE "Tour" ADD COLUMN "blockedDates" TEXT NOT NULL DEFAULT '';
