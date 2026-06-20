"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const schemas_1 = require("./schemas");
describe("Validation Schemas", () => {
    describe("authLoginSchema", () => {
        it("should succeed with a valid email and non-empty password", () => {
            const result = schemas_1.authLoginSchema.safeParse({
                email: "admin@example.com",
                password: "securepassword123",
            });
            expect(result.success).toBe(true);
            if (result.success) {
                expect(result.data.email).toBe("admin@example.com");
                expect(result.data.password).toBe("securepassword123");
            }
        });
        it("should trim email and password", () => {
            const result = schemas_1.authLoginSchema.safeParse({
                email: "  admin@example.com  ",
                password: "  securepassword123  ",
            });
            expect(result.success).toBe(true);
            if (result.success) {
                expect(result.data.email).toBe("admin@example.com");
                expect(result.data.password).toBe("securepassword123");
            }
        });
        it("should fail with an invalid email format", () => {
            const result = schemas_1.authLoginSchema.safeParse({
                email: "notanemail",
                password: "password",
            });
            expect(result.success).toBe(false);
        });
        it("should fail with an empty password", () => {
            const result = schemas_1.authLoginSchema.safeParse({
                email: "admin@example.com",
                password: "   ",
            });
            expect(result.success).toBe(false);
        });
    });
    describe("collectionSchema", () => {
        it("should succeed with English, Arabic, and Turkish name translations", () => {
            const result = schemas_1.collectionSchema.safeParse({
                nameEn: "Modern Collection",
                nameAr: "المجموعة الحديثة",
                nameTr: "Modern Koleksiyon",
            });
            expect(result.success).toBe(true);
        });
        it("should fail if any name field is missing", () => {
            const result = schemas_1.collectionSchema.safeParse({
                nameEn: "Modern Collection",
                nameAr: "المجموعة الحديثة",
            });
            expect(result.success).toBe(false);
        });
        it("should fail if any name field is empty", () => {
            const result = schemas_1.collectionSchema.safeParse({
                nameEn: "Modern Collection",
                nameAr: "المجموعة الحديثة",
                nameTr: "  ",
            });
            expect(result.success).toBe(false);
        });
    });
    describe("testimonialSchema", () => {
        const validTestimonial = {
            author: "Jane Doe",
            quoteEn: "Amazing designs!",
            quoteAr: "تصاميم مذهلة!",
            quoteTr: "Harika tasarımlar!",
            roleEn: "Founder",
            roleAr: "مؤسس",
            roleTr: "Kurucu",
        };
        it("should succeed with all required fields and set default category", () => {
            const result = schemas_1.testimonialSchema.safeParse(validTestimonial);
            expect(result.success).toBe(true);
            if (result.success) {
                expect(result.data.category).toBe("General");
                expect(result.data.rating).toBeUndefined();
            }
        });
        it("should succeed with a custom category and rating", () => {
            const result = schemas_1.testimonialSchema.safeParse({
                ...validTestimonial,
                category: "Residential",
                rating: 5,
            });
            expect(result.success).toBe(true);
            if (result.success) {
                expect(result.data.category).toBe("Residential");
                expect(result.data.rating).toBe(5);
            }
        });
        it("should coerce rating string to number", () => {
            const result = schemas_1.testimonialSchema.safeParse({
                ...validTestimonial,
                rating: "4",
            });
            expect(result.success).toBe(true);
            if (result.success) {
                expect(result.data.rating).toBe(4);
            }
        });
        it("should fail with rating out of range [1, 5]", () => {
            const tooLow = schemas_1.testimonialSchema.safeParse({ ...validTestimonial, rating: 0 });
            const tooHigh = schemas_1.testimonialSchema.safeParse({ ...validTestimonial, rating: 6 });
            expect(tooLow.success).toBe(false);
            expect(tooHigh.success).toBe(false);
        });
        it("should fail if rating is not an integer", () => {
            const result = schemas_1.testimonialSchema.safeParse({ ...validTestimonial, rating: 4.5 });
            expect(result.success).toBe(false);
        });
        it("should fail with missing translations", () => {
            const result = schemas_1.testimonialSchema.safeParse({
                ...validTestimonial,
                quoteTr: undefined,
            });
            expect(result.success).toBe(false);
        });
    });
    describe("inquirySchema", () => {
        const validInquiry = {
            name: "John Smith",
            email: "john@example.com",
            message: "Hello, I am interested in your services.",
        };
        it("should succeed with minimum required fields and set default type", () => {
            const result = schemas_1.inquirySchema.safeParse(validInquiry);
            expect(result.success).toBe(true);
            if (result.success) {
                expect(result.data.type).toBe("Contact");
                expect(result.data.phone).toBeUndefined();
                expect(result.data.details).toBeUndefined();
            }
        });
        it("should succeed with optional phone, custom type, and details", () => {
            const details = { projectType: "Kitchen remodel", budgetRange: "$10k-$20k" };
            const result = schemas_1.inquirySchema.safeParse({
                ...validInquiry,
                phone: "+90 555 123 4567",
                type: "Project Inquiry",
                details,
            });
            expect(result.success).toBe(true);
            if (result.success) {
                expect(result.data.phone).toBe("+90 555 123 4567");
                expect(result.data.type).toBe("Project Inquiry");
                expect(result.data.details).toEqual(details);
            }
        });
        it("should allow phone to be null", () => {
            const result = schemas_1.inquirySchema.safeParse({
                ...validInquiry,
                phone: null,
            });
            expect(result.success).toBe(true);
            if (result.success) {
                expect(result.data.phone).toBeNull();
            }
        });
        it("should fail with an invalid email format", () => {
            const result = schemas_1.inquirySchema.safeParse({
                ...validInquiry,
                email: "notanemail",
            });
            expect(result.success).toBe(false);
        });
        it("should fail with a missing message", () => {
            const result = schemas_1.inquirySchema.safeParse({
                name: "John Smith",
                email: "john@example.com",
            });
            expect(result.success).toBe(false);
        });
    });
    describe("productCreateSchema", () => {
        const validProject = {
            slug: "luxury-villa-istanbul",
            category: "Interior",
            year: 2024,
            titleEn: "Luxury Villa Istanbul",
            titleAr: "فيلا فاخرة اسطنبول",
            titleTr: "Lüks Villa İstanbul",
            descriptionEn: "A beautiful seaside villa project.",
            descriptionAr: "مشروع فيلا جميلة على البحر.",
            descriptionTr: "Güzel bir sahil villası projesi.",
            locationEn: "Istanbul, Turkey",
            locationAr: "اسطنبول، تركيا",
            locationTr: "İstanbul, Türkiye",
        };
        it("should succeed with minimal required fields and set default images array", () => {
            const result = schemas_1.productCreateSchema.safeParse(validProject);
            expect(result.success).toBe(true);
            if (result.success) {
                expect(result.data.images).toEqual([]);
                expect(result.data.featured).toBe(false);
                expect(result.data.subCategory).toBeUndefined();
            }
        });
        it("should succeed with coerced year and positive collectionId", () => {
            const result = schemas_1.productCreateSchema.safeParse({
                ...validProject,
                year: "2025",
                collectionId: "3",
                price: "125000",
            });
            expect(result.success).toBe(true);
            if (result.success) {
                expect(result.data.year).toBe(2025);
                expect(result.data.collectionId).toBe(3);
                expect(result.data.price).toBe(125000);
            }
        });
        it("should fail if year is less than 1900 or greater than 3000", () => {
            const tooLow = schemas_1.productCreateSchema.safeParse({ ...validProject, year: 1899 });
            const tooHigh = schemas_1.productCreateSchema.safeParse({ ...validProject, year: 3001 });
            expect(tooLow.success).toBe(false);
            expect(tooHigh.success).toBe(false);
        });
        it("should fail if collectionId is non-positive or not integer", () => {
            const negative = schemas_1.productCreateSchema.safeParse({ ...validProject, collectionId: -1 });
            const zero = schemas_1.productCreateSchema.safeParse({ ...validProject, collectionId: 0 });
            expect(negative.success).toBe(false);
            expect(zero.success).toBe(false);
        });
        it("should fail with missing title or translation field", () => {
            const result = schemas_1.productCreateSchema.safeParse({
                ...validProject,
                titleEn: undefined,
            });
            expect(result.success).toBe(false);
        });
    });
    describe("productUpdateSchema", () => {
        it("should succeed with an empty object", () => {
            const result = schemas_1.productUpdateSchema.safeParse({});
            expect(result.success).toBe(true);
        });
        it("should succeed with a partial set of fields", () => {
            const result = schemas_1.productUpdateSchema.safeParse({
                year: 2026,
                price: 999.99,
            });
            expect(result.success).toBe(true);
            if (result.success) {
                expect(result.data.year).toBe(2026);
                expect(result.data.price).toBe(999.99);
            }
        });
        it("should fail if partial fields are invalid", () => {
            const result = schemas_1.productUpdateSchema.safeParse({
                year: 1500, // Invalid year
            });
            expect(result.success).toBe(false);
        });
    });
});
