import { router, publicProcedure } from "@/app/server/trpc/trpc";

import prisma from "@/app/server/db/prisma";
import { z } from "zod";
import {updateWineSchema, createWineSchema } from "@/app/lib/definitions";


const findWineSchema = z.object({
  id: z.number(),
});
export const wineRouter = router({
  getWines: publicProcedure.query(async () => {
    return await prisma.wine.findMany();
  }),

  getWine: publicProcedure.input(findWineSchema).query(async ({ input }) => {
    return await prisma.wine.findUnique({
      where: {
        id: input.id,
      },
    });
  }),
  getVarietals: publicProcedure.query(async () => {
    return await prisma.varietal.findMany();
  }),

  getWineVarietals: publicProcedure.input(findWineSchema).query(async ({input}) => {
    return await prisma.wineVarietal.findMany({
        where: { 
            wineId: input.id
        },
        include: {
          varietal: true, // Include the related Varietal data
        },
        });
  }),
createWine: publicProcedure
  .input(createWineSchema)
  .mutation(async ({ input }) => {
    try {
      const isValid = await validateVarietalIds(input.varietals);
      if (!isValid) {
        throw new Error("One or more varietal IDs are invalid");
      }

      // Log the input data for debugging
      console.log("Received input data:", input);

      const createdWine = await prisma.wine.create({
        data: {
          name: input.name,
          year: input.year,
          type: input.type,
          rating: input.rating,
          consumed: input.consumed,
          date_consumed: input.date_consumed,
          varietals: {
            createMany: {
              data: input.varietals.map((varietalId) => ({
                varietalId: varietalId,
              })),
              skipDuplicates: true,
            },
          },
        },
      });

      // Log the created wine for debugging
      console.log("Created wine:", createdWine);

      return createdWine;
    } catch (error) {
      // Log any errors that occur during the mutation
      console.error("Error in createWine mutation:", error);

      throw error; // Re-throw the error for handling on the client-side
    }
  }),

  updateWine: publicProcedure
    .input(updateWineSchema)
    .mutation(async ({ input }) => {
      const isValid = await validateVarietalIds(input.varietals);
      if (!isValid) {
        throw new Error("One or more varietal IDs are invalid");
      }
      return await prisma.wine.update({
        where: {
          id: input.id,
        },
        data: {
          name: input.name,
          year: input.year,
          type: input.type,
          rating: input.rating,
          consumed: input.consumed,
          date_consumed: input.date_consumed,
          varietals: {
            createMany: {
              data: input.varietals.map((varietalId) => ({
                varietalId: varietalId,
              })),
              skipDuplicates: true,
            },
          },
        },
      });
    }),
});
async function validateVarietalIds(varietalIds: number[]) {
  const varietalsCount = await prisma.varietal.count({
    where: {
      id: { in: varietalIds },
    },
  });

  return varietalsCount === varietalIds.length;
}
