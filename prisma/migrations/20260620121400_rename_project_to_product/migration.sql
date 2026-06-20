-- Rename the Project table to Product
ALTER TABLE "Project" RENAME TO "Product";

-- Rename the index on the slug column
ALTER INDEX "Project_slug_key" RENAME TO "Product_slug_key";

-- Rename the primary key constraint
ALTER TABLE "Product" RENAME CONSTRAINT "Project_pkey" TO "Product_pkey";

-- Rename the foreign key on collectionId
ALTER TABLE "Product" RENAME CONSTRAINT "Project_collectionId_fkey" TO "Product_collectionId_fkey";
