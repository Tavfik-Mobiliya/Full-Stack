"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.projectUpdateSchema = exports.projectCreateSchema = exports.inquirySchema = exports.testimonialSchema = exports.collectionSchema = exports.authLoginSchema = void 0;
const zod_1 = require("zod");
const nonEmptyString = zod_1.z.string().trim().min(1);
const optionalNullableString = zod_1.z.string().trim().optional().nullable();
exports.authLoginSchema = zod_1.z.object({
    email: nonEmptyString.email(),
    password: nonEmptyString,
});
exports.collectionSchema = zod_1.z.object({
    nameEn: nonEmptyString,
    nameAr: nonEmptyString,
    nameTr: nonEmptyString,
});
exports.testimonialSchema = zod_1.z.object({
    author: nonEmptyString,
    category: zod_1.z.string().trim().default("General"),
    rating: zod_1.z.coerce.number().int().min(1).max(5).optional(),
    quoteEn: nonEmptyString,
    quoteAr: nonEmptyString,
    quoteTr: nonEmptyString,
    roleEn: nonEmptyString,
    roleAr: nonEmptyString,
    roleTr: nonEmptyString,
});
exports.inquirySchema = zod_1.z.object({
    name: nonEmptyString,
    email: nonEmptyString.email(),
    phone: optionalNullableString,
    message: nonEmptyString,
    type: zod_1.z.string().trim().default("Contact").optional(),
    details: zod_1.z.record(zod_1.z.unknown()).optional(),
});
exports.projectCreateSchema = zod_1.z.object({
    slug: nonEmptyString,
    category: nonEmptyString,
    subCategory: optionalNullableString,
    roomType: optionalNullableString,
    year: zod_1.z.coerce.number().int().min(1900).max(3000),
    images: zod_1.z.array(nonEmptyString).default([]),
    specs: zod_1.z.record(zod_1.z.unknown()).optional(),
    beforeImage: optionalNullableString,
    afterImage: optionalNullableString,
    price: zod_1.z.coerce.number().nonnegative().optional().nullable(),
    budget: optionalNullableString,
    featured: zod_1.z.boolean().optional().default(false),
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
    collectionId: zod_1.z.coerce.number().int().positive().optional().nullable(),
});
exports.projectUpdateSchema = exports.projectCreateSchema.partial();
