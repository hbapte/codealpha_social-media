import { z } from "zod";

export const productReviewSchema = z.object({
    rating: z.number().int().min(1).max(5),
    comment: z.string().min(10),
});

export const productReviewUpdateSchema = z.object({
    rating: z.number().int().min(1).max(5).optional(),
    comment: z.string().min(10).optional(),
});

export const orderSchema = z.object({
    orderItems: z.array(z.object({
        name: z.string(),
        quantity: z.number().int().positive(),
        image: z.string(),
        price: z.number().positive(),
        product: z.string(),
    })),
    shippingAddress: z.object({
        address: z.string(),
        city: z.string(),
        postalCode: z.string(),
        country: z.string(),
    }),
    paymentMethod: z.string(),
    itemsPrice: z.number().positive(),
    taxPrice: z.number().positive(),
    shippingPrice: z.number().positive(),
    totalPrice: z.number().positive(),
});

export const orderUpdateSchema = z.object({
    isPaid: z.boolean().optional(),
    paidAt: z.string().optional(),
    isDelivered: z.boolean().optional(),
    deliveredAt: z.string().optional(),
});

export const orderItemUpdateSchema = z.object({
    quantity: z.number().int().positive().optional(),
});

export const shippingAddressUpdateSchema = z.object({
    address: z.string().optional(),
    city: z.string().optional(),
    postalCode: z.string().optional(),
    country: z.string().optional(),
});

export const paymentResultSchema = z.object({
    id: z.string(),
    status: z.string(),
    update_time: z.string(),
    email_address: z.string(),
});

export const paymentResultUpdateSchema = z.object({
    id: z.string().optional(),
    status: z.string().optional(),
    update_time: z.string().optional(),
    email_address: z.string().optional(),
});

export const reviewSchema = z.object({
    rating: z.number().int().min(1).max(5),
    comment: z.string().min(10),
});

export const reviewUpdateSchema = z.object({
    rating: z.number().int().min(1).max(5).optional(),
    comment: z.string().min(10).optional(),
});

export const userAddressSchema = z.object({
    address: z.string(),
    city: z.string(),
    postalCode: z.string(),
    country: z.string(),
});

export const userAddressUpdateSchema = z.object({
    address: z.string().optional(),
    city: z.string().optional(),
    postalCode: z.string().optional(),
    country: z.string().optional(),
});

export const userPaymentSchema = z.object({
    paymentMethod: z.string(),
});

export const userPaymentUpdateSchema = z.object({
    paymentMethod: z.string().optional(),
});

export const userUpdateProfileSchema = z.object({
    name: z.string().min(3).optional(),
    email: z.string().email().optional(),
});

export const userUpdatePasswordSchema = z.object({
    password: z.string().min(6),
    newPassword: z.string().min(6),
    confirmPassword: z.string().min(6),
});

export const userUpdateRoleSchema = z.object({
    role: z.string().min(3),
});

export const userUpdateStatusSchema = z.object({
    status: z.boolean(),
});
