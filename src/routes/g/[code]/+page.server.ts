import { db } from "$lib/server/db/index.js";
import { swapGroup, swapGroupMember, user } from "$lib/server/db/schema.js";
import { error } from "@sveltejs/kit";
import { and, eq, or } from "drizzle-orm";

export async function load({ locals, params }) {
  if (locals.user && locals.session) {
    const group = (
      await db
        .select({
          id: swapGroup.id,
          createdAt: swapGroup.createdAt,
          updatedAt: swapGroup.updatedAt,
          name: swapGroup.name,
          description: swapGroup.description,
          code: swapGroup.code,
          closed: swapGroup.closed,
          owner: {
            name: user.name,
            id: user.id,
          },
        })
        .from(swapGroup)
        .leftJoin(swapGroupMember, eq(swapGroupMember.groupId, swapGroup.id))
        .leftJoin(user, eq(swapGroup.ownerId, user.id))
        .where(
          and(
            eq(swapGroup.code, params.code),
            or(eq(swapGroup.ownerId, locals.user.id), eq(swapGroupMember.userId, locals.user.id)),
          ),
        )
    )[0];

    if (!group) {
      return error(403, "Unauthorized");
    }

    const members = await db
      .select({
        id: user.id,
        name: user.name,
        message: swapGroupMember.message,
        hiddenMessage: swapGroupMember.hiddenMessage,
      })
      .from(swapGroupMember)
      .leftJoin(user, eq(swapGroupMember.userId, user.id))
      .where(eq(swapGroupMember.groupId, group.id));

    const self = (
      await db
        .select({
          name: user.name,
          message: swapGroupMember.message,
          hiddenMessage: swapGroupMember.hiddenMessage,
        })
        .from(swapGroupMember)
        .leftJoin(user, eq(swapGroupMember.userId, user.id))
        .where(
          and(eq(swapGroupMember.groupId, group.id), eq(swapGroupMember.userId, locals.user.id)),
        )
    )[0];

    return {
      group,
      self,
      members: members.map((user) => ({
        id: user.id,
        name: user.name,
        message: user.hiddenMessage ? "" : user.message,
        hiddenMessage: user.hiddenMessage,
      })),
      isOwner: group.owner?.id === locals.user.id,
    };
  } else {
    return error(403, "Unauthorized");
  }
}
