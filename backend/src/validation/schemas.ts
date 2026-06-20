import { z } from "zod";

const nonEmptyString = z.string().trim().min(1);
const optionalNullableString = z.string().trim().optional().nullable();

export const authLoginSchema = z.object({
  email: nonEmptyString.email(),
  password: nonEmptyString,
});

export const collectionSchema = z.object({
  nameEn: nonEmptyString,
  nameAr: nonEmptyString,
  nameTr: nonEmptyString,
});

export const testimonialSchema = z.object({
  author: nonEmptyString,
  category: z.string().trim().default("General"),
  rating: z.coerce.number().int().min(1).max(5).optional(),
  quoteEn: nonEmptyString,
  quoteAr: nonEmptyString,
  quoteTr: nonEmptyString,
  roleEn: nonEmptyString,
  roleAr: nonEmptyString,
  roleTr: nonEmptyString,
});

export const inquirySchema = z.object({
  name: nonEmptyString,
  email: nonEmptyString.email(),
  phone: optionalNullableString,
  message: nonEmptyString,
  type: z.string().trim().default("Contact").optional(),
  details: z.record(z.unknown()).optional(),
});

export const projectCreateSchema = z.object({
  slug: nonEmptyString,
  category: nonEmptyString,
  subCategory: optionalNullableString,
  roomType: optionalNullableString,
  year: z.coerce.number().int().min(1900).max(3000),
  images: z.array(nonEmptyString).default([]),
  specs: z.record(z.unknown()).optional(),
  beforeImage: optionalNullableString,
  afterImage: optionalNullableString,
  price: z.coerce.number().nonnegative().optional().nullable(),
  budget: optionalNullableString,
  featured: z.boolean().optional().default(false),
  titleEn: nonEmptyString,
  titleAr: nonEmptyString,
  titleTr: nonEmptyString,
  descriptionEn: nonEmptyString,
  descriptionAr: nonEmptyString,
  descriptionTr: nonEmptyString,
  locationEn: nonEmptyString,
  locationAr: nonEmptyString,
  locationTr: nonEmptyString,
  materialEn: optionalNullableString,
  materialAr: optionalNullableString,
  materialTr: optionalNullableString,
  styleEn: optionalNullableString,
  styleAr: optionalNullableString,
  styleTr: optionalNullableString,
  collectionId: z.coerce.number().int().positive().optional().nullable(),
});

export const projectUpdateSchema = projectCreateSchema.partial();
