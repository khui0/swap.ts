import { db } from "$lib/server/db/index.js";
import { swapGroup, user } from "$lib/server/db/schema.js";
import { and, eq } from "drizzle-orm";

export async function load({ locals, params }) {
  if (locals.user && locals.session) {
    const group = await db
      .select({
        createdAt: swapGroup.createdAt,
        updatedAt: swapGroup.updatedAt,
        name: swapGroup.name,
        description: swapGroup.description,
        code: swapGroup.code,
        closed: swapGroup.closed,
        owner: user.name,
      })
      .from(swapGroup)
      .leftJoin(user, eq(swapGroup.ownerId, user.id))
      .where(and(eq(swapGroup.code, params.slug), eq(swapGroup.ownerId, locals.user.id)));

    return {
      group,
    };
  }
}
