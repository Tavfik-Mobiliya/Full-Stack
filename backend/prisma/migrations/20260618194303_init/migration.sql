-- CreateTable
CREATE TABLE "Project" (
    "id" SERIAL NOT NULL,
    "slug" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "subCategory" TEXT,
    "roomType" TEXT,
    "year" INTEGER NOT NULL,
    "images" TEXT[],
    "specs" JSONB,
    "beforeImage" TEXT,
    "afterImage" TEXT,
    "price" DECIMAL(65,30),
    "budget" TEXT,
    "featured" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "titleEn" TEXT NOT NULL,
    "titleAr" TEXT NOT NULL,
    "titleTr" TEXT NOT NULL,
    "descriptionEn" TEXT NOT NULL,
    "descriptionAr" TEXT NOT NULL,
    "descriptionTr" TEXT NOT NULL,
    "locationEn" TEXT NOT NULL,
    "locationAr" TEXT NOT NULL,
    "locationTr" TEXT NOT NULL,
    "materialEn" TEXT,
    "materialAr" TEXT,
    "materialTr" TEXT,
    "styleEn" TEXT,
    "styleAr" TEXT,
    "styleTr" TEXT,

    CONSTRAINT "Project_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Testimonial" (
    "id" SERIAL NOT NULL,
    "author" TEXT NOT NULL,
    "category" TEXT NOT NULL DEFAULT 'General',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "quoteEn" TEXT NOT NULL,
    "quoteAr" TEXT NOT NULL,
    "quoteTr" TEXT NOT NULL,
    "roleEn" TEXT NOT NULL,
    "roleAr" TEXT NOT NULL,
    "roleTr" TEXT NOT NULL,

    CONSTRAINT "Testimonial_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Inquiry" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT,
    "message" TEXT NOT NULL,
    "type" TEXT NOT NULL DEFAULT 'Contact',
    "details" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Inquiry_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Project_slug_key" ON "Project"("slug");
