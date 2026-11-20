import { z } from "zod";

export const timeWindow = z.enum(['day', 'week']);
export const mediaType = z.enum(['movie', 'tv']);

export const trendingParams = z.object({mediaType, timeWindow})
export const allParams = z.object({mediaType})

export const detailsParams = z.object({
    type: mediaType,
    id: z.coerce.number().int().positive(),
});

export const searchQuery = z.object({q: z.string().trim().min(1).max(100)});

export const credentials= z.object({
    email: z.string().trim().toLowerCase().pipe(z.email()),
    password: z.string().min(6).max(72),
})
export const credentialsVarify = z.object({
    email: z.string().trim().toLowerCase().pipe(z.email()),
    token: z.string().trim()
})

export const favoriteBody = z.object({
    type: mediaType,
    id: z.coerce.number().int().positive(),
})