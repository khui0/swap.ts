import { db } from "$lib/server/db/index.js";
import { swapGroup, swapGroupMember, user } from "$lib/server/db/schema.js";
import { desc, eq, or } from "drizzle-orm";

export async function load({ locals }) {
  if (locals.user && locals.session) {
    const userGroups = await db
      .selectDistinct({
        createdAt: swapGroup.createdAt,
        updatedAt: swapGroup.updatedAt,
        name: swapGroup.name,
        description: swapGroup.description,
        code: swapGroup.code,
        closed: swapGroup.closed,
        owner: user.name,
      })
      .from(swapGroup)
      .leftJoin(swapGroupMember, eq(swapGroupMember.groupId, swapGroup.id))
      .leftJoin(user, eq(swapGroup.ownerId, user.id))
      .where(or(eq(swapGroup.ownerId, locals.user.id), eq(swapGroupMember.userId, locals.user.id)))
      .orderBy(desc(swapGroup.updatedAt));

    return {
      groups: userGroups,
    };
  }
}
