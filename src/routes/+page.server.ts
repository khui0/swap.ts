import { db } from "$lib/server/db/index.js";
import { swapGroup, swapGroupMember, user } from "$lib/server/db/schema.js";
import { count, desc, eq, or } from "drizzle-orm";

export async function load({ locals }) {
  if (locals.user && locals.session) {
    const userGroups = await db
      .select({
        createdAt: swapGroup.createdAt,
        updatedAt: swapGroup.updatedAt,
        name: swapGroup.name,
        description: swapGroup.description,
        code: swapGroup.code,
        closed: swapGroup.closed,
        owner: user.name,
        memberCount: count(swapGroupMember.groupId).as("memberCount"),
      })
      .from(swapGroup)
      .leftJoin(swapGroupMember, eq(swapGroupMember.groupId, swapGroup.id))
      .leftJoin(user, eq(swapGroup.ownerId, user.id))
      .where(or(eq(swapGroup.ownerId, locals.user.id), eq(swapGroupMember.userId, locals.user.id)))
      .groupBy(
        swapGroup.createdAt,
        swapGroup.updatedAt,
        swapGroup.name,
        swapGroup.description,
        swapGroup.code,
        swapGroup.closed,
        user.name,
      )
      .orderBy(desc(swapGroup.updatedAt));

    return {
      groups: userGroups,
    };
  }
}
