-- CreateTable
CREATE TABLE "used_licenses" (
    "id" TEXT NOT NULL,
    "licenseNumber" TEXT NOT NULL,
    "usedById" TEXT,
    "usedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "used_licenses_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "used_licenses_licenseNumber_key" ON "used_licenses"("licenseNumber");

-- CreateIndex
CREATE UNIQUE INDEX "used_licenses_usedById_key" ON "used_licenses"("usedById");
