import { router, publicProcedure } from "@/app/server/trpc/trpc";

import prisma from "@/app/server/db/prisma";
import { z } from "zod";

const createUpdateWineSchema = z.object({
    id: z.number(),
    name: z.string(),
    year: z.number().min(1000, "Year must be at least 1000").max(new Date().getFullYear(), "Year can't be in the future"),
    type: z.enum(['Red', 'White', 'Rosé', 'White Blend', 'Red Blend']),
    varietal: z.enum(['Cabernet Sauvignon', 'Merlot', 'Shiraz', 'Chenin Blanc', 'Sauvignon Blanc', 'Verdelho', 'Chardonnay', 'Durif']),
    rating: z.number().min(1, "Rating must be at least 1").max(5, "Rating must be at most 5"),
    consumed: z.boolean(),
    date_consumed: z.date().optional(),
});

export const wineRouter = router({
  getWines: publicProcedure.query(async () => {
    return await prisma.wines.findMany();
  }),
  createWine: publicProcedure
    .input(createUpdateWineSchema)
    .mutation(async ({ input }) => {
      return await prisma.wines.create({
        data: {
            id: input.id,
            name: input.name,
            year: input.year,
            type: input.type,
            varietal: input.varietal,
            rating: input.rating, //float
            consumed: input.consumed,
            date_consumed: input.date_consumed,
        },
      });
    }),

updateWine: publicProcedure
  .input(createUpdateWineSchema)
  .mutation(async ({ input }) => {
    return await prisma.wines.update({
      where: {
        id: input.id, 
      },
      data: {
        name: input.name,
        year: input.year,
        type: input.type,
        varietal: input.varietal,
        rating: input.rating,
        consumed: input.consumed,
        date_consumed: input.date_consumed,
      },
    });
  }),
});
