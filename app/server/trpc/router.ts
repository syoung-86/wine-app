import { router, publicProcedure } from "@/app/server/trpc/trpc";

import { wineRouter } from "./routes/list";

export const appRouter = router({
  healthcheck: publicProcedure.query(() => {
    return "OK";
  }),
  wines: wineRouter ,
});

export type AppRouter = typeof appRouter;
